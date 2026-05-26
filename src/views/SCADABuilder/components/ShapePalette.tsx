import React from 'react'
import { 
  Square, 
  Circle, 
  Type, 
  Upload, 
  Trash2, 
  Layers, 
  FolderOpen
} from 'lucide-react'

interface ShapePaletteProps {
  isOpen: boolean
  canvasBgColor: string
  canvasBgImage: string | null
  setCanvasBgColor: (color: string) => void
  setCanvasBgImage: (img: string | null) => void
  clearCanvas: () => void
  handleDragStartFromPalette: (type: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  bgFileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBgFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ShapePalette: React.FC<ShapePaletteProps> = ({
  isOpen,
  canvasBgColor,
  canvasBgImage,
  setCanvasBgColor,
  setCanvasBgImage,
  clearCanvas,
  handleDragStartFromPalette,
  fileInputRef,
  bgFileInputRef,
  handleFileUpload,
  handleBgFileUpload
}) => {
  return (
    <aside 
      className={`bg-[#111318] flex flex-col justify-between overflow-y-auto shrink-0 transition-all duration-300 ease-in-out border-r border-[#1f2937] md:relative absolute z-40 h-full ${
        isOpen 
          ? 'w-72 opacity-100 p-4' 
          : 'w-0 opacity-0 p-0 border-r-0 overflow-hidden'
      }`}
    >
      <div className="space-y-5">
        <div className="border-b border-[#1f2937] pb-3">
          <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white flex items-center space-x-1.5">
            <Layers size={14} className="text-blue-500" />
            <span>PALETA DE EQUIPAMENTOS</span>
          </h3>
          <p className="text-[10px] text-gray-500 mt-1">Arraste formas para o canvas e conecte-as via cabos arrastando as portas (handles).</p>
        </div>

        {/* Draggable Shapes */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono-scada uppercase text-gray-500 tracking-wider">Formas Básicas</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              draggable
              onDragStart={() => handleDragStartFromPalette('rectNode')}
              className="flex items-center space-x-2 p-2.5 rounded bg-[#1c1e27] border border-[#2e303b] text-gray-300 hover:text-white hover:bg-[#252834] cursor-grab active:cursor-grabbing transition-colors"
            >
              <Square size={14} />
              <span>Quadrado</span>
            </div>
            
            <div
              draggable
              onDragStart={() => handleDragStartFromPalette('circleNode')}
              className="flex items-center space-x-2 p-2.5 rounded bg-[#1c1e27] border border-[#2e303b] text-gray-300 hover:text-white hover:bg-[#252834] cursor-grab active:cursor-grabbing transition-colors"
            >
              <Circle size={14} />
              <span>Círculo</span>
            </div>

            <div
              draggable
              onDragStart={() => handleDragStartFromPalette('textNode')}
              className="flex items-center space-x-2 p-2.5 rounded bg-[#1c1e27] border border-[#2e303b] text-gray-300 hover:text-white hover:bg-[#252834] cursor-grab active:cursor-grabbing transition-colors"
            >
              <Type size={14} />
              <span>Texto</span>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono-scada uppercase text-gray-500 tracking-wider">Upload Vetores / GIFs / Imagens</span>
          <div className="p-4 border-2 border-dashed border-[#2e303b] hover:border-blue-500/40 rounded-xl bg-[#0c0d12]/50 text-center space-y-2 cursor-pointer transition-colors"
               onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={22} className="text-gray-500 mx-auto" />
            <div>
              <span className="text-[11px] font-medium text-gray-300 block">Enviar Equipamento</span>
              <span className="text-[9px] text-gray-500 block mt-0.5">JPG, PNG, GIF, SVGs animadas</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef as any} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Canvas Background Settings */}
        <div className="space-y-3 border-t border-[#1f2937]/50 pt-4">
          <span className="text-[10px] font-mono-scada uppercase text-gray-500 tracking-wider block">Fundo do Canvas</span>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cor sólida:</span>
              <input 
                type="color" 
                value={canvasBgColor} 
                onChange={(e) => setCanvasBgColor(e.target.value)}
                className="bg-transparent border-0 cursor-pointer w-6 h-6 rounded"
              />
            </div>

            <div className="space-y-1">
              <span className="text-gray-500 text-[10px]">Imagem de Fundo:</span>
              {canvasBgImage ? (
                <div className="flex items-center justify-between p-2 rounded bg-blue-950/20 border border-blue-500/25">
                  <span className="text-[10px] text-blue-400 truncate max-w-[150px]">Fundo Personalizado</span>
                  <button 
                    onClick={() => setCanvasBgImage(null)} 
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => bgFileInputRef.current?.click()}
                  className="w-full py-1.5 rounded bg-[#1c1e27] border border-[#2e303b] text-gray-300 hover:bg-[#252834] text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <FolderOpen size={12} />
                  <span>Carregar Imagem Fundo</span>
                </button>
              )}
              <input 
                type="file" 
                ref={bgFileInputRef as any} 
                onChange={handleBgFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={() => {
          clearCanvas()
          localStorage.removeItem('ares_scada_custom_plant')
        }}
        className="w-full py-2 rounded-lg bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer transition-colors"
      >
        Limpar Todo Canvas
      </button>
    </aside>
  )
}
