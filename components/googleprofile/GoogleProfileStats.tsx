// components/googleprofile/GoogleProfileStats.tsx
'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  alpha,
} from '@mui/material'
import {
  BusinessCenter,
  Group,
  Receipt,
  Storage,
} from '@mui/icons-material'
import { UserProfile, SubscriptionStatus } from './types'
import { getProgressColor } from './utils'

interface GoogleProfileStatsProps {
  profile: UserProfile | null
  subscriptionStatus?: SubscriptionStatus | null
  darkMode?: boolean
  getUsagePercentage: (resource: string) => number
}

export default function GoogleProfileStats({
  profile,
  subscriptionStatus,
  darkMode,
  getUsagePercentage,
}: GoogleProfileStatsProps) {
  if (!profile?.usage || !subscriptionStatus) return null

  const stats = [
    { 
      title: 'Products', 
      value: profile.usage?.products || 0, 
      limit: subscriptionStatus.limits?.products || 0,
      icon: <BusinessCenter />, 
      color: '#4285f4',
      unit: '',
    },
    { 
      title: 'Customers', 
      value: profile.usage?.customers || 0, 
      limit: subscriptionStatus.limits?.customers || 0,
      icon: <Group />, 
      color: '#34a853',
      unit: '',
    },
    { 
      title: 'Invoices', 
      value: profile.usage?.invoices || 0, 
      limit: subscriptionStatus.limits?.invoices || 0,
      icon: <Receipt />, 
      color: '#fbbc04',
      unit: '',
    },
    { 
      title: 'Storage', 
      value: profile.usage?.storageMB || 0, 
      limit: subscriptionStatus.limits?.storageMB || 0,
      icon: <Storage />, 
      color: '#ea4335',
      unit: 'MB',
    },
  ]

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 },
    }}>
      {stats.map((stat, index) => {
        const percentage = getUsagePercentage(stat.title.toLowerCase());
        return (
          <Paper 
            key={`stat-${index}`}
            sx={{ 
              flex: '1 1 calc(25% - 24px)', 
              minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' },
              p: { xs: 1.5, sm: 2, md: 3 }, 
              borderRadius: '16px', 
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              background: darkMode 
                ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-2px)', 
                boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
              },
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ 
                  p: { xs: 0.75, sm: 1 }, 
                  borderRadius: '10px', 
                  backgroundColor: alpha(stat.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {React.cloneElement(stat.icon, { 
                    sx: { 
                      fontSize: { xs: 20, sm: 24, md: 28 }, 
                      color: stat.color,
                    } 
                  })}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368', 
                      fontWeight: 400,
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant={index < 2 ? "h6" : "h5"}
                    sx={{ 
                      color: stat.color, 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value.toLocaleString()}{stat.unit} / {stat.limit.toLocaleString()}{stat.unit}
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    }}
                  >
                    Usage
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: getProgressColor(percentage),
                      fontWeight: 500,
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    }}
                  >
                    {Math.round(percentage)}%
                  </Typography>
                </Stack>
                <Box sx={{ 
                  position: 'relative', 
                  height: 6, 
                  backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: getProgressColor(percentage),
                      borderRadius: 3,
                    }} 
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  )
}