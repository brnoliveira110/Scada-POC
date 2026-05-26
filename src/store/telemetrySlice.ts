import type { StateCreator } from 'zustand'
import type { Telemetry, HistoryPoint, Alarm } from './types'

export interface TelemetrySlice {
  telemetry: Telemetry
  history: HistoryPoint[]
  alarms: Alarm[]
  isSimulating: boolean
  
  startSimulation: () => void
  stopSimulation: () => void
  toggleBreaker: (status?: 'ligado' | 'desligado' | 'falha') => void
  triggerRandomFault: () => void
  clearAlarms: () => void
}

let simIntervalId: any = null

const initialHistory: HistoryPoint[] = Array.from({ length: 60 }).map((_, i) => {
  const time = new Date(Date.now() - (60 - i) * 500).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return {
    time,
    voltage: 138.0 + (Math.random() - 0.5) * 1.5,
    current: 450.0 + (Math.random() - 0.5) * 10,
    frequency: 60.0 + (Math.random() - 0.5) * 0.1,
  }
})

export const createTelemetrySlice: StateCreator<TelemetrySlice, [], [], TelemetrySlice> = (set, get) => ({
  telemetry: {
    voltage: 138.0,
    current: 450.0,
    frequency: 60.0,
    breakerStatus: 'ligado',
    motorSpeed: 1500,
  },
  history: initialHistory,
  alarms: [],
  isSimulating: false,

  startSimulation: () => {
    if (get().isSimulating) return

    set({ isSimulating: true })

    simIntervalId = setInterval(() => {
      const { telemetry, history, alarms } = get()
      const timeStr = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      // 1. Calculate random fluctuations
      let vDelta = (Math.random() - 0.5) * 0.8
      let cDelta = (Math.random() - 0.5) * 15
      let fDelta = (Math.random() - 0.5) * 0.05

      // Introduce rare anomalies
      const anomalyRoll = Math.random()
      if (anomalyRoll < 0.03) {
        vDelta = 6.0 + Math.random() * 2
      } else if (anomalyRoll < 0.06) {
        vDelta = -8.0 - Math.random() * 2
      }

      const frequencyRoll = Math.random()
      if (frequencyRoll < 0.04) {
        fDelta = -0.6 - Math.random() * 0.2
      }

      // Apply new values with boundaries
      let nextVoltage = parseFloat((telemetry.voltage + vDelta).toFixed(1))
      if (nextVoltage < 100) nextVoltage = 100
      if (nextVoltage > 160) nextVoltage = 160

      let nextCurrent = parseFloat((telemetry.current + cDelta).toFixed(1))
      if (nextCurrent < 0) nextCurrent = 0
      if (nextCurrent > 800) nextCurrent = 800

      let nextFrequency = parseFloat((telemetry.frequency + fDelta).toFixed(2))
      if (nextFrequency < 58.0) nextFrequency = 58.0
      if (nextFrequency > 62.0) nextFrequency = 62.0

      // Handle physical dependencies
      let nextMotorSpeed = telemetry.motorSpeed
      if (telemetry.breakerStatus === 'ligado') {
        const targetSpeed = (nextFrequency / 60.0) * 1500
        nextMotorSpeed = Math.round(telemetry.motorSpeed + (targetSpeed - telemetry.motorSpeed) * 0.3)
      } else if (telemetry.breakerStatus === 'desligado') {
        nextMotorSpeed = Math.max(0, Math.round(telemetry.motorSpeed * 0.7))
      } else {
        nextMotorSpeed = Math.max(0, Math.round(telemetry.motorSpeed * 0.3 + (Math.random() - 0.5) * 100))
      }

      const nextTelemetry = {
        voltage: nextVoltage,
        current: nextCurrent,
        frequency: nextFrequency,
        breakerStatus: telemetry.breakerStatus,
        motorSpeed: nextMotorSpeed,
      }

      const nextHistory = [...history, { time: timeStr, voltage: nextVoltage, current: nextCurrent, frequency: nextFrequency }]
        .slice(-60)

      const activeAlarms: Alarm[] = [...alarms]

      const checkAlarm = (
        variable: 'voltage' | 'current' | 'frequency' | 'breakerStatus',
        isTriggered: boolean,
        type: 'High-High' | 'Low-Low' | 'High' | 'Low' | 'Fail',
        severity: 'critical' | 'attention',
        value: string | number,
        message: string
      ) => {
        const alarmIndex = activeAlarms.findIndex(a => a.variable === variable && a.type === type && a.status === 'active')
        
        if (isTriggered) {
          if (alarmIndex === -1) {
            activeAlarms.unshift({
              id: `${variable}-${type}-${Date.now()}`,
              timestamp: timeStr,
              variable,
              type,
              severity,
              value,
              message,
              status: 'active',
            })
          } else {
            activeAlarms[alarmIndex] = { ...activeAlarms[alarmIndex], value }
          }
        } else {
          if (alarmIndex !== -1) {
            activeAlarms[alarmIndex] = { ...activeAlarms[alarmIndex], status: 'cleared' }
          }
        }
      }

      checkAlarm('voltage', nextVoltage > 142.0, 'High-High', 'critical', nextVoltage, `Sobretensão Crítica: Rede operando em ${nextVoltage} kV (Limite: >142 kV)`)
      checkAlarm('voltage', nextVoltage < 132.0, 'Low-Low', 'critical', nextVoltage, `Subtensão Crítica: Rede operando em ${nextVoltage} kV (Limite: <132 kV)`)
      checkAlarm('voltage', (nextVoltage > 140.0 && nextVoltage <= 142.0), 'High', 'attention', nextVoltage, `Tensão em Nível Alto (Alerta): ${nextVoltage} kV`)
      checkAlarm('voltage', (nextVoltage >= 132.0 && nextVoltage < 135.0), 'Low', 'attention', nextVoltage, `Tensão em Nível Baixo (Alerta): ${nextVoltage} kV`)

      checkAlarm('frequency', nextFrequency < 59.50, 'Low-Low', 'critical', nextFrequency, `Subfrequência Crítica detectada: ${nextFrequency} Hz (Limite: <59.5 Hz)`)
      checkAlarm('frequency', nextFrequency >= 59.50 && nextFrequency < 59.80, 'Low', 'attention', nextFrequency, `Frequência instável (Atenção): ${nextFrequency} Hz`)

      checkAlarm('breakerStatus', telemetry.breakerStatus === 'falha', 'Fail', 'critical', 'FALHA', `Disjuntor Principal em estado de FALHA operativa!`)

      set({
        telemetry: nextTelemetry,
        history: nextHistory,
        alarms: activeAlarms.slice(0, 100),
      })
    }, 500)
  },

  stopSimulation: () => {
    if (simIntervalId) {
      clearInterval(simIntervalId)
      simIntervalId = null
    }
    set({ isSimulating: false })
  },

  toggleBreaker: (status) => {
    set((state) => {
      let nextStatus: 'ligado' | 'desligado' | 'falha'
      if (status) {
        nextStatus = status
      } else {
        if (state.telemetry.breakerStatus === 'ligado') {
          nextStatus = 'desligado'
        } else if (state.telemetry.breakerStatus === 'desligado') {
          nextStatus = 'falha'
        } else {
          nextStatus = 'ligado'
        }
      }
      return { telemetry: { ...state.telemetry, breakerStatus: nextStatus } }
    })
  },

  triggerRandomFault: () => {
    set((state) => ({
      telemetry: {
        ...state.telemetry,
        breakerStatus: 'falha',
        frequency: 59.2,
      },
    }))
  },

  clearAlarms: () => {
    set({ alarms: [] })
  },
})
