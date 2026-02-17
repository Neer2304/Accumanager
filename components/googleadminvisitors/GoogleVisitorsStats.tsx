// components/googleadminvisitors/GoogleVisitorsStats.tsx
'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  alpha,
} from '@mui/material'
import {
  Visibility,
  Today,
  Assessment,
  Devices,
  Schedule,
} from '@mui/icons-material'
import { StatsProps } from './types'

export default function GoogleVisitorsStats({ stats, darkMode }: StatsProps) {
  const statCards = [
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors?.toLocaleString() || 0,
      icon: <Visibility />,
      chipLabel: `${stats?.uniqueIPs || 0} unique IPs`,
      chipColor: '#34A853',
      avatarColor: '#4285F4',
    },
    {
      title: "Today's Visitors",
      value: stats?.todayVisitors?.toLocaleString() || 0,
      icon: <Today />,
      chipIcon: <Schedule sx={{ fontSize: 14 }} />,
      chipLabel: `${stats?.activeNow || 0} active now`,
      chipColor: '#EA4335',
      avatarColor: '#34A853',
    },
    {
      title: 'Page Views',
      value: stats?.totalPageViews?.toLocaleString() || 0,
      icon: <Assessment />,
      chipLabel: `${stats?.bounceRate?.toFixed(1) || 0}% bounce rate`,
      chipColor: '#4285F4',
      avatarColor: '#FBBC05',
    },
    {
      title: 'Desktop Users',
      value: stats?.byDevice?.desktop || 0,
      icon: <Devices />,
      chipLabels: [
        { label: `${stats?.byDevice?.mobile || 0} mobile`, color: '#34A853' },
        { label: `${stats?.byDevice?.tablet || 0} tablet`, color: '#FBBC05' },
      ],
      avatarColor: '#EA4335',
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
      {statCards.map((card, index) => (
        <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 8px 16px rgba(0, 0, 0, 0.3)'
                  : '0 8px 16px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(card.avatarColor, 0.1), color: card.avatarColor }}>
                {card.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {card.title}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {card.chipLabels ? (
                card.chipLabels.map((chip, i) => (
                  <Chip
                    key={i}
                    size="small"
                    label={chip.label}
                    sx={{ bgcolor: alpha(chip.color, 0.1), color: chip.color }}
                  />
                ))
              ) : (
                <Chip
                  size="small"
                  icon={card.chipIcon}
                  label={card.chipLabel}
                  sx={{ bgcolor: alpha(card.chipColor, 0.1), color: card.chipColor }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  )
}