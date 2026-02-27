// components/googlehub/GoogleHubChart.tsx
'use client'

import React from 'react'
import {
  Box,
  Tooltip,
  Typography,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material'
import { ChartDataPoint, googleColors } from './types'

interface GoogleHubChartProps {
  data: ChartDataPoint[]
  height?: number
  barColor?: string
  loading?: boolean
  showValues?: boolean
  valueFormatter?: (value: number) => string
}

export default function GoogleHubChart({
  data,
  height = 250,
  barColor = googleColors.blue,
  loading = false,
  showValues = false,
  valueFormatter = (value) => value.toString(),
}: GoogleHubChartProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (loading) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <Skeleton 
            key={i} 
            variant="rectangular" 
            width="100%" 
            height={Math.random() * 150 + 50} 
            sx={{ borderRadius: '4px 4px 0 0' }} 
          />
        ))}
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
          No data available
        </Typography>
      </Box>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      {data.map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0
        
        return (
          <Box
            key={index}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {showValues && (
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
                {valueFormatter(item.value)}
              </Typography>
            )}
            
            <Tooltip title={`${item.label || item.date}: ${valueFormatter(item.value)}`}>
              <Box
                sx={{
                  width: '100%',
                  height: `${barHeight}%`,
                  minHeight: 4,
                  bgcolor: item.color || barColor,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                  '&:hover': {
                    bgcolor: item.color ? alpha(item.color, 0.8) : alpha(barColor, 0.8),
                  },
                }}
              />
            </Tooltip>
            
            <Typography 
              variant="caption" 
              sx={{ 
                transform: 'rotate(-45deg)',
                mt: 2,
                color: darkMode ? '#9aa0a6' : googleColors.grey,
              }}
            >
              {item.date}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}