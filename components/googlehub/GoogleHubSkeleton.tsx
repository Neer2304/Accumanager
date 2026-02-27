// components/googlehub/GoogleHubSkeleton.tsx
'use client'

import React from 'react'
import { Box, Skeleton, useTheme } from '@mui/material'
import { googleColors } from './types'

interface GoogleHubSkeletonProps {
  type?: 'card' | 'table' | 'chart' | 'metric' | 'text'
  count?: number
}

export default function GoogleHubSkeleton({ type = 'card', count = 3 }: GoogleHubSkeletonProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  const renderSkeleton = () => {
    switch (type) {
      case 'metric':
        return (
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Box sx={{ p: 3, bgcolor: darkMode ? googleColors.greyDark : googleColors.white, borderRadius: 3 }}>
              <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
              <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton width="40%" height={16} />
            </Box>
          </Box>
        )

      case 'card':
        return (
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
            <Box sx={{ p: 3, bgcolor: darkMode ? googleColors.greyDark : googleColors.white, borderRadius: 3 }}>
              <Skeleton width="80%" height={24} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={100} sx={{ mb: 2 }} />
              <Skeleton width="60%" height={20} />
            </Box>
          </Box>
        )

      case 'table':
        return (
          <Box sx={{ width: '100%' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton width="25%" height={20} />
                <Skeleton width="25%" height={20} />
                <Skeleton width="25%" height={20} />
                <Skeleton width="25%" height={20} />
              </Box>
            ))}
          </Box>
        )

      case 'chart':
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 250 }}>
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

      default:
        return <Skeleton width="100%" height={100} />
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </Box>
  )
}