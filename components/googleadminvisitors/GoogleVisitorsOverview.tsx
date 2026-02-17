// components/googleadminvisitors/GoogleVisitorsOverview.tsx
'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Chip,
  alpha,
} from '@mui/material'
import {
  Public,
} from '@mui/icons-material'
import { Line, Doughnut } from 'react-chartjs-2'
import { OverviewTabProps } from './types'

export default function GoogleVisitorsOverview({ 
  stats, 
  hourlyChartData, 
  deviceChartData, 
  chartOptions,
  darkMode 
}: OverviewTabProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              height: 400,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Hourly Activity
            </Typography>
            <Box sx={{ height: 320 }}>
              <Line data={hourlyChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              height: 400,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Device Distribution
            </Typography>
            <Box sx={{ height: 280 }}>
              <Doughnut 
                data={deviceChartData} 
                options={{
                  cutout: '70%',
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: darkMode ? '#e8eaed' : '#202124' }
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Box>
      </Box>

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
              Top Countries
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {stats.byCountry.slice(0, 5).map((country, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: i < 4 ? `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{country.country}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {country.visitors}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${((country.visitors / stats.totalVisitors) * 100).toFixed(1)}%`}
                      sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                    />
                  </Box>
                </Box>
              ))}
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
              Top Pages
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {stats.topPages.slice(0, 5).map((page, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: i < 4 ? `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` : 'none'
                  }}
                >
                  <Typography noWrap sx={{ maxWidth: 250, color: darkMode ? '#e8eaed' : '#202124' }}>
                    {page.url}
                  </Typography>
                  <Chip
                    size="small"
                    label={page.visits}
                    sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}