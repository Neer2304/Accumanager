// components/googleadminproduct/GoogleProductSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Stack,
  useTheme,
} from '@mui/material'

export default function GoogleProductSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} />
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={250} height={24} />
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: '24px' }} />
        </Stack>
      </Stack>

      {/* ID Badges Skeleton */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" width={200} height={32} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" width={150} height={32} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: '16px' }} />
      </Stack>

      {/* Tabs Skeleton */}
      <Skeleton variant="rectangular" height={64} sx={{ mb: 3, borderRadius: '16px' }} />

      {/* Content Skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '16px' }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '16px' }} />
      </Box>
    </Container>
  )
}