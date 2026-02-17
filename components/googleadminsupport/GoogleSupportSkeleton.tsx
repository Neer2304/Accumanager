// components/googleadminsupport/GoogleSupportSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material'

export default function GoogleSupportSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        {/* Header Skeleton */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Skeleton variant="text" width={150} height={40} sx={{ mb: 2 }} />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: '16px' }} />
              <Box>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={250} height={24} />
              </Box>
            </Box>
            
            <Skeleton variant="rectangular" width={100} height={48} sx={{ borderRadius: '12px' }} />
          </Box>
        </Box>

        {/* Stats Cards Skeleton */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} sx={{ flex: 1, minWidth: 200, borderRadius: '16px' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box>
                    <Skeleton variant="text" width={60} height={40} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Filters Skeleton */}
        <Card sx={{ mb: 3, borderRadius: '16px' }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
              <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: '8px' }} />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: '8px' }} />
                <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: '8px' }} />
                <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: '8px' }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Skeleton variant="text" width={150} height={28} />
                  <Skeleton variant="text" width={100} height={20} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '12px' }} />
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Stack key={i} direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Stack>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}