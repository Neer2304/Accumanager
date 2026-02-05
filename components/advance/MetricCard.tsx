// components/advance/MetricCard.tsx
'use client'

import { Card, CardContent, Box, Typography, IconButton } from '@mui/material'
import { TrendingUp, TrendingDown, MoreVert } from '@mui/icons-material'

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  icon: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

export default function MetricCard({ title, value, change, icon, color = 'primary' }: MetricCardProps) {
  const getColor = () => {
    switch (color) {
      case 'primary': return '#6C63FF'
      case 'secondary': return '#FF6B8B'
      case 'success': return '#4CAF50'
      case 'warning': return '#FF9800'
      case 'error': return '#F44336'
      case 'info': return '#2196F3'
      default: return '#6C63FF'
    }
  }

  const isPositive = change?.includes('+') || !change?.includes('-')

  return (
    <Card sx={{ 
      height: '100%',
      position: 'relative',
      overflow: 'visible',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}80 100%)`,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: `${getColor()}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            {icon}
          </Box>
          
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            
            {change && (
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: '#F44336' }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isPositive ? '#4CAF50' : '#F44336',
                    fontWeight: 'medium'
                  }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}