// components/googleabout/GoogleAboutSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  useTheme,
} from '@mui/material'

export default function GoogleAboutSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      {/* Header Skeleton */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={120} height={40} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Skeleton */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rectangular" width={200} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Box>

        {/* Mission & Vision Skeleton */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          mb: 8
        }}>
          {[1, 2].map((item) => (
            <Box key={item} sx={{ flex: 1 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>

        {/* Values Skeleton */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto', mb: 4 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          mb: 8
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              minWidth: { xs: '100%', sm: 280 }
            }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}