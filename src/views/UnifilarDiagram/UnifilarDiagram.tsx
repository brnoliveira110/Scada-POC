import React, { useMemo, useState } from 'react'
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  MarkerType
} from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useSCADAStore } from '../../store/useSCADAStore'
import { GeneratorNode, TransformerNode, BreakerNode } from './CustomNodes'
import { Zap, Cpu, ShoppingBag } from 'lucide-react'

// Define our custom node components mapping
const nodeTypes = {
  generator: GeneratorNode,
  transformer: TransformerNode,
  breaker: BreakerNode,
}

export const UnifilarDiagram: React.FC = () => {
  const { telemetry } = useSCADAStore()
  const status = telemetry.breakerStatus
  const isActive = status === 'ligado'

  // Diagram tab: 'substation' | 'paper' | 'shopping'
  const [activeDiagram, setActiveDiagram] = useState<'substation' | 'paper' | 'shopping'>('substation')

  // Nodes computed based on active diagram
  const nodes = useMemo(() => {
    switch (activeDiagram) {
      case 'paper':
        return [
          {
            id: 'pf-gen-1',
            type: 'generator',
            position: { x: 50, y: 150 },
            data: {},
          },
          {
            id: 'pf-trafo-1',
            type: 'transformer',
            position: { x: 330, y: 150 },
            data: {},
          },
          {
            id: 'pf-breaker-1',
            type: 'breaker',
            position: { x: 610, y: 150 },
            data: {},
          },
          {
            id: 'pf-load-mixer',
            type: 'output',
            position: { x: 910, y: 70 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-3 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[9px] text-gray-500 uppercase block tracking-wider">MOTOR MISTURADOR</span>
                  <span className="text-xs font-bold text-white font-display block mt-1">Misturador A01</span>
                  <span className={`text-[10px] block mt-1 font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                    {isActive ? `${(telemetry.current * 0.45).toFixed(0)} A @ 440V` : 'DESCONECTADO'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 170 }
          },
          {
            id: 'pf-load-dryer',
            type: 'output',
            position: { x: 910, y: 240 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-3 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[9px] text-gray-500 uppercase block tracking-wider">ROLO DE SECAGEM</span>
                  <span className="text-xs font-bold text-white font-display block mt-1">Calandra Secadora</span>
                  <span className={`text-[10px] block mt-1 font-bold ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
                    {isActive ? `${telemetry.motorSpeed} RPM` : 'INATIVO'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 170 }
          }
        ]

      case 'shopping':
        return [
          {
            id: 'sm-gen-1',
            type: 'generator',
            position: { x: 50, y: 150 },
            data: {},
          },
          {
            id: 'sm-trafo-1',
            type: 'transformer',
            position: { x: 330, y: 150 },
            data: {},
          },
          {
            id: 'sm-breaker-1',
            type: 'breaker',
            position: { x: 610, y: 150 },
            data: {},
          },
          {
            id: 'sm-load-chiller',
            type: 'output',
            position: { x: 910, y: 30 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-2.5 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[8px] text-gray-500 uppercase block tracking-wider">AR CONDICIONADO</span>
                  <span className="text-[11px] font-bold text-white font-display block mt-0.5">Centrais Chiller</span>
                  <span className={`text-[9px] block mt-0.5 font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                    {isActive ? `${telemetry.motorSpeed} RPM` : '0 RPM'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 160 }
          },
          {
            id: 'sm-load-food',
            type: 'output',
            position: { x: 910, y: 150 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-2.5 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[8px] text-gray-500 uppercase block tracking-wider">ILUMINAÇÃO/TOMADAS</span>
                  <span className="text-[11px] font-bold text-white font-display block mt-0.5">Praça Alimentação</span>
                  <span className={`text-[9px] block mt-0.5 font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {isActive ? `${(telemetry.current * 0.35).toFixed(0)} A` : 'ESCURIDÃO'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 160 }
          },
          {
            id: 'sm-load-stores',
            type: 'output',
            position: { x: 910, y: 270 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-2.5 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[8px] text-gray-500 uppercase block tracking-wider">ILUMINAÇÃO LOJAS</span>
                  <span className="text-[11px] font-bold text-white font-display block mt-0.5">Lojas Setores A/B</span>
                  <span className={`text-[9px] block mt-0.5 font-bold ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>
                    {isActive ? `${(telemetry.current * 0.20).toFixed(0)} A` : 'EMERGÊNCIA'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 160 }
          }
        ]

      case 'substation':
      default:
        return [
          {
            id: 'gen-1',
            type: 'generator',
            position: { x: 50, y: 150 },
            data: {},
          },
          {
            id: 'trafo-1',
            type: 'transformer',
            position: { x: 330, y: 150 },
            data: {},
          },
          {
            id: 'breaker-1',
            type: 'breaker',
            position: { x: 610, y: 150 },
            data: {},
          },
          {
            id: 'load-1',
            type: 'output',
            position: { x: 910, y: 175 },
            data: { 
              label: (
                <div className="text-center font-mono-scada p-3 rounded-lg border border-[#1f2937] bg-[#111318]/95 shadow-xl">
                  <span className="text-[9px] text-gray-500 uppercase block tracking-wider">MATRIZ / CONSUMIDOR</span>
                  <span className="text-xs font-bold text-white font-display block mt-1">Carga Industrial</span>
                  <span className={`text-[10px] block mt-1 font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {isActive ? `${telemetry.current.toFixed(0)} A @ 138kV` : 'SEM ENERGIA'}
                  </span>
                </div>
              )
            },
            style: { border: 'none', padding: 0, width: 180 }
          }
        ]
    }
  }, [activeDiagram, isActive, telemetry.current, telemetry.motorSpeed])

  // Edges computed based on active diagram and breaker status
  const edges: Edge[] = useMemo(() => {
    const flowColor = status === 'ligado' 
      ? '#3b82f6' 
      : status === 'falha'
        ? '#f59e0b' 
        : '#374151'

    const isFlowActive = status === 'ligado'
    const commonEdgeStyles = { 
      stroke: flowColor, 
      strokeWidth: 3,
      filter: isFlowActive ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
      transition: 'stroke 0.4s ease, filter 0.4s ease',
    }

    const commonMarker = {
      type: MarkerType.ArrowClosed,
      color: flowColor,
      width: 15,
      height: 15,
    }

    switch (activeDiagram) {
      case 'paper':
        return [
          {
            id: 'pe-gen-trafo',
            source: 'pf-gen-1',
            sourceHandle: 'a',
            target: 'pf-trafo-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'pe-trafo-breaker',
            source: 'pf-trafo-1',
            sourceHandle: 'out',
            target: 'pf-breaker-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'pe-breaker-mixer',
            source: 'pf-breaker-1',
            sourceHandle: 'out',
            target: 'pf-load-mixer',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'pe-breaker-dryer',
            source: 'pf-breaker-1',
            sourceHandle: 'out',
            target: 'pf-load-dryer',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          }
        ]

      case 'shopping':
        return [
          {
            id: 'se-gen-trafo',
            source: 'sm-gen-1',
            sourceHandle: 'a',
            target: 'sm-trafo-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'se-trafo-breaker',
            source: 'sm-trafo-1',
            sourceHandle: 'out',
            target: 'sm-breaker-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'se-breaker-chiller',
            source: 'sm-breaker-1',
            sourceHandle: 'out',
            target: 'sm-load-chiller',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'se-breaker-food',
            source: 'sm-breaker-1',
            sourceHandle: 'out',
            target: 'sm-load-food',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'se-breaker-stores',
            source: 'sm-breaker-1',
            sourceHandle: 'out',
            target: 'sm-load-stores',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          }
        ]

      case 'substation':
      default:
        return [
          {
            id: 'e-gen-trafo',
            source: 'gen-1',
            sourceHandle: 'a',
            target: 'trafo-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'e-trafo-breaker',
            source: 'trafo-1',
            sourceHandle: 'out',
            target: 'breaker-1',
            targetHandle: 'in',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          },
          {
            id: 'e-breaker-load',
            source: 'breaker-1',
            sourceHandle: 'out',
            target: 'load-1',
            animated: isFlowActive,
            style: commonEdgeStyles,
            markerEnd: commonMarker,
          }
        ]
    }
  }, [activeDiagram, status])

  return (
    <div className="h-full w-full flex flex-col relative">
      
      {/* Topology Header Panel */}
      <div className="absolute top-4 left-4 z-10 glass-panel p-4 rounded-xl border border-[#1f2937] max-w-sm pointer-events-auto">
        <h3 className="text-sm font-bold tracking-wider font-display text-white flex items-center space-x-1.5">
          <Zap size={16} className="text-blue-400 fill-blue-400/10" />
          <span>FLUXO DE TOPOLOGIA ELÉTRICA</span>
        </h3>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
          Selecione uma planta de rede no menu abaixo. O disjuntor opera reativamente. Clique em seu nó para ligar/desligar o circuito.
        </p>

        {/* Diagram Selector Button Group */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#0c0d12]/60 p-1 rounded-lg border border-[#1f2937]/50 text-[10px]">
          <button
            onClick={() => setActiveDiagram('substation')}
            className={`py-1.5 rounded font-semibold transition-all cursor-pointer text-center ${
              activeDiagram === 'substation' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Subestação
          </button>
          
          <button
            onClick={() => setActiveDiagram('paper')}
            className={`py-1.5 rounded font-semibold transition-all cursor-pointer text-center flex items-center justify-center space-x-0.5 ${
              activeDiagram === 'paper' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cpu size={10} />
            <span>Fábrica Papel</span>
          </button>

          <button
            onClick={() => setActiveDiagram('shopping')}
            className={`py-1.5 rounded font-semibold transition-all cursor-pointer text-center flex items-center justify-center space-x-0.5 ${
              activeDiagram === 'shopping' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShoppingBag size={10} />
            <span>Shopping</span>
          </button>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono-scada bg-[#0c0d12]/50 p-2 rounded">
          <span className="text-gray-500">Status Geral:</span>
          <span className={`font-semibold uppercase ${
            status === 'ligado' ? 'text-green-400' : status === 'desligado' ? 'text-red-400' : 'text-amber-400'
          }`}>{status}</span>
        </div>
      </div>

      {/* Legend Panel */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-4 py-2.5 rounded-lg border border-[#1f2937] text-[10px] font-mono-scada space-y-1">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-6 bg-blue-500 inline-block rounded"></span>
          <span className="text-gray-300">Linha de Fluxo Energizada</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-6 bg-amber-500 inline-block rounded"></span>
          <span className="text-gray-300">Falha Geral Reportada</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-6 bg-gray-700 inline-block rounded"></span>
          <span className="text-gray-400">Circuito Desconectado</span>
        </div>
      </div>

      {/* Flow Editor Workspace */}
      <div className="flex-1 bg-[#090a0f] scada-grid">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={true}
          connectOnClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1f2937" gap={16} size={1} />
          <Controls className="!bg-[#111318] !border-[#1f2937] !fill-gray-400 [&_button]:!border-[#1f2937]/50 [&_button]:hover:!bg-[#1c1e27] [&_svg]:!fill-gray-400" />
          <MiniMap 
            bgColor="#090a0f" 
            nodeColor={() => '#111318'} 
            maskColor="rgba(0,0,0,0.4)" 
            className="!border-[#1f2937] !bg-[#0b0c10]"
          />
        </ReactFlow>
      </div>
    </div>
  )
}
