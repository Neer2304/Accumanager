// components/googleadminvisitors/GoogleVisitorsRealtime.tsx
'use client'

import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Badge,
  alpha,
} from '@mui/material'
import {
  Timeline,
  PhoneAndroid,
  DesktopWindows,
} from '@mui/icons-material'
import { RealtimeTabProps } from './types'

export default function GoogleVisitorsRealtime({ 
  visitors, 
  stats, 
  darkMode,
  formatDistance 
}: RealtimeTabProps) {
  const activeVisitors = visitors.filter(v => 
    new Date(v.lastVisit) > new Date(Date.now() - 5 * 60000)
  )

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? alpha('#EA4335', 0.05) : alpha('#EA4335', 0.02),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Badge color="error" variant="dot">
          <Avatar sx={{ bgcolor: '#EA4335' }}>
            <Timeline />
          </Avatar>
        </Badge>
        <Box>
          <Typography variant="h6" fontWeight="500" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Live Activity
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {stats?.activeNow || 0} visitors active in last 5 minutes
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {activeVisitors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              No active visitors at the moment
            </Typography>
          </Box>
        ) : (
          activeVisitors.map((visitor) => (
            <Paper
              key={visitor._id}
              elevation={0}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: '12px',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                bgcolor: darkMode ? '#202124' : '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: darkMode 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#EA4335', 0.1) }}>
                  {visitor.device.isMobile ? <PhoneAndroid /> : <DesktopWindows />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {visitor.location?.city || 'Unknown'}, {visitor.location?.country || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {formatDistance(new Date(visitor.lastVisit), new Date(), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} display="block">
                    {visitor.device.browser} on {visitor.device.os} • {visitor.pageUrl}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Paper>
  )
}