// components/googlesecurity/GoogleSecuritySkeleton.tsx
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

export default function GoogleSecuritySkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={120} height={40} />
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)' }
            }}>
              <Card sx={{ 
                height: '100%', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2, borderRadius: 1 }} />
                  <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                  {[1, 2, 3, 4].map((feature) => (
                    <Skeleton key={feature} variant="text" width="90%" height={20} sx={{ mb: 1 }} />
                  ))}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}