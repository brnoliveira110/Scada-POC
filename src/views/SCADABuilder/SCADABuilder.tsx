import React from 'react'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { useSCADABuilder } from './hooks/useSCADABuilder'
import { Toolbar } from './components/Toolbar'
import { ShapePalette } from './components/ShapePalette'
import { DrawingCanvas } from './components/DrawingCanvas'
import { PropertyInspector } from './components/PropertyInspector'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SCADABuilderContent: React.FC = () => {
  const {
    // states
    telemetry,
    nodes,
    edges,
    canvasBgColor,
    canvasBgImage,
    displayPreset,
    showRulers,
    setShowRulers,
    showSavedToast,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    
    // refs
    reactFlowWrapper,
    fileInputRef,
    bgFileInputRef,
    
    // handlers
    store,
    handleDragStartFromPalette,
    handleCanvasDragOver,
    handleCanvasDrop,
    handleFileUpload,
    handleBgFileUpload,
    handleSavePlant,
    handleLoadSavedPlant
  } = useSCADABuilder()

  const { screenToFlowPosition } = useReactFlow()

  return (
    <div className="flex h-full w-full bg-[#0b0c10] overflow-hidden select-none relative">
      
      {/* 1. Shape Palette Sidebar (Left) */}
      <ShapePalette
        isOpen={leftSidebarOpen}
        canvasBgColor={canvasBgColor}
        canvasBgImage={canvasBgImage}
        setCanvasBgColor={store.setCanvasBgColor}
        setCanvasBgImage={store.setCanvasBgImage}
        clearCanvas={store.clearCanvas}
        handleDragStartFromPalette={handleDragStartFromPalette}
        fileInputRef={fileInputRef}
        bgFileInputRef={bgFileInputRef}
        handleFileUpload={handleFileUpload}
        handleBgFileUpload={handleBgFileUpload}
      />

      {/* Slide Handle Left Sidebar Toggler */}
      {!leftSidebarOpen && (
        <button 
          onClick={() => setLeftSidebarOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-20 bg-[#111318] hover:bg-[#1a1c24] border border-[#1f2937] border-l-0 z-30 rounded-r-lg flex items-center justify-center cursor-pointer text-gray-400 hover:text-white transition-all shadow-xl"
          title="Exibir Paleta"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* 2. Main Work Area (Center Grid) */}
      <section className="flex-1 overflow-hidden bg-[#090a0f] p-4 flex flex-col justify-between select-none relative">
        
        {/* Top Toolbar */}
        <Toolbar
          displayPreset={displayPreset}
          setDisplayPreset={store.setDisplayPreset}
          zoomMode={'fit'} // deprecated zoom controls since React Flow handles it
          setZoomMode={() => {}} 
          scaleFactor={1}
          showRulers={showRulers}
          setShowRulers={setShowRulers}
          leftSidebarOpen={leftSidebarOpen}
          setLeftSidebarOpen={setLeftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
          loadPaperFactoryTemplate={store.loadPaperFactoryTemplate}
          loadShoppingMallTemplate={store.loadShoppingMallTemplate}
          clearCanvas={store.clearCanvas}
          handleSavePlant={handleSavePlant}
          handleLoadSavedPlant={handleLoadSavedPlant}
          showSavedToast={showSavedToast}
        />

        {/* Dynamic Vector Rulers & Canvas Sheet */}
        <DrawingCanvas
          nodes={nodes}
          edges={edges}
          canvasBgColor={canvasBgColor}
          canvasBgImage={canvasBgImage}
          reactFlowWrapper={reactFlowWrapper}
          handleCanvasDragOver={handleCanvasDragOver}
          handleCanvasDrop={(e) => handleCanvasDrop(e, screenToFlowPosition)}
          onNodesChange={store.onNodesChange}
          onEdgesChange={store.onEdgesChange}
          onConnect={store.onConnect}
        />

      </section>

      {/* Slide Handle Right Sidebar Toggler */}
      {!rightSidebarOpen && (
        <button 
          onClick={() => setRightSidebarOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-20 bg-[#111318] hover:bg-[#1a1c24] border border-[#1f2937] border-r-0 z-30 rounded-l-lg flex items-center justify-center cursor-pointer text-gray-400 hover:text-white transition-all shadow-xl"
          title="Exibir Propriedades"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      {/* 3. Property Inspector Sidebar (Right) */}
      <PropertyInspector
        isOpen={rightSidebarOpen}
        selectedElement={nodes.find(n => n.selected) as any} // map back to old prop temporarily
        updateElement={(id, data) => store.updateNodeData(id, data)}
        deleteElement={store.deleteNode}
        telemetry={telemetry}
      />

    </div>
  )
}

export const SCADABuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <SCADABuilderContent />
    </ReactFlowProvider>
  )
}
