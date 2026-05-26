import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  statusLabel: string
  severity: 'critical' | 'attention' | 'normal'
  referenceText: string
  icon: LucideIcon
  iconClass?: string
  iconStyle?: React.CSSProperties
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  statusLabel,
  severity,
  referenceText,
  icon: Icon,
  iconClass = '',
  iconStyle
}) => {
  // Mapping objects to ELIMINATE standard if-else structures completely!
  const borderStyles: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'border-red-500 animate-scada-alarm',
    attention: 'border-amber-500 animate-scada-warning',
    normal: 'border-[#1f2937] hover:border-emerald-500/30'
  }

  const badgeStyles: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'bg-red-500/25 border border-red-500/40 text-red-400',
    attention: 'bg-amber-500/20 border border-amber-500/45 text-amber-400',
    normal: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
  }

  const textStyles: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'text-red-400 font-extrabold',
    attention: 'text-amber-400 font-bold',
    normal: 'text-emerald-400'
  }

  const iconColors: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'text-red-500',
    attention: 'text-amber-500',
    normal: 'text-emerald-500'
  }

  const borderClass = borderStyles[severity]
  const badgeClass = badgeStyles[severity]
  const textClass = textStyles[severity]
  const iconColor = iconColors[severity]

  return (
    <div className={`glass-panel p-5 rounded-xl border transition-all duration-300 ${borderClass}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>
      <div className="flex items-baseline space-x-2 mb-2">
        <span className={`text-4xl font-black font-display tracking-tight ${textClass}`}>
          {value}
        </span>
        <span className="text-lg font-bold text-gray-500">{unit}</span>
      </div>
      <div className="flex items-center space-x-1.5 text-xs text-gray-400 border-t border-[#1f2937] pt-2 font-mono-scada">
        <Icon size={12} className={`${iconColor} ${iconClass}`} style={iconStyle} />
        <span>{referenceText}</span>
      </div>
    </div>
  )
}
