'use client'

import React from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Coffee, AutoGraph } from '@mui/icons-material'
// Using the advanced Market Dashboard instead of the simple MarketGame
import TradeDashboard from '@/components/trading/TradeDashboard'

export default function BreakroomPage() {
  return (
    <MainLayout title="AccuTrade Terminal">
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', py: 4, px: 2, bgcolor: '#0b0e11', borderBottom: '1px solid #2b3139' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mb={1}>
            <AutoGraph sx={{ fontSize: 40, color: '#2ebd85' }} />
            <Typography variant="h3" fontWeight="900" color="white">
              AccuTrade <span style={{ color: '#2ebd85' }}>Pro</span>
            </Typography>
          </Stack>
          <Typography variant="body1" color="#848e9c">
            Real-time market simulation. Sharpen your trading instincts.
          </Typography>
        </Box>

        {/* Game/Trading Area - No Grid, uses full width Flex */}
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
           <TradeDashboard />
        </Box>

        {/* Footer Hint */}
        <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#0b0e11', color: '#474d57' }}>
          <Typography variant="caption">
            Trading involves virtual risk. Your business data is not affected by market performance.
          </Typography>
        </Box>
      </Box>
    </MainLayout>
  )
}