import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useSCADAStore } from '../../../store/useSCADAStore'
import type { SCADANode } from '../../../store/types'

export const useSCADABuilder = () => {
  const store = useSCADAStore()

  // Local state for UI controls
  const [draggedType, setDraggedType] = useState<string | null>(null)
  const [showRulers, setShowRulers] = useState(true)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  // React Flow Wrapper Ref for drag and drop
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bgFileInputRef = useRef<HTMLInputElement>(null)

  // Current active diagram
  const activeDiagram = useMemo(() => 
    store.diagrams.find(d => d.id === store.activeDiagramId), 
  [store.diagrams, store.activeDiagramId])

  const nodes = activeDiagram?.nodes || []
  const edges = activeDiagram?.edges || []
  const canvasBgColor = activeDiagram?.canvasBgColor || '#0b0c10'
  const canvasBgImage = activeDiagram?.canvasBgImage || null

  // Ensure there's always an active diagram if diagrams exist
  useEffect(() => {
    if (!store.activeDiagramId && store.diagrams.length > 0) {
      store.switchDiagram(store.diagrams[0].id)
    } else if (store.diagrams.length === 0) {
      // Create a default diagram if empty
      store.createDiagram('Diagrama Padrão')
    }
  }, [store.activeDiagramId, store.diagrams])

  // Save plant to LocalStorage
  const handleSavePlant = () => {
    localStorage.setItem('ares_scada_custom_plant_v2', JSON.stringify(store.diagrams))
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 2000)
  }

  // Load saved plant from LocalStorage
  const handleLoadSavedPlant = () => {
    const saved = localStorage.getItem('ares_scada_custom_plant_v2')
    if (!saved) {
      alert('Nenhuma planta salva encontrada no seu navegador. Crie e salve uma primeiro!')
      return
    }
    try {
      const parsed = JSON.parse(saved)
      useSCADAStore.setState({ diagrams: parsed, activeDiagramId: parsed[0]?.id || null })
    } catch (e) {
      console.error('Error loading saved SCADA plant', e)
    }
  }

  // Drag palette item handlers
  const handleDragStartFromPalette = (type: string) => {
    setDraggedType(type)
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleCanvasDrop = (e: React.DragEvent, screenToFlowPosition: (pos: { x: number, y: number }) => { x: number, y: number }) => {
    e.preventDefault()
    if (!draggedType || !reactFlowWrapper.current) return

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })

    const isNode = !draggedType.includes('Edge')

    if (isNode) {
      const defaultNode: Omit<SCADANode, 'id'> = {
        type: draggedType,
        position,
        data: {
          width: draggedType === 'textNode' ? 120 : 80,
          height: draggedType === 'textNode' ? 30 : 80,
          fill: draggedType === 'textNode' ? 'transparent' : '#1f2937',
          stroke: draggedType === 'textNode' ? 'transparent' : '#3b82f6',
          strokeWidth: draggedType === 'textNode' ? 0 : 2,
        }
      }

      if (draggedType === 'textNode') {
        defaultNode.data.text = 'Texto SCADA'
        defaultNode.data.fontSize = 14
        defaultNode.data.fill = '#ffffff'
      }

      store.addNode(defaultNode)
    }

    setDraggedType(null)
  }

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      store.addNode({
        type: 'imageNode',
        position: { x: 100, y: 100 },
        data: {
          width: 120,
          height: 120,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          src: base64
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      store.setCanvasBgImage(base64)
    }
    reader.readAsDataURL(file)
  }

  return {
    store,
    telemetry: store.telemetry,
    activeDiagram,
    nodes,
    edges,
    canvasBgColor,
    canvasBgImage,
    displayPreset: store.displayPreset,
    showRulers,
    setShowRulers,
    showSavedToast,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    reactFlowWrapper,
    fileInputRef,
    bgFileInputRef,
    handleDragStartFromPalette,
    handleCanvasDragOver,
    handleCanvasDrop,
    handleFileUpload,
    handleBgFileUpload,
    handleSavePlant,
    handleLoadSavedPlant
  }
}
