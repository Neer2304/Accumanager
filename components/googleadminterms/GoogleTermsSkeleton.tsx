// components/googleadminterms/GoogleTermsSkeleton.tsx
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

export default function GoogleTermsSkeleton() {
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
            
            <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: '12px' }} />
          </Box>
        </Box>

        {/* Main Card Skeleton */}
        <Card sx={{
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '12px', ml: 'auto' }} />
            </Box>
            
            {/* List Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ 
                  p: 2, 
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="text" width={150} height={28} />
                      <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '10px' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}