import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  data: Array<{
    name: string
    value: number
    [key: string]: any
  }>
  color?: string
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  maxValue?: number
}

export function BarChart({ 
  data, 
  color = '#14301f', 
  height = 300, 
  showGrid = true, 
  showTooltip = true,
  maxValue 
}: BarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-medium">
          <p className="text-sm font-medium text-text-primary mb-1">
            {label}
          </p>
          <div className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-text-secondary mr-2">Count:</span>
            <span className="font-medium text-text-primary">{payload[0].value}</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, maxValue || 'dataMax']}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}