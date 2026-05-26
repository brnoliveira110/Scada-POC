import React from 'react'
import type { Telemetry, SCADANode } from '../../../store/types'
import { 
  Settings, 
  Link2, 
  Trash2, 
  Move 
} from 'lucide-react'

interface PropertyInspectorProps {
  isOpen: boolean
  selectedElement: SCADANode | undefined
  updateElement: (id: string, updates: Partial<any>) => void
  deleteElement: (id: string) => void
  telemetry: Telemetry
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  isOpen,
  selectedElement,
  updateElement,
  deleteElement,
  telemetry
}) => {
  // If the panel is closed, render nothing
  if (!isOpen) {
    return (
      <aside className="w-0 opacity-0 p-0 border-l-0 overflow-hidden transition-all duration-300 ease-in-out shrink-0" />
    )
  }

  // Guard clause for no selection
  if (!selectedElement) {
    return (
      <aside className="w-72 border-l border-[#1f2937] bg-[#111318] p-4 flex flex-col items-center justify-center text-center text-gray-500 space-y-2 shrink-0 transition-all duration-300 ease-in-out select-none md:relative absolute z-40 h-full right-0">
        <Move size={28} className="text-gray-600 animate-pulse" />
        <span className="text-[11px] font-mono-scada uppercase tracking-widest leading-relaxed">Nenhum elemento selecionado</span>
        <p className="text-[10px] text-gray-600 font-sans">Selecione um nó no diagrama para inspecionar e editar propriedades.</p>
      </aside>
    )
  }

  const data = selectedElement.data

  return (
    <aside className="w-72 border-l border-[#1f2937] bg-[#111318] p-4 flex flex-col justify-between overflow-y-auto shrink-0 transition-all duration-300 ease-in-out select-none md:relative absolute z-40 h-full right-0">
      <div className="space-y-4">
        <div className="border-b border-[#1f2937] pb-3">
          <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white flex items-center space-x-1.5">
            <Settings size={14} className="text-blue-500" />
            <span>INSPEÇÃO DE NÓS</span>
          </h3>
          <span className="text-[9px] text-gray-500 font-mono-scada uppercase mt-1 block">ID: {selectedElement.id}</span>
          <span className="text-[9px] text-gray-500 font-mono-scada uppercase mt-1 block">Type: {selectedElement.type}</span>
        </div>

        {/* Dimensions edit */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-mono-scada uppercase text-gray-500 tracking-wider">Dimensões (px)</span>
          <div className="grid grid-cols-2 gap-2 font-mono-scada">
            <div className="flex items-center space-x-1 bg-[#1c1e27] border border-[#2e303b] p-1.5 rounded">
              <span className="text-gray-500">W:</span>
              <input
                type="number"
                value={(data.width as number) || 80}
                onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 20 })}
                className="bg-transparent border-0 text-white w-full focus:ring-0 text-[11px]"
              />
            </div>
            <div className="flex items-center space-x-1 bg-[#1c1e27] border border-[#2e303b] p-1.5 rounded">
              <span className="text-gray-500">H:</span>
              <input
                type="number"
                value={(data.height as number) || 80}
                onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 20 })}
                className="bg-transparent border-0 text-white w-full focus:ring-0 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Colors inspector */}
        {selectedElement.type !== 'imageNode' && (
          <div className="space-y-3 border-t border-[#1f2937]/50 pt-3">
            <span className="text-[10px] font-mono-scada uppercase text-gray-500 tracking-wider block">Aparência</span>
            
            <div className="space-y-2 text-xs">
              {selectedElement.type !== 'textNode' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Preenchimento:</span>
                    <input
                      type="color"
                      value={((data.fill as string) || '#1f2937').startsWith('#') ? data.fill : '#1f2937'}
                      onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                      className="bg-transparent border-0 cursor-pointer w-6 h-6 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Cor Borda:</span>
                    <input
                      type="color"
                      value={((data.stroke as string) || '#3b82f6').startsWith('#') ? data.stroke : '#3b82f6'}
                      onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                      className="bg-transparent border-0 cursor-pointer w-6 h-6 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Espessura Borda:</span>
                      <span className="font-mono-scada">{data.strokeWidth || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={(data.strokeWidth as number) || 2}
                      onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) || 0 })}
                      className="w-full accent-blue-500 bg-[#1c1e27] h-1 rounded"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Cor Texto:</span>
                    <input
                      type="color"
                      value={((data.fill as string) || '#ffffff').startsWith('#') ? data.fill : '#ffffff'}
                      onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                      className="bg-transparent border-0 cursor-pointer w-6 h-6 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-400 block mb-1">Texto Conteúdo:</span>
                    <input
                      type="text"
                      value={(data.text as string) || ''}
                      onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                      className="w-full bg-[#1c1e27] border border-[#2e303b] p-2 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Tamanho Fonte:</span>
                      <span className="font-mono-scada">{data.fontSize || 14}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="36"
                      value={(data.fontSize as number) || 14}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 14 })}
                      className="w-full accent-blue-500 bg-[#1c1e27] h-1 rounded"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TELEMETRY BINDING SECTION */}
        <div className="space-y-3 border-t border-[#1f2937]/50 pt-3">
          <h4 className="text-[10px] font-mono-scada uppercase text-amber-400 tracking-wider flex items-center space-x-1">
            <Link2 size={12} />
            <span>VÍNCULO DE TELEMETRIA (TAG)</span>
          </h4>
          
          <div className="space-y-2 text-xs">
            <span className="text-gray-400 text-[11px] block leading-relaxed">
              Conecte este nó a uma tag do simulador. O elemento mudará suas cores, rotações ou exibirá o valor dinamicamente!
            </span>

            <select
              value={(data.bindValue as string) || ''}
              onChange={(e) => updateElement(selectedElement.id, { bindValue: (e.target.value || undefined) })}
              className="w-full bg-[#1c1e27] border border-[#2e303b] p-2 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] cursor-pointer"
            >
              <option value="">-- SEM VÍNCULO --</option>
              <option value="voltage">voltage (kV Tensão)</option>
              <option value="current">current (A Corrente)</option>
              <option value="frequency">frequency (Hz Frequência)</option>
              <option value="breakerStatus">breakerStatus (Disjuntor Status)</option>
              <option value="motorSpeed">motorSpeed (RPM Motor Refrigeração)</option>
            </select>

            {data.bindValue && (
              <div className="p-2.5 rounded bg-blue-950/20 border border-blue-500/25 space-y-1 text-[10px] font-mono-scada text-blue-400">
                <span className="block text-gray-500 uppercase text-[8px] tracking-wider">FEEDBACK VIVO BINDING</span>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valor Atual:</span>
                  <span className="font-bold">
                    {data.bindValue === 'breakerStatus' 
                      ? telemetry.breakerStatus.toUpperCase() 
                      : telemetry[data.bindValue as keyof Telemetry]
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteElement(selectedElement.id)}
          className="w-full py-2 bg-red-950/20 hover:bg-red-950/45 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center space-x-1.5 transition-colors border-t mt-4"
        >
          <Trash2 size={12} />
          <span>Excluir Nó/Conexões</span>
        </button>
      </div>

    </aside>
  )
}
