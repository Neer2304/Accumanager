// components/googleadminads/GoogleAdminAdsStats.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  alpha,
} from '@mui/material'
import {
  MonetizationOn,
  Visibility,
  TrendingUp,
  Campaign,
} from '@mui/icons-material'
import { CampaignStats } from './types'

interface GoogleAdminAdsStatsProps {
  stats: CampaignStats
  darkMode?: boolean
}

export default function GoogleAdminAdsStats({ stats, darkMode }: GoogleAdminAdsStatsProps) {
  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: <MonetizationOn />,
      color: '#34a853',
    },
    {
      label: 'Total Impressions',
      value: stats.totalImpressions.toLocaleString(),
      icon: <Visibility />,
      color: '#1a73e8',
    },
    {
      label: 'Average CTR',
      value: `${stats.averageCTR.toFixed(2)}%`,
      icon: <TrendingUp />,
      color: '#fbbc04',
    },
    {
      label: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: <Campaign />,
      color: '#ea4335',
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
                ? '0 8px 16px rgba(0, 0, 0, 0.3)'
                : '0 8px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ 
                bgcolor: alpha(stat.color, 0.1),
                color: stat.color,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{ 
                    color: stat.color,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
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