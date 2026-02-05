// app/(pages)/advance/loading.tsx
'use client'

import { Box, Skeleton, useMediaQuery } from '@mui/material'

export default function AdvanceLoading() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton 
          variant="text" 
          width="60%" 
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton 
          variant="text" 
          width="40%" 
          height={24}
        />
      </Box>

      {/* Stats Grid Skeleton */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(4, 1fr)' 
          }, 
          gap: 2, 
          mb: 4 
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={100}
          />
        ))}
      </Box>

      {/* Features Grid Skeleton */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={200}
          />
        ))}
      </Box>
    </Box>
  )
}