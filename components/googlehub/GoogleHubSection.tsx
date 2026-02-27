// components/googlehub/GoogleHubSection.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Divider,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material'
import { SectionProps, googleColors } from './types'

export default function GoogleHubSection({
  title,
  subtitle,
  icon,
  action,
  children,
  loading = false,
  sx,
}: SectionProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (loading) {
    return (
      <Box sx={{ mb: 6, ...sx }}>
        <Skeleton width={200} height={32} sx={{ mb: 1 }} />
        <Skeleton width={300} height={20} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ width: { xs: '100%', md: 'calc(25% - 18px)' } }}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 6, ...sx }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon && (
            <Box sx={{ color: googleColors.blue, display: 'flex' }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action && <Box>{action}</Box>}
      </Box>

      {/* Optional Divider */}
      {subtitle && <Divider sx={{ mb: 3, borderColor: darkMode ? googleColors.greyDark : googleColors.greyBorder }} />}

      {/* Content */}
      {children}
    </Box>
  )
}