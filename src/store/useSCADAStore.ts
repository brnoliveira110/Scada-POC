import { create } from 'zustand'
import { createTelemetrySlice, type TelemetrySlice } from './telemetrySlice'
import { createDiagramSlice, type DiagramSlice } from './diagramSlice'

export type SCADAStore = TelemetrySlice & DiagramSlice

export const useSCADAStore = create<SCADAStore>()((...a) => ({
  ...createTelemetrySlice(...a),
  ...createDiagramSlice(...a),
}))

export * from './types'
export * from './telemetrySlice'
export * from './diagramSlice'
