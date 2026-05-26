import React from 'react'
import { useSCADAStore } from '../../../store/useSCADAStore'
import { Zap, Flame } from 'lucide-react'

export const QuickOperations: React.FC = () => {
  const { telemetry, toggleBreaker, triggerRandomFault } = useSCADAStore()

  // Guarding against nested if/else for button state styles
  const isLigado = telemetry.breakerStatus === 'ligado'
  const buttonStyles = isLigado
    ? 'bg-red-950/20 text-red-400 border-red-500/30 hover:bg-red-950/40'
    : 'bg-green-950/20 text-green-400 border-green-500/30 hover:bg-green-950/40'

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl">
      <div>
        <h2 className="text-lg font-bold tracking-wider font-display text-white">PAINEL INDUSTRIAL DE TELEMETRIA</h2>
        <p className="text-xs text-gray-400">Dados simulados de alta frequência em tempo real. Frequência de atualização: 2Hz (500ms).</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleBreaker()}
          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer flex items-center space-x-2 ${buttonStyles}`}
        >
          <Zap size={14} className="fill-current" />
          <span>Alternar Disjuntor ({isLigado ? 'Desligar' : 'Ligar'})</span>
        </button>

        <button
          onClick={triggerRandomFault}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-950/20 text-amber-400 border border-amber-500/30 hover:bg-amber-950/40 transition-all duration-150 cursor-pointer flex items-center space-x-2"
        >
          <Flame size={14} />
          <span>Provocar Falha Crítica</span>
        </button>
      </div>
    </div>
  )
}
