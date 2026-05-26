import type { StateCreator } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange, type Connection, addEdge } from '@xyflow/react'
import type { Diagram, SCADANode, SCADAEdge } from './types'

export interface DiagramSlice {
  diagrams: Diagram[]
  activeDiagramId: string | null
  displayPreset: 'auto' | '1080p' | '4k' | 'ultrawide'
  
  // Actions
  createDiagram: (name: string) => string
  switchDiagram: (id: string) => void
  deleteDiagram: (id: string) => void
  setDisplayPreset: (preset: 'auto' | '1080p' | '4k' | 'ultrawide') => void
  
  // React Flow Actions for active diagram
  onNodesChange: (changes: NodeChange<SCADANode>[]) => void
  onEdgesChange: (changes: EdgeChange<SCADAEdge>[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: Omit<SCADANode, 'id'>) => void
  updateNodeData: (id: string, data: any) => void
  deleteNode: (id: string) => void
  setCanvasBgColor: (color: string) => void
  setCanvasBgImage: (image: string | null) => void
  
  // Templates
  loadPaperFactoryTemplate: () => void
  loadShoppingMallTemplate: () => void
  clearCanvas: () => void
}

const generateId = () => `el-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

export const createDiagramSlice: StateCreator<DiagramSlice, [], [], DiagramSlice> = (set) => ({
  diagrams: [],
  activeDiagramId: null,
  displayPreset: 'auto',

  createDiagram: (name) => {
    const newDiagram: Diagram = {
      id: generateId(),
      name,
      nodes: [],
      edges: [],
      canvasBgColor: '#0b0c10',
      canvasBgImage: null,
    }
    set((state) => ({
      diagrams: [...state.diagrams, newDiagram],
      activeDiagramId: newDiagram.id,
    }))
    return newDiagram.id
  },

  switchDiagram: (id) => {
    set({ activeDiagramId: id })
  },

  deleteDiagram: (id) => {
    set((state) => {
      const newDiagrams = state.diagrams.filter(d => d.id !== id)
      return {
        diagrams: newDiagrams,
        activeDiagramId: state.activeDiagramId === id ? (newDiagrams[0]?.id || null) : state.activeDiagramId
      }
    })
  },

  setDisplayPreset: (preset) => {
    set({ displayPreset: preset })
  },

  onNodesChange: (changes) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return { ...d, nodes: applyNodeChanges(changes, d.nodes) as SCADANode[] }
        }
        return d
      })
      return { diagrams }
    })
  },

  onEdgesChange: (changes) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return { ...d, edges: applyEdgeChanges(changes, d.edges) as SCADAEdge[] }
        }
        return d
      })
      return { diagrams }
    })
  },

  onConnect: (connection) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return { ...d, edges: addEdge(connection, d.edges) as SCADAEdge[] }
        }
        return d
      })
      return { diagrams }
    })
  },

  addNode: (node) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const newNode = { ...node, id: generateId() } as SCADANode
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return { ...d, nodes: [...d.nodes, newNode] }
        }
        return d
      })
      return { diagrams }
    })
  },

  updateNodeData: (id, data) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return {
            ...d,
            nodes: d.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
          }
        }
        return d
      })
      return { diagrams }
    })
  },

  deleteNode: (id) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => {
        if (d.id === state.activeDiagramId) {
          return {
            ...d,
            nodes: d.nodes.filter(n => n.id !== id),
            edges: d.edges.filter(e => e.source !== id && e.target !== id)
          }
        }
        return d
      })
      return { diagrams }
    })
  },

  setCanvasBgColor: (color) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => d.id === state.activeDiagramId ? { ...d, canvasBgColor: color } : d)
      return { diagrams }
    })
  },

  setCanvasBgImage: (image) => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => d.id === state.activeDiagramId ? { ...d, canvasBgImage: image } : d)
      return { diagrams }
    })
  },

  clearCanvas: () => {
    set((state) => {
      if (!state.activeDiagramId) return state
      const diagrams = state.diagrams.map(d => d.id === state.activeDiagramId ? { ...d, nodes: [], edges: [], canvasBgImage: null } : d)
      return { diagrams }
    })
  },

  loadPaperFactoryTemplate: () => {
    const id = generateId()
    const newDiagram: Diagram = {
      id,
      name: 'Fábrica de Papel - Geração de Vapor e Energia',
      canvasBgColor: '#0a0d14',
      canvasBgImage: null,
      nodes: [
        {
          id: 'pf-title',
          type: 'textNode',
          position: { x: 40, y: 30 },
          data: { width: 450, height: 30, text: 'Fábrica de Papel - Caldeira de Recuperação e Geração', fontSize: 16, fill: '#38bdf8' }
        },
        {
          id: 'pf-boiler',
          type: 'imageNode',
          position: { x: 60, y: 150 },
          data: { width: 160, height: 160, src: '/assets/scada_boiler.png', bindValue: 'voltage' }
        },
        {
          id: 'pf-generator',
          type: 'imageNode',
          position: { x: 400, y: 150 },
          data: { width: 160, height: 160, src: '/assets/scada_generator.png', bindValue: 'motorSpeed' }
        },
        {
          id: 'pf-valve',
          type: 'circleNode',
          position: { x: 280, y: 200 },
          data: { width: 40, height: 40, fill: '#1e293b', stroke: '#10b981', strokeWidth: 3, text: 'Válvula', bindValue: 'breakerStatus' }
        }
      ],
      edges: [
        {
          id: 'e-boiler-valve',
          source: 'pf-boiler',
          sourceHandle: 'right',
          target: 'pf-valve',
          targetHandle: 'left'
        },
        {
          id: 'e-valve-gen',
          source: 'pf-valve',
          sourceHandle: 'right',
          target: 'pf-generator',
          targetHandle: 'left'
        }
      ]
    }
    set((state) => ({
      diagrams: [...state.diagrams, newDiagram],
      activeDiagramId: id
    }))
  },

  loadShoppingMallTemplate: () => {
    // Template placeholder - to be implemented fully with React Flow nodes structure
    const id = generateId()
    const newDiagram: Diagram = {
      id,
      name: 'Shopping Mall SCADA',
      canvasBgColor: '#090d16',
      canvasBgImage: null,
      nodes: [
        {
          id: 'sm-title',
          type: 'textNode',
          position: { x: 40, y: 30 },
          data: { width: 450, height: 30, text: 'Shopping Mall SCADA - Subestação e Utilidades', fontSize: 16, fill: '#38bdf8' }
        },
        {
          id: 'sm-transformer',
          type: 'rectNode',
          position: { x: 60, y: 110 },
          data: { width: 120, height: 90, fill: '#1e293b', stroke: '#a855f7', strokeWidth: 2.5, bindValue: 'voltage' }
        }
      ],
      edges: []
    }
    set((state) => ({
      diagrams: [...state.diagrams, newDiagram],
      activeDiagramId: id
    }))
  }
})
