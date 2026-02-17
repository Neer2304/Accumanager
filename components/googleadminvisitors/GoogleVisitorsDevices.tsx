// components/googleadminvisitors/GoogleVisitorsDevices.tsx
'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
} from '@mui/material'
import { Bar } from 'react-chartjs-2'
import { DevicesTabProps } from './types'

export default function GoogleVisitorsDevices({ stats, chartOptions, darkMode }: DevicesTabProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            backgroundColor: darkMode ? '#303134' : '#ffffff',
          }}
        >
          <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Browser Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar
              data={{
                labels: stats.byBrowser.map(b => b.name),
                datasets: [{
                  label: 'Visitors',
                  data: stats.byBrowser.map(b => b.value),
                  backgroundColor: '#4285F4',
                  borderRadius: 8,
                }]
              }}
              options={chartOptions}
            />
          </Box>
        </Paper>
      </Box>
      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            backgroundColor: darkMode ? '#303134' : '#ffffff',
          }}
        >
          <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Operating Systems
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar
              data={{
                labels: stats.byOS.map(o => o.name),
                datasets: [{
                  label: 'Visitors',
                  data: stats.byOS.map(o => o.value),
                  backgroundColor: '#34A853',
                  borderRadius: 8,
                }]
              }}
              options={chartOptions}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}