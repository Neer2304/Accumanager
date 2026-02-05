// components/advance/DashboardChart.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface DashboardChartProps {
  data: any[]
  height?: number
}

export default function DashboardChart({ data, height = 300 }: DashboardChartProps) {
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

    // Find max values for scaling
    const maxRevenue = Math.max(...data.map(d => d.revenue))
    const maxCustomers = Math.max(...data.map(d => d.customers))
    const maxScreenTime = Math.max(...data.map(d => d.screenTime))

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
      
      // Y-axis labels
      ctx.fillStyle = currentScheme.colors.text.secondary
      ctx.font = '12px Inter'
      ctx.textAlign = 'right'
      ctx.fillText(
        Math.round((maxRevenue * (gridLines - i)) / gridLines).toLocaleString(),
        padding - 10,
        y + 4
      )
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

    // Draw customers line
    ctx.beginPath()
    ctx.strokeStyle = currentScheme.colors.secondary
    ctx.lineWidth = 2
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      const y = padding + chartHeight - (point.customers / maxCustomers) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw screen time line
    ctx.beginPath()
    ctx.strokeStyle = currentScheme.colors.buttons.warning
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      const y = padding + chartHeight - (point.screenTime / maxScreenTime) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw data points
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1)
      
      // Revenue point
      const revenueY = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight
      ctx.beginPath()
      ctx.arc(x, revenueY, 4, 0, Math.PI * 2)
      ctx.fillStyle = currentScheme.colors.primary
      ctx.fill()
      
      // Customers point
      const customersY = padding + chartHeight - (point.customers / maxCustomers) * chartHeight
      ctx.beginPath()
      ctx.arc(x, customersY, 4, 0, Math.PI * 2)
      ctx.fillStyle = currentScheme.colors.secondary
      ctx.fill()
      
      // X-axis labels
      ctx.fillStyle = currentScheme.colors.text.secondary
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(point.month, x, canvas.height - padding + 20)
    })

    // Draw legend
    const legendItems = [
      { label: 'Revenue', color: currentScheme.colors.primary },
      { label: 'Customers', color: currentScheme.colors.secondary },
      { label: 'Screen Time', color: currentScheme.colors.buttons.warning }
    ]

    legendItems.forEach((item, index) => {
      const x = padding + index * 100
      const y = padding - 20
      
      // Color box
      ctx.fillStyle = item.color
      ctx.fillRect(x, y, 12, 12)
      
      // Label
      ctx.fillStyle = currentScheme.colors.text.primary
      ctx.font = '12px Inter'
      ctx.textAlign = 'left'
      ctx.fillText(item.label, x + 20, y + 10)
    })

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