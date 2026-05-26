import React, { useEffect } from 'react'
import { useSCADAStore } from '../store/useSCADAStore'
import { 
  Activity, 
  Play, 
  Square, 
  AlertTriangle, 
  Zap, 
  FileEdit,
  Database,
  Radio
} from 'lucide-react'

interface LayoutProps {
  currentTab: 'dashboard' | 'diagram' | 'editor'
  setTab: (tab: 'dashboard' | 'diagram' | 'editor') => void
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ currentTab, setTab, children }) => {
  const { isSimulating, startSimulation, stopSimulation, telemetry, alarms } = useSCADAStore()
  
  // Auto-start simulation on mount to WOW the user immediately
  useEffect(() => {
    startSimulation()
    return () => {
      stopSimulation()
    }
  }, [startSimulation, stopSimulation])

  const activeAlarmsCount = alarms.filter(a => a.status === 'active' && a.severity === 'critical').length
  const attentionAlarmsCount = alarms.filter(a => a.status === 'active' && a.severity === 'attention').length

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0c10] text-[#c9d1d9]">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-[#1f2937] bg-[#111318] flex flex-col justify-between select-none">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#1f2937] flex items-center space-x-3">
            <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500 animate-pulse">
              <Zap size={22} className="fill-blue-500/20" />
            </div>
            <div>
              <h1 className="text-md font-semibold tracking-wider text-white font-display">ARES SCADA</h1>
              <span className="text-xs text-gray-500 font-mono-scada uppercase tracking-widest">v1.9.0-POC</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10'
                  : 'text-gray-400 hover:bg-[#1a1c23] hover:text-gray-200'
              }`}
            >
              <Activity size={18} />
              <span>Painel de Telemetria</span>
            </button>

            <button
              onClick={() => setTab('diagram')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentTab === 'diagram'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10'
                  : 'text-gray-400 hover:bg-[#1a1c23] hover:text-gray-200'
              }`}
            >
              <Zap size={18} />
              <span>Diagrama Unifilar</span>
            </button>

            <button
              onClick={() => setTab('editor')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentTab === 'editor'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10'
                  : 'text-gray-400 hover:bg-[#1a1c23] hover:text-gray-200'
              }`}
            >
              <FileEdit size={18} />
              <span>SCADA Editor</span>
            </button>
          </nav>
        </div>

        {/* Engine status & Quick operations in Sidebar footer */}
        <div className="p-4 border-t border-[#1f2937] bg-[#0c0d12]/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center space-x-1 font-mono-scada">
              <Radio size={12} className={isSimulating ? 'text-green-500 animate-pulse' : 'text-gray-600'} />
              <span>MOTOR DE SIMULAÇÃO</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono-scada uppercase ${
              isSimulating ? 'bg-green-500/10 text-green-400 border border-green-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'
            }`}>
              {isSimulating ? 'ATIVO' : 'PARADO'}
            </span>
          </div>

          <div className="flex space-x-2">
            {isSimulating ? (
              <button
                onClick={stopSimulation}
                className="flex-1 py-1.5 px-3 rounded bg-red-600/20 border border-red-500/35 text-red-300 hover:bg-red-600/30 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors duration-150"
              >
                <Square size={12} className="fill-red-400/20" />
                <span>Pausar</span>
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="flex-1 py-1.5 px-3 rounded bg-green-600/20 border border-green-500/35 text-green-300 hover:bg-green-600/30 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors duration-150"
              >
                <Play size={12} className="fill-green-400/20" />
                <span>Iniciar</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-gray-500 space-y-1 font-mono-scada border-t border-[#1f2937]/50 pt-2">
            <div className="flex justify-between">
              <span>Freq. Motor:</span>
              <span className="text-gray-300">{telemetry.motorSpeed} RPM</span>
            </div>
            <div className="flex justify-between">
              <span>Disjuntor:</span>
              <span className={`font-semibold ${
                telemetry.breakerStatus === 'ligado' ? 'text-green-400' : telemetry.breakerStatus === 'desligado' ? 'text-red-400' : 'text-amber-400 animate-pulse'
              }`}>{telemetry.breakerStatus.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1f2937] bg-[#111318] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-2">
            <Database size={16} className="text-blue-500" />
            <span className="text-sm font-semibold tracking-wider font-display text-white">GRID MATRIX TELEMETRIA</span>
          </div>

          {/* Alarm Indicator pills */}
          <div className="flex items-center space-x-3">
            {activeAlarmsCount > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse">
                <AlertTriangle size={13} />
                <span>{activeAlarmsCount} Alarmes Críticos</span>
              </div>
            )}
            {attentionAlarmsCount > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-bold">
                <AlertTriangle size={13} />
                <span>{attentionAlarmsCount} Alertas</span>
              </div>
            )}
            <div className="h-4 w-[1px] bg-gray-800"></div>
            <div className="flex items-center space-x-2 text-xs font-mono-scada bg-[#1c1e27] border border-[#2e303b] px-3 py-1.5 rounded-lg text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SISTEMA OK</span>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#0b0c10] relative">
          {children}
        </main>
      </div>
    </div>
  )
}
