// components/googleadmindashboard/components/DashboardStats.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  People,
  Inventory,
  AttachMoney,
  PendingActions
} from '@mui/icons-material';
import { DashboardStats as StatsType } from './types';

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const statItems = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <People />,
      color: '#1a73e8',
      change: '+12%'
    },
    {
      label: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <Inventory />,
      color: '#34a853',
      change: '+5%'
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: '#fbbc04',
      change: '+8%'
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks.toLocaleString(),
      icon: <PendingActions />,
      color: '#ea4335',
      change: '-2%'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3,
      mb: 4
    }}>
      {statItems.map((stat, index) => (
        <Box key={index} sx={{ 
          flex: '1 1 calc(25% - 24px)', 
          minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' }
        }}>
          <Card sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124', mt: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.color, display: 'block', mt: 0.5 }}>
                    {stat.change} vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  backgroundColor: alpha(stat.color, 0.1),
                  color: stat.color,
                  width: 48,
                  height: 48,
                  borderRadius: '12px'
                }}>
                  {stat.icon}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};