import React from 'react'
import type { NodeProps } from '@xyflow/react'
import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useSCADAStore } from '../../../../store/useSCADAStore'
import type { Telemetry } from '../../../../store/types'

interface DynamicStyleResult {
  fill: string
  stroke: string
  strokeWidth: number
  extraClasses: string
  textContent: string | undefined
}

// Helper for dynamic styling exactly like we had before
const useDynamicStyles = (data: any): DynamicStyleResult => {
  const telemetry = useSCADAStore(state => state.telemetry)
  
  const defaultStyles = { 
    fill: data.fill, 
    stroke: data.stroke, 
    strokeWidth: data.strokeWidth, 
    extraClasses: '', 
    textContent: data.text 
  }

  if (!data.bindValue) return defaultStyles

  const val = telemetry[data.bindValue as keyof Telemetry]

  if (data.bindValue === 'breakerStatus') {
    const breakerStateStyles: Record<'ligado' | 'desligado' | 'falha', { fill: string, stroke: string, extra: string }> = {
      ligado: { fill: '#10b981', stroke: '#047857', extra: '' },
      desligado: { fill: '#ef4444', stroke: '#b91c1c', extra: '' },
      falha: { fill: '#f59e0b', stroke: '#d97706', extra: 'animate-pulse' }
    }
    const match = breakerStateStyles[val as 'ligado' | 'desligado' | 'falha'] || breakerStateStyles.falha
    return { fill: match.fill, stroke: match.stroke, strokeWidth: data.strokeWidth, extraClasses: match.extra, textContent: data.text }
  }

  if (data.bindValue === 'motorSpeed') {
    const isSpinning = (val as number) > 0
    return { fill: data.fill, stroke: data.stroke, strokeWidth: data.strokeWidth, extraClasses: isSpinning ? 'animate-spin origin-center' : '', textContent: data.text }
  }

  // Numerical variables
  const numVal = val as number
  if (data.bindValue === 'voltage') {
    const isCritical = numVal > 142.0 || numVal < 132.0
    const isAttention = (numVal > 140.0 && numVal <= 142.0) || (numVal >= 132.0 && numVal < 135.0)
    
    const stroke = isCritical ? '#ef4444' : isAttention ? '#f59e0b' : '#10b981'
    const strokeWidth = isCritical ? 3 : isAttention ? 2 : data.strokeWidth
    const extraClasses = isCritical ? 'animate-pulse' : ''
    return { fill: data.fill, stroke, strokeWidth, extraClasses, textContent: `${numVal.toFixed(1)} kV` }
  }

  if (data.bindValue === 'frequency') {
    const isCritical = numVal < 59.50
    const isAttention = numVal >= 59.50 && numVal < 59.80
    
    const stroke = isCritical ? '#ef4444' : isAttention ? '#f59e0b' : '#60a5fa'
    const strokeWidth = isCritical ? 3 : data.strokeWidth
    const extraClasses = isCritical ? 'animate-pulse' : ''
    return { fill: data.fill, stroke, strokeWidth, extraClasses, textContent: `${numVal.toFixed(2)} Hz` }
  }

  if (data.bindValue === 'current') {
    return { fill: data.fill, stroke: '#3b82f6', strokeWidth: data.strokeWidth, extraClasses: '', textContent: `${numVal.toFixed(0)} A` }
  }

  return defaultStyles
}

const NodeHandles = () => (
  <>
    <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-gray-400 !border-gray-800" />
    <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-gray-400 !border-gray-800" />
    <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-blue-400 !border-gray-800" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-blue-400 !border-gray-800" />
  </>
)

export const RectNode: React.FC<NodeProps> = ({ data, selected }) => {
  const w = (data.width as number) || 80
  const h = (data.height as number) || 80
  const { fill, stroke, strokeWidth, extraClasses, textContent } = useDynamicStyles(data)
  
  return (
    <>
      <NodeResizer color="#3b82f6" isVisible={selected} minWidth={20} minHeight={20} />
      <NodeHandles />
      <div style={{ width: w, height: h, backgroundColor: fill as string, border: `${strokeWidth}px solid ${stroke}` }} className={`relative flex items-center justify-center rounded ${extraClasses}`}>
        {!!data.bindValue && (
          <span className="text-[10px] text-white font-mono font-bold select-none">{textContent}</span>
        )}
      </div>
    </>
  )
}

export const CircleNode: React.FC<NodeProps> = ({ data, selected }) => {
  const w = (data.width as number) || 80
  const h = (data.height as number) || 80
  const { fill, stroke, strokeWidth, extraClasses, textContent } = useDynamicStyles(data)
  
  return (
    <>
      <NodeResizer color="#3b82f6" isVisible={selected} minWidth={20} minHeight={20} />
      <NodeHandles />
      <div style={{ width: w, height: h, borderRadius: '50%', backgroundColor: fill as string, border: `${strokeWidth}px solid ${stroke}` }} className={`relative flex items-center justify-center overflow-hidden ${extraClasses}`}>
        {!!data.bindValue && (
          <span className="text-[10px] text-white font-mono font-bold select-none text-center leading-tight px-1">
            {textContent}
          </span>
        )}
      </div>
    </>
  )
}

export const TextNode: React.FC<NodeProps> = ({ data, selected }) => {
  const w = (data.width as number) || 120
  const h = (data.height as number) || 30
  
  return (
    <>
      <NodeResizer color="#3b82f6" isVisible={selected} minWidth={40} minHeight={20} />
      <NodeHandles />
      <div style={{ width: w, height: h }} className="flex items-center justify-center">
        <span style={{ fontSize: (data.fontSize as number) || 14, color: (data.fill as string) || '#fff' }} className="font-bold font-mono text-center">
          {(data.text as string) || 'Texto SCADA'}
        </span>
      </div>
    </>
  )
}

export const ImageNode: React.FC<NodeProps> = ({ data, selected }) => {
  const w = (data.width as number) || 100
  const h = (data.height as number) || 100
  const { extraClasses } = useDynamicStyles(data)
  
  return (
    <>
      <NodeResizer color="#3b82f6" isVisible={selected} minWidth={20} minHeight={20} />
      <NodeHandles />
      <div style={{ width: w, height: h }} className={`relative flex items-center justify-center ${extraClasses}`}>
        {data.src ? (
          <img src={data.src as string} alt="SCADA Asset" className="w-full h-full object-contain pointer-events-none" />
        ) : (
          <div className="w-full h-full bg-gray-800 text-gray-500 text-xs flex items-center justify-center rounded">Img</div>
        )}
      </div>
    </>
  )
}
