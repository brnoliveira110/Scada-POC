import React from 'react'
import { useSCADAStore } from '../../store/useSCADAStore'
import { HistoryChart } from './HistoryChart'
import { AlarmTable } from './AlarmTable'
import { MetricCard } from './components/MetricCard'
import { QuickOperations } from './components/QuickOperations'
import { 
  Activity, 
  Compass, 
  Wifi, 
  Settings 
} from 'lucide-react'

export const TelemetryDashboard: React.FC = () => {
  const { 
    telemetry, 
    history, 
    alarms, 
    toggleBreaker, 
    isSimulating
  } = useSCADAStore()

  // Clean severity calculation using early returns and Guard Clauses - NO ELSE!
  const getVoltageSeverity = (v: number): 'critical' | 'attention' | 'normal' => {
    if (v > 142.0 || v < 132.0) return 'critical'
    if (v > 140.0 || v < 135.0) return 'attention'
    return 'normal'
  }

  const getFrequencySeverity = (f: number): 'critical' | 'attention' | 'normal' => {
    if (f < 59.50) return 'critical'
    if (f < 59.80) return 'attention'
    return 'normal'
  }

  const vSeverity = getVoltageSeverity(telemetry.voltage)
  const fSeverity = getFrequencySeverity(telemetry.frequency)

  // Status text dictionary mapping - NO ELSE!
  const voltageLabels: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'CRÍTICO',
    attention: 'ATENÇÃO',
    normal: 'NORMAL'
  }

  const frequencyLabels: Record<'critical' | 'attention' | 'normal', string> = {
    critical: 'SUB-CRÍTICA',
    attention: 'INSTÁVEL',
    normal: 'ESTÁVEL'
  }

  // Active breaker status color mapping
  const breakerColors: Record<'ligado' | 'desligado' | 'falha', string> = {
    ligado: 'bg-green-500 animate-pulse',
    desligado: 'bg-red-500',
    falha: 'bg-amber-500 animate-pulse'
  }

  const activeBreakerColor = breakerColors[telemetry.breakerStatus] || breakerColors.falha

  return (
    <div className="p-6 space-y-6 scada-grid min-h-full">
      {/* Decoupled Quick Operations Control Panel */}
      <QuickOperations />

      {/* Grid of Modular Dynamic Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Tensão (Voltage) */}
        <MetricCard
          title="Tensão (Grid Bar)"
          value={telemetry.voltage.toFixed(1)}
          unit="kV"
          statusLabel={voltageLabels[vSeverity]}
          severity={vSeverity}
          referenceText="Ref. Operação: 138.0 kV"
          icon={Activity}
        />

        {/* Card 2: Corrente (Current) */}
        <MetricCard
          title="Corrente (Carga A)"
          value={telemetry.current.toFixed(1)}
          unit="A"
          statusLabel="CARGA ATIVA"
          severity="normal"
          referenceText="Fator de Potência: ~0.92"
          icon={Wifi}
        />

        {/* Card 3: Frequência (Frequency) */}
        <MetricCard
          title="Frequência (Rede)"
          value={telemetry.frequency.toFixed(2)}
          unit="Hz"
          statusLabel={frequencyLabels[fSeverity]}
          severity={fSeverity}
          referenceText="Frequência Nominal: 60.00 Hz"
          icon={Activity}
        />

        {/* Card 4: Status do Motor (Rotational speed) */}
        <MetricCard
          title="Exaustor de Resfriamento"
          value={telemetry.motorSpeed}
          unit="RPM"
          statusLabel={telemetry.motorSpeed > 0 ? 'EM OPERAÇÃO' : 'DESLIGADO'}
          severity={telemetry.motorSpeed > 0 ? 'normal' : 'normal'} // standard look
          referenceText="Giro do Vent. Resfriador"
          icon={Compass}
          iconClass={telemetry.motorSpeed > 0 ? 'animate-spin' : ''}
          iconStyle={{ animationDuration: telemetry.motorSpeed > 0 ? `${60 / (telemetry.motorSpeed / 100)}s` : '0s' }}
        />

      </div>

      {/* Center Layout: Graphic Timeline & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Oscillating Chart Card */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-[#1f2937] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-[#1f2937]/50 pb-3">
            <div className="flex items-center space-x-2">
              <Activity size={18} className="text-blue-400" />
              <h3 className="text-sm font-semibold tracking-wider font-display text-white">OSCILAÇÃO DA TENSÃO (ÚLTIMOS 30 SEGUNDOS)</h3>
            </div>
            <div className="flex items-center space-x-1.5 font-mono-scada text-[10px] text-gray-400 bg-[#0c0d12]/50 px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span>LIVE FEED</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <HistoryChart data={history} />
          </div>
        </div>

        {/* Info card & system quick operations */}
        <div className="glass-panel p-5 rounded-xl border border-[#1f2937] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-wider font-display text-white border-b border-[#1f2937]/50 pb-3 mb-4 flex items-center space-x-2">
              <Settings size={16} className="text-gray-400" />
              <span>DASHBOARD METADADOS</span>
            </h3>
            
            <div className="space-y-4 text-xs font-mono-scada">
              <div className="p-3 bg-[#0c0d12]/60 rounded-lg border border-[#1f2937]/50">
                <span className="text-[10px] text-gray-500 block mb-1">Status Disjuntor Principal:</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${activeBreakerColor}`}></span>
                    <span className="font-semibold text-gray-200 uppercase">{telemetry.breakerStatus}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => toggleBreaker('ligado')}
                      className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 hover:bg-green-500/25 text-green-400 font-semibold cursor-pointer"
                    >
                      LIG
                    </button>
                    <button 
                      onClick={() => toggleBreaker('desligado')}
                      className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 font-semibold cursor-pointer"
                    >
                      DES
                    </button>
                    <button 
                      onClick={() => toggleBreaker('falha')}
                      className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 text-amber-400 font-semibold cursor-pointer"
                    >
                      FAL
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0c0d12]/60 rounded-lg border border-[#1f2937]/50 space-y-2">
                <span className="text-[10px] text-gray-500 block">Limites SCADA (KV):</span>
                <div className="grid grid-cols-3 text-center gap-1.5 text-[10px]">
                  <div className="p-1.5 bg-red-500/5 rounded border border-red-500/15 text-red-400">
                    <span className="block text-gray-500 font-sans">Crit. Min</span>
                    <strong>&lt; 132</strong>
                  </div>
                  <div className="p-1.5 bg-emerald-500/5 rounded border border-emerald-500/15 text-emerald-400">
                    <span className="block text-gray-500 font-sans">Normal</span>
                    <strong>135 - 140</strong>
                  </div>
                  <div className="p-1.5 bg-red-500/5 rounded border border-red-500/15 text-red-400">
                    <span className="block text-gray-500 font-sans">Crit. Max</span>
                    <strong>&gt; 142</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0c0d12]/60 rounded-lg border border-[#1f2937]/50 space-y-1">
                <span className="text-[10px] text-gray-500 block">Comportamento Dinâmico:</span>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  O disjuntor principal controla o fluxo de eletricidade. Quando aberto ("desligado"), o motor de refrigeração desacelera até parar. Quando ativo ("ligado"), a velocidade rotacional acompanha a frequência do grid.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#1f2937] pt-4 mt-4 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span>Fluxo Telemetria</span>
            </span>
            <span className="font-mono-scada">500ms INTERVAL</span>
          </div>
        </div>

      </div>

      {/* Recent Alarms Table */}
      <div className="w-full">
        <AlarmTable alarms={alarms} />
      </div>
    </div>
  )
}
