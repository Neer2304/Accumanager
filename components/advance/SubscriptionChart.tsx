// components/advance/SubscriptionChart.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface SubscriptionChartProps {
  data: any[]
  height?: number
}

export default function SubscriptionChart({ data, height = 300 }: SubscriptionChartProps) {
  const { currentScheme } = useAdvanceThemeContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = height

    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Find max revenue for scaling
    const maxRevenue = Math.max(...data.map(d => d.revenue))
    
    // Draw grid
    ctx.strokeStyle = `${currentScheme.colors.components.border}50`
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight * i) / gridLines
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw revenue line
    ctx.beginPath()
    ctx.strokeStyle = currentScheme.colors.primary
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw data points
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight
      
      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.strokeStyle = currentScheme.colors.primary
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw value
      ctx.fillStyle = currentScheme.colors.text.primary
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(`₹${point.revenue.toLocaleString()}`, x, y - 15)
      
      // X-axis labels
      ctx.fillStyle = currentScheme.colors.text.secondary
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(point.month, x, canvas.height - padding + 20)
    })

    // Draw area under line
    ctx.beginPath()
    ctx.moveTo(padding, padding + chartHeight)
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight
      ctx.lineTo(x, y)
    })
    ctx.lineTo(canvas.width - padding, padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = `${currentScheme.colors.primary}20`
    ctx.fill()

  }, [data, currentScheme, height])

  return (
    <Box sx={{ position: 'relative', height }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </Box>
  )
}