// components/googleadminsupport/GoogleSupportStats.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Box,
  Typography,
  alpha,
} from '@mui/material'
import {
  Forum,
  PriorityHigh as PriorityIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { SupportStatsProps } from './types'

export default function GoogleSupportStats({ stats, darkMode }: SupportStatsProps) {
  const statCards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      icon: <Forum />,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      label: 'Urgent Priority',
      value: stats.urgent,
      icon: <PriorityIcon />,
      color: '#ea4335',
    },
    {
      label: 'Open Tickets',
      value: stats.open,
      icon: <ChatIcon />,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: <CheckCircleIcon />,
      color: '#34a853',
    },
  ]

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 4, flexWrap: "wrap" }}
    >
      {statCards.map((stat, index) => (
        <Card 
          key={index}
          sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? `0 8px 16px ${alpha(stat.color, 0.2)}`
                : `0 8px 16px ${alpha(stat.color, 0.1)}`,
            },
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ 
                bgcolor: alpha(stat.color, 0.1),
                color: stat.color,
                width: 48,
                height: 48,
              }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ 
                    color: stat.color,
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}