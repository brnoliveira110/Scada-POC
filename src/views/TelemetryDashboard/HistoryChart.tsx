import React from 'react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts'
import type { HistoryPoint } from '../../store/useSCADAStore'

interface HistoryChartProps {
  data: HistoryPoint[]
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  // We want to grab a subset or render the full history. 
  // Desactivamos animaciones (isAnimationActive={false}) para evitar re-cálculos costosos de CPU.
  
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(tick) => {
              // Only display every 10th label to keep chart clean
              const parts = tick.split(':')
              return parts[2] % 5 === 0 ? `${parts[1]}:${parts[2]}` : ''
            }}
          />
          <YAxis 
            domain={[125, 150]} 
            stroke="#6b7280" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            unit=" kV"
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#111318', 
              borderColor: '#1f2937',
              borderRadius: '8px',
              color: '#c9d1d9',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#60a5fa' }}
            cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="voltage"
            name="Tensão"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVoltage)"
            isAnimationActive={false} // CRITICAL FOR HIGH-FREQUENCY RENDERING SUAVITY
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
