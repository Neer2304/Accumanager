// components/batmanadmindashboard/components/BatmanDashboardStats.tsx
import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Stack, alpha } from '@mui/material';
import { People, Inventory, AttachMoney, PendingActions } from '@mui/icons-material';
import { DashboardStats as StatsType, batmanColors } from './types';

export const BatmanDashboardStats: React.FC<{ stats: StatsType }> = ({ stats }) => {
  const statItems = [
    { 
      label: 'Gotham Citizens', 
      value: stats.totalUsers.toLocaleString(), 
      icon: React.createElement(People), 
      color: batmanColors.gold, 
      change: '+12%' 
    },
    { 
      label: 'Wayne Products', 
      value: stats.totalProducts.toLocaleString(), 
      icon: React.createElement(Inventory), 
      color: batmanColors.gold, 
      change: '+5%' 
    },
    { 
      label: 'Wayne Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: React.createElement(AttachMoney), 
      color: batmanColors.gold, 
      change: '+8%' 
    },
    { 
      label: 'Pending Missions', 
      value: stats.pendingTasks.toLocaleString(), 
      icon: React.createElement(PendingActions), 
      color: batmanColors.gold, 
      change: '-2%' 
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
      {statItems.map((stat, index) => (
        <Box key={index} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' } }}>
          <Card sx={{ 
            borderRadius: '16px', 
            backgroundColor: batmanColors.surface, 
            border: `2px solid ${batmanColors.gold}`,
            boxShadow: `0 4px 12px ${alpha(batmanColors.gold, 0.15)}`
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: batmanColors.inkSub, 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ color: batmanColors.ink, mt: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ color: stat.color, display: 'block', mt: 0.5 }}
                  >
                    {stat.change} vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  backgroundColor: alpha(stat.color, 0.15), 
                  color: stat.color, 
                  width: 48, 
                  height: 48, 
                  borderRadius: '12px',
                  border: `1px solid ${stat.color}`
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