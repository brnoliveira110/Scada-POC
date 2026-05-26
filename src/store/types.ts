import type { Node, Edge } from '@xyflow/react'

export interface Telemetry {
  voltage: number      // in kV (138kV base)
  current: number      // in Amperes (450A base)
  frequency: number    // in Hz (60Hz base)
  breakerStatus: 'ligado' | 'desligado' | 'falha'
  motorSpeed: number   // in RPM (1500 RPM base)
}

export interface HistoryPoint {
  time: string
  voltage: number
  current: number
  frequency: number
}

export interface Alarm {
  id: string
  timestamp: string
  variable: 'voltage' | 'current' | 'frequency' | 'breakerStatus'
  type: 'High-High' | 'Low-Low' | 'High' | 'Low' | 'Fail'
  severity: 'critical' | 'attention' | 'normal'
  value: string | number
  message: string
  status: 'active' | 'cleared'
}

export interface SCADANodeData extends Record<string, unknown> {
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  text?: string
  fontSize?: number
  src?: string
  bindValue?: keyof Telemetry
}

export type SCADANode = Node<SCADANodeData>
export type SCADAEdge = Edge

export interface Diagram {
  id: string
  name: string
  nodes: SCADANode[]
  edges: SCADAEdge[]
  canvasBgColor: string
  canvasBgImage: string | null
}
