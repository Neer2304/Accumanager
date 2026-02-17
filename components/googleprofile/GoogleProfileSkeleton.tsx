// components/googleprofile/GoogleProfileSkeleton.tsx
'use client'

import React from 'react'
import {
  Box,
  Skeleton,
  Paper,
  useTheme,
} from '@mui/material'
import { MainLayout } from '@/components/Layout/MainLayout'

export default function GoogleProfileSkeleton() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <MainLayout title="Profile">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        minHeight: '100vh',
      }}>
        {/* Header Skeleton */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>

        {/* Stats Skeleton */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} sx={{ 
              flex: '1 1 calc(25% - 16px)', 
              minWidth: 200,
              p: 2,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="80%" height={16} />
            </Paper>
          ))}
        </Box>

        {/* Tabs Skeleton */}
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Paper sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          }}>
            <Skeleton variant="rectangular" height={60} />
            <Box sx={{ p: 3 }}>
              <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  )
}