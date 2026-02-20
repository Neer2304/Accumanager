// components/googleadminanalytics/components/AdminStatsGrid.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  People,
  Person,
  AttachMoney,
  Payment,
  Percent
} from '@mui/icons-material';
import { StatsData } from './types';

interface AdminStatsGridProps {
  stats: StatsData;
  darkMode: boolean;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats, darkMode }) => {
  const statItems = [
    { 
      label: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: AttachMoney,
      color: '#34a853'
    },
    { 
      label: 'Monthly Revenue', 
      value: `₹${stats.monthlyRevenue.toLocaleString()}`, 
      icon: TrendingUp,
      color: '#1a73e8'
    },
    { 
      label: 'Active Subs', 
      value: stats.activeSubscriptions.toLocaleString(), 
      icon: People,
      color: '#8ab4f8'
    },
    { 
      label: 'Trial Users', 
      value: stats.trialUsers.toLocaleString(), 
      icon: Person,
      color: '#fbbc04'
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: People,
      color: '#5f6368'
    },
    { 
      label: 'Payments', 
      value: stats.paymentCount.toLocaleString(), 
      icon: Payment,
      color: '#ea4335'
    },
    { 
      label: 'Conversion', 
      value: `${stats.conversionRate}%`, 
      icon: Percent,
      color: '#34a853'
    },
    { 
      label: 'ARPU', 
      value: `₹${stats.avgRevenuePerUser.toLocaleString()}`, 
      icon: AttachMoney,
      color: '#1a73e8'
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 }
    }}>
      {statItems.map((stat, index) => (
        <Box 
          key={index}
          sx={{ 
            flex: {
              xs: '1 1 calc(50% - 12px)',
              sm: '1 1 calc(33.333% - 16px)',
              md: '1 1 calc(25% - 18px)'
            },
            minWidth: {
              xs: 'calc(50% - 12px)',
              sm: 'calc(33.333% - 16px)',
              md: 'calc(25% - 18px)'
            }
          }}
        >
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
            }
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: `${stat.color}20`,
                  color: stat.color,
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '12px'
                }}>
                  <stat.icon />
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color={darkMode ? '#e8eaed' : '#202124'}
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={darkMode ? '#9aa0a6' : '#5f6368'}
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};