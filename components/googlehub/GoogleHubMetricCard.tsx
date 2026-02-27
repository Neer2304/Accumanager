// components/googlehub/GoogleHubMetricCard.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material'
import GoogleHubCard from './GoogleHubCard'
import { MetricCardProps, googleColors } from './types'

export default function GoogleHubMetricCard({
  title,
  value,
  subtitle,
  icon,
  color = googleColors.blue,
  trend,
  loading = false,
  onClick,
  sx,
}: MetricCardProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  const getTrendIcon = () => {
    if (!trend) return null
    switch (trend.direction) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16, color: googleColors.green }} />
      case 'down':
        return <TrendingDown sx={{ fontSize: 16, color: googleColors.red }} />
      default:
        return <TrendingFlat sx={{ fontSize: 16, color: googleColors.grey }} />
    }
  }

  const getTrendColor = () => {
    if (!trend) return googleColors.grey
    switch (trend.direction) {
      case 'up': return googleColors.green
      case 'down': return googleColors.red
      default: return googleColors.grey
    }
  }

  if (loading) {
    return (
      <GoogleHubCard sx={{ p: 3, ...sx }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
        <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="80%" height={32} sx={{ mb: 1 }} />
        <Skeleton width="40%" height={16} />
      </GoogleHubCard>
    )
  }

  return (
    <GoogleHubCard hover onClick={onClick} sx={{ p: 3, position: 'relative', overflow: 'hidden', ...sx }}>
      {/* Background Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          opacity: 0.1,
          transform: 'rotate(15deg)',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
        //   sx: { fontSize: 60, color } 
        })}
      </Box>

      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {React.cloneElement(icon as React.ReactElement)}
      </Box>

      {/* Title */}
      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
        {title}
      </Typography>

      {/* Value */}
      <Typography variant="h4" fontWeight={700} sx={{ color, mt: 0.5 }}>
        {value}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey, display: 'block' }}>
          {subtitle}
        </Typography>
      )}

      {/* Trend */}
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          {getTrendIcon()}
          <Typography variant="body2" sx={{ color: getTrendColor() }}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </Typography>
          {trend.label && (
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
              {trend.label}
            </Typography>
          )}
        </Box>
      )}
    </GoogleHubCard>
  )
}