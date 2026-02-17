// components/googlepricing/GooglePricingSkeleton.tsx
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

export default function GooglePricingSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={120} height={40} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rectangular" width={200} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
              minWidth: { xs: '100%', sm: '300px', md: '250px' }
            }}>
              <Card sx={{ 
                height: '100%', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton 
                    variant="rectangular" 
                    width={100} 
                    height={24} 
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16, 
                      borderRadius: 12 
                    }} 
                  />
                  
                  <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    {[1, 2, 3, 4].map((feature) => (
                      <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                      </Box>
                    ))}
                  </Box>

                  <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Card sx={{ 
          mt: 6, 
          p: 4, 
          textAlign: 'center',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 3 }} />
          <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Card>
      </Container>
    </Box>
  )
}