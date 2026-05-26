import React, { useCallback } from 'react'
import { ReactFlow, Background, Controls, MiniMap, ConnectionMode, MarkerType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { RectNode, CircleNode, TextNode, ImageNode } from './nodes/CustomNodes'
import type { SCADANode, SCADAEdge } from '../../../store/types'
import { useSCADAStore } from '../../../store/useSCADAStore'

const nodeTypes = {
  rectNode: RectNode,
  circleNode: CircleNode,
  textNode: TextNode,
  imageNode: ImageNode,
}

interface DrawingCanvasProps {
  nodes: SCADANode[]
  edges: SCADAEdge[]
  canvasBgColor: string
  canvasBgImage: string | null
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>
  handleCanvasDragOver: (e: React.DragEvent) => void
  handleCanvasDrop: (e: React.DragEvent, screenToFlowPosition: any) => void
  onNodesChange: any
  onEdgesChange: any
  onConnect: any
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  nodes,
  edges,
  canvasBgColor,
  canvasBgImage,
  reactFlowWrapper,
  handleCanvasDragOver,
  handleCanvasDrop,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const telemetry = useSCADAStore(state => state.telemetry)
  const isFlowActive = telemetry.breakerStatus === 'ligado'
  const flowColor = telemetry.breakerStatus === 'ligado' ? '#3b82f6' : telemetry.breakerStatus === 'falha' ? '#f59e0b' : '#4b5563'

  // Apply global telemetry styles to all edges to create the "animated cable" effect
  const styledEdges = edges.map(edge => ({
    ...edge,
    animated: isFlowActive,
    style: {
      stroke: flowColor,
      strokeWidth: 3,
      filter: isFlowActive ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
      transition: 'stroke 0.4s ease, filter 0.4s ease',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: flowColor,
    },
  }))

  const onDragOverWrapper = useCallback((event: React.DragEvent) => {
    handleCanvasDragOver(event)
  }, [handleCanvasDragOver])

  const onDropWrapper = useCallback(
    (event: React.DragEvent) => {
      // screenToFlowPosition is not available directly here without useReactFlow, 
      // but we wrap ReactFlowProvider around this component higher up (in SCADABuilder.tsx)
      // So we will actually handle onDrop inside a child component or use the instance directly.
      // We will pass the event up and SCADABuilder will use its hook to resolve the position.
      handleCanvasDrop(event, null) 
    },
    [handleCanvasDrop]
  )

  return (
    <div 
      className="flex-1 min-h-0 w-full h-full relative border border-[#1f2937]/30 rounded-xl overflow-hidden" 
      ref={reactFlowWrapper as React.RefObject<HTMLDivElement>}
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: canvasBgColor,
          backgroundImage: canvasBgImage ? `url(${canvasBgImage})` : undefined,
          backgroundSize: canvasBgImage ? 'cover' : undefined,
          backgroundPosition: canvasBgImage ? 'center' : undefined,
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOverWrapper}
        onDrop={onDropWrapper}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={4}
        className="z-10"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f2937" gap={16} size={1} />
        <Controls className="!bg-[#111318] !border-[#1f2937] !fill-gray-400 [&_button]:!border-[#1f2937]/50 [&_button]:hover:!bg-[#1c1e27] [&_svg]:!fill-gray-400" />
        <MiniMap 
          bgColor="#090a0f" 
          nodeColor={() => '#111318'} 
          maskColor="rgba(0,0,0,0.4)" 
          className="!border-[#1f2937] !bg-[#0b0c10]"
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  )
}
