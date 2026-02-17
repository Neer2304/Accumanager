// components/googleadminvisitors/GoogleVisitorsSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  useTheme,
} from '@mui/material'

export default function GoogleVisitorsSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[1, 2, 3, 4].map(i => (
          <Box key={i} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
          </Box>
        ))}
      </Box>
    </Container>
  )
}