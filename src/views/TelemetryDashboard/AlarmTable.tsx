import React from 'react'
import type { Alarm } from '../../store/useSCADAStore'
import { useSCADAStore } from '../../store/useSCADAStore'
import { AlertOctagon, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'

interface AlarmTableProps {
  alarms: Alarm[]
}

export const AlarmTable: React.FC<AlarmTableProps> = ({ alarms }) => {
  const { clearAlarms } = useSCADAStore()

  return (
    <div className="flex flex-col h-full bg-[#111318] border border-[#1f2937] rounded-xl overflow-hidden shadow-2xl">
      {/* Table Header */}
      <div className="px-5 py-4 border-b border-[#1f2937] flex items-center justify-between bg-[#14161f]">
        <div className="flex items-center space-x-2">
          <AlertOctagon size={18} className="text-red-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wider font-display text-white">HISTÓRICO DE ALARMES / EVENTOS</h3>
        </div>
        <button
          onClick={clearAlarms}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/45 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer transition-all duration-150"
        >
          <Trash2 size={13} />
          <span>Limpar Eventos</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto max-h-[300px] font-mono-scada text-xs">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 space-y-2">
            <CheckCircle size={28} className="text-emerald-500/80" />
            <span className="text-[11px] tracking-widest uppercase">Nenhum alarme ativo no grid</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f2937] text-gray-500 uppercase text-[10px] tracking-wider bg-[#0c0d12]/50">
                <th className="px-5 py-3 font-semibold">Horário</th>
                <th className="px-4 py-3 font-semibold">Sensor</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Mensagem de Sistema</th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => {
                const isActive = alarm.status === 'active'
                const isCritical = alarm.severity === 'critical'
                
                let rowBgClass = 'border-b border-[#1f2937]/50 hover:bg-[#151821] '
                if (isActive) {
                  rowBgClass += isCritical ? 'bg-red-950/10 text-red-200' : 'bg-amber-950/10 text-amber-200'
                } else {
                  rowBgClass += 'text-gray-400 opacity-60'
                }

                return (
                  <tr key={alarm.id} className={rowBgClass}>
                    <td className="px-5 py-3 whitespace-nowrap text-gray-400">{alarm.timestamp}</td>
                    <td className="px-4 py-3 whitespace-nowrap uppercase font-semibold text-gray-300">
                      {alarm.variable === 'breakerStatus' ? 'Disjuntor' : alarm.variable}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical 
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}>
                        {alarm.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-200">
                      {alarm.value} {alarm.variable === 'voltage' ? 'kV' : alarm.variable === 'frequency' ? 'Hz' : ''}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isActive ? (
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          isCritical ? 'animate-scada-alarm text-white' : 'animate-scada-warning text-black'
                        }`}>
                          <AlertTriangle size={10} className="mr-0.5" />
                          <span>ATIVO</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                          NORMALIZADO
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-300 max-w-xs truncate">{alarm.message}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
