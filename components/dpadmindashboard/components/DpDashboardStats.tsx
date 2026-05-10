// components/dpadmindashboard/components/DpDashboardStats.tsx
import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Stack, alpha } from '@mui/material';
import { People, Inventory, AttachMoney, PendingActions } from '@mui/icons-material';
import { DashboardStats as StatsType, dpColors } from './types';

export const DpDashboardStats: React.FC<{ stats: StatsType }> = ({ stats }) => {
  const statItems = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <People />, color: dpColors.red, change: '+12%' },
    { label: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: <Inventory />, color: dpColors.gold, change: '+5%' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoney />, color: dpColors.gold, change: '+8%' },
    { label: 'Pending Tasks', value: stats.pendingTasks.toLocaleString(), icon: <PendingActions />, color: dpColors.error, change: '-2%' }
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
      {statItems.map((stat, index) => (
        <Box key={index} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' } }}>
          <Card sx={{ borderRadius: '16px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}` }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ color: dpColors.inkSub, fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: dpColors.ink, mt: 1 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: stat.color, display: 'block', mt: 0.5 }}>{stat.change} vs last month</Typography>
                </Box>
                <Avatar sx={{ backgroundColor: alpha(stat.color, 0.15), color: stat.color, width: 48, height: 48, borderRadius: '12px' }}>{stat.icon}</Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};