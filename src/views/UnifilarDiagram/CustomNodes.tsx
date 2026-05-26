import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { useSCADAStore } from '../../store/useSCADAStore'
import { AlertOctagon, RotateCw } from 'lucide-react'

// 1. Generator Node (Nó Gerador)
export const GeneratorNode: React.FC = () => {
  const { telemetry } = useSCADAStore()
  const isActive = telemetry.breakerStatus === 'ligado'

  return (
    <div className="w-48 bg-[#111318]/90 border border-[#1f2937] hover:border-blue-500/50 rounded-xl p-4 shadow-2xl glass-panel relative transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono-scada uppercase tracking-widest text-gray-500">GERAÇÃO</span>
        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'}`}></span>
      </div>

      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-lg ${isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-600'} transition-all duration-300`}>
          <RotateCw 
            size={24} 
            className={`${isActive ? 'animate-spin' : ''}`}
            style={{ animationDuration: isActive ? '3s' : '0s' }}
          />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-display">Turbina G-01</h4>
          <span className="text-[10px] text-gray-400 font-mono-scada block">
            {isActive ? `${telemetry.motorSpeed} RPM` : 'INATIVO'}
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-[#1f2937] pt-2 flex justify-between items-center text-[10px] font-mono-scada text-gray-500">
        <span>Saída:</span>
        <span className="text-blue-400 font-bold">13.8 kV</span>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        id="a" 
        className="!bg-blue-500 !w-2.5 !h-2.5 !border-2 !border-[#0b0c10]" 
      />
    </div>
  )
}

// 2. Transformer Node (Nó Transformador)
export const TransformerNode: React.FC = () => {
  const { telemetry } = useSCADAStore()
  const isActive = telemetry.breakerStatus === 'ligado'

  return (
    <div className="w-48 bg-[#111318]/90 border border-[#1f2937] hover:border-purple-500/50 rounded-xl p-4 shadow-2xl glass-panel relative transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono-scada uppercase tracking-widest text-gray-500">TRANSFORMAÇÃO</span>
        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-purple-500 animate-pulse' : 'bg-gray-600'}`}></span>
      </div>

      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-lg ${isActive ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-800 text-gray-600'} transition-all duration-300`}>
          {/* Custom SVG interlinked Inductor Coils schematic */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={isActive ? 'animate-pulse' : ''}>
            <circle cx="8" cy="12" r="5" stroke="currentColor" />
            <circle cx="16" cy="12" r="5" stroke="currentColor" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-display">TRAFO T-01</h4>
          <span className="text-[9px] text-gray-400 font-mono-scada block">
            13.8kV → 138.0kV
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-[#1f2937] pt-2 flex justify-between items-center text-[10px] font-mono-scada text-gray-500">
        <span>Eficiência:</span>
        <span className="text-purple-400 font-bold">98.4%</span>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        id="in" 
        className="!bg-purple-500 !w-2.5 !h-2.5 !border-2 !border-[#0b0c10]" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="out" 
        className="!bg-purple-500 !w-2.5 !h-2.5 !border-2 !border-[#0b0c10]" 
      />
    </div>
  )
}

// 3. Breaker Node (Nó Disjuntor - Reativo e Interativo)
export const BreakerNode: React.FC = () => {
  const { telemetry, toggleBreaker } = useSCADAStore()
  const status = telemetry.breakerStatus

  // Determine styling and display based on breaker status
  let borderClass = 'border-red-500/50 hover:border-red-500'
  let bgClass = 'bg-[#111318]/90'
  let pillClass = 'bg-red-500/10 border-red-500/30 text-red-400'
  let labelText = 'ABERTO (DESL.)'
  let svgPathColor = '#ef4444'
  let pulseClass = ''

  if (status === 'ligado') {
    borderClass = 'border-emerald-500/50 hover:border-emerald-500'
    pillClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    labelText = 'FECHADO (LIG.)'
    svgPathColor = '#10b981'
  } else if (status === 'falha') {
    borderClass = 'border-amber-500'
    bgClass = 'animate-scada-warning'
    pillClass = 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-extrabold'
    labelText = 'BLOQUEADO (FALHA)'
    svgPathColor = '#f59e0b'
    pulseClass = 'animate-pulse'
  }

  return (
    <div 
      onClick={() => toggleBreaker()}
      className={`w-52 ${bgClass} ${borderClass} border-2 rounded-xl p-4 shadow-2xl glass-panel relative transition-all duration-300 cursor-pointer select-none`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono-scada uppercase tracking-widest text-gray-500">DISJUNTOR PRINCIPAL</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase ${pillClass} ${pulseClass}`}>
          {labelText}
        </span>
      </div>

      <div className="flex items-center space-x-3 my-1">
        <div className={`p-2 bg-[#0c0d12]/80 border border-[#1f2937] rounded-lg text-gray-300 relative`}>
          {status === 'ligado' ? (
            // Closed Switch SVG (Conducting)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={svgPathColor} strokeWidth="3" strokeLinecap="round">
              <circle cx="5" cy="12" r="2" fill={svgPathColor} />
              <circle cx="19" cy="12" r="2" fill={svgPathColor} />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : status === 'desligado' ? (
            // Open Switch SVG (Non-conducting)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={svgPathColor} strokeWidth="3" strokeLinecap="round">
              <circle cx="5" cy="12" r="2" fill={svgPathColor} />
              <circle cx="19" cy="12" r="2" fill={svgPathColor} />
              <line x1="5" y1="12" x2="15" y2="5" />
            </svg>
          ) : (
            // Fault Alert SVG
            <AlertOctagon size={24} className="text-amber-500 animate-bounce" />
          )}
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-white uppercase font-display">DISJ-52-1</h4>
          <span className="text-[9px] text-gray-400 font-mono-scada block">
            Clique p/ Operar
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-[#1f2937] pt-2 flex justify-between items-center text-[10px] font-mono-scada text-gray-500">
        <span>Tensão Linha:</span>
        <span className="text-gray-300">{telemetry.voltage.toFixed(1)} kV</span>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        id="in" 
        className="!bg-red-500 !w-2.5 !h-2.5 !border-2 !border-[#0b0c10]" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="out" 
        className="!bg-red-500 !w-2.5 !h-2.5 !border-2 !border-[#0b0c10]" 
      />
    </div>
  )
}
