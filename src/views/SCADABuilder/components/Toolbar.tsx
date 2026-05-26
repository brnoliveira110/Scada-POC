import React, { useState } from 'react'
import { 
  Monitor, 
  FilePlus, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { useSCADAStore } from '../../../store/useSCADAStore'

interface ToolbarProps {
  displayPreset: 'auto' | '1080p' | '4k' | 'ultrawide'
  setDisplayPreset: (preset: 'auto' | '1080p' | '4k' | 'ultrawide') => void
  zoomMode: string
  setZoomMode: (mode: any) => void
  scaleFactor: number
  showRulers: boolean
  setShowRulers: (show: boolean) => void
  leftSidebarOpen: boolean
  setLeftSidebarOpen: (open: boolean) => void
  rightSidebarOpen: boolean
  setRightSidebarOpen: (open: boolean) => void
  loadPaperFactoryTemplate: () => void
  loadShoppingMallTemplate: () => void
  clearCanvas: () => void
  handleSavePlant: () => void
  handleLoadSavedPlant: () => void
  showSavedToast: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
  displayPreset,
  setDisplayPreset,
  leftSidebarOpen,
  setLeftSidebarOpen,
  rightSidebarOpen,
  setRightSidebarOpen,
  loadPaperFactoryTemplate,
  loadShoppingMallTemplate,
  clearCanvas,
  showSavedToast
}) => {
  const diagrams = useSCADAStore(state => state.diagrams)
  const activeDiagramId = useSCADAStore(state => state.activeDiagramId)
  const createDiagram = useSCADAStore(state => state.createDiagram)
  const switchDiagram = useSCADAStore(state => state.switchDiagram)
  
  const [newDiagramName, setNewDiagramName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateNew = () => {
    if (!newDiagramName.trim()) return
    createDiagram(newDiagramName)
    setNewDiagramName('')
    setIsCreating(false)
  }

  return (
    <div className="glass-panel p-3 rounded-xl border border-[#1f2937] flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-4 shrink-0 text-xs select-none">
      
      {showSavedToast && (
        <div className="absolute top-20 right-6 z-50 flex items-center space-x-2 bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-4 py-2.5 rounded-xl shadow-2xl animate-bounce">
          <CheckCircle size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono-scada font-bold">Planta Salva no Navegador!</span>
        </div>
      )}

      {/* Screen Actions & Toggles */}
      <div className="flex flex-wrap items-center gap-3">
        
        <div className="flex items-center space-x-1 border-r border-[#1f2937]/80 pr-3 mr-1">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`p-1.5 rounded border transition-all cursor-pointer ${
              leftSidebarOpen 
                ? 'bg-blue-600/15 border-blue-500/30 text-blue-400 font-bold' 
                : 'bg-[#1c1e27] border-[#2e303b] text-gray-400 hover:text-white'
            }`}
            title={leftSidebarOpen ? "Recolher Paleta Esquerda" : "Expandir Paleta Esquerda"}
          >
            <ChevronLeft size={15} className={`transition-transform duration-300 ${leftSidebarOpen ? '' : 'rotate-180'}`} />
          </button>

          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`p-1.5 rounded border transition-all cursor-pointer ${
              rightSidebarOpen 
                ? 'bg-blue-600/15 border-blue-500/30 text-blue-400 font-bold' 
                : 'bg-[#1c1e27] border-[#2e303b] text-gray-400 hover:text-white'
            }`}
            title={rightSidebarOpen ? "Recolher Propriedades Direita" : "Expandir Propriedades Direita"}
          >
            <ChevronRight size={15} className={`transition-transform duration-300 ${rightSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <Monitor size={14} className="text-blue-500" />
          <span>Resolução:</span>
        </div>
        <select
          value={displayPreset}
          onChange={(e) => setDisplayPreset(e.target.value as any)}
          className="bg-[#1c1e27] border border-[#2e303b] p-1.5 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] cursor-pointer"
        >
          <option value="auto">Auto (Responsivo 800px)</option>
          <option value="1080p">Monitor 1080p (1920x1080)</option>
          <option value="4k">Video Wall 4K (3840x2160)</option>
          <option value="ultrawide">UltraWide 21:9 (2560x1080)</option>
        </select>
        
        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded bg-red-950/20 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-950/45 text-[11px] font-bold cursor-pointer transition-all"
        >
          Limpar Nós Atuais
        </button>
      </div>

      {/* Diagrams Manager */}
      <div className="flex items-center space-x-2 font-mono-scada">
        <span className="text-gray-500">DIAGRAMAS:</span>
        
        {isCreating ? (
          <div className="flex items-center space-x-1">
            <input 
              type="text"
              autoFocus
              value={newDiagramName}
              onChange={e => setNewDiagramName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateNew()}
              placeholder="Nome do Diagrama..."
              className="bg-[#1c1e27] border border-[#2e303b] p-1.5 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] w-32"
            />
            <button onClick={handleCreateNew} className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded cursor-pointer"><CheckCircle size={14}/></button>
            <button onClick={() => setIsCreating(false)} className="p-1.5 bg-red-600/20 text-red-400 rounded cursor-pointer">X</button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-emerald-950/20 hover:bg-emerald-950/45 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold cursor-pointer transition-all"
          >
            <FilePlus size={12} />
            <span>Novo</span>
          </button>
        )}

        <select
          value={activeDiagramId || ''}
          onChange={(e) => switchDiagram(e.target.value)}
          className="bg-[#1c1e27] border border-[#2e303b] p-1.5 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] cursor-pointer ml-1"
        >
          {diagrams.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <span className="text-gray-500 ml-2">TEMPLATES:</span>
        <button onClick={loadPaperFactoryTemplate} className="px-2 py-1.5 rounded bg-blue-950/20 border border-blue-500/25 text-blue-400 text-[11px] cursor-pointer">Papel</button>
        <button onClick={loadShoppingMallTemplate} className="px-2 py-1.5 rounded bg-purple-950/20 border border-purple-500/25 text-purple-400 text-[11px] cursor-pointer">Shopping</button>

      </div>

    </div>
  )
}
