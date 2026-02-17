// components/googleadminanalysis/GoogleAnalysisSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
  useTheme,
} from '@mui/material'

export default function GoogleAnalysisSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
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
                <Skeleton variant="text" width={300} height={24} />
              </Box>
            </Box>
            
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '8px' }} />
          </Box>
        </Box>

        {/* Stats Cards Skeleton */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Card sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            mb: 3,
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Skeleton variant="text" width={200} height={30} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '12px' }} />
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2, md: 3 },
                mb: { xs: 3, sm: 4 }
              }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i} sx={{ 
                    flex: {
                      xs: '1 1 calc(50% - 12px)',
                      sm: '1 1 calc(33.333% - 16px)',
                      md: '1 1 calc(25% - 18px)',
                      lg: '1 1 calc(16.666% - 20px)'
                    }
                  }}>
                    <Card sx={{ p: 2, borderRadius: '16px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width={40} height={40} />
                          <Skeleton variant="text" width={80} height={20} sx={{ mt: 1 }} />
                        </Box>
                        <Skeleton variant="rectangular" width={36} height={36} sx={{ borderRadius: '12px' }} />
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs Skeleton */}
        <Card sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '8px' }} />
          </Box>
          
          <Box sx={{ p: 3, minHeight: '500px' }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '12px' }} />
          </Box>
        </Card>
      </Container>
    </Box>
  )
}