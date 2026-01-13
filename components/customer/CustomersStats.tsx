import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Person, TrendingUp, AttachMoney, LocationOn } from '@mui/icons-material';
import { Customer } from './types';

interface CustomerStatsProps {
  customers: Customer[];
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({ customers }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.totalOrders > 0).length,
    revenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    interstate: customers.filter(c => c.isInterState).length,
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.total,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: Person,
    },
    {
      title: 'Active Customers',
      value: stats.active,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: TrendingUp,
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString('en-IN')}`,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: AttachMoney,
    },
    {
      title: 'Inter-State',
      value: stats.interstate,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: LocationOn,
    },
  ];

  if (isMobile) return null; // 移动端不显示统计卡片

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2, 
      mb: 3,
      flexWrap: 'wrap'
    }}>
      {statCards.map((stat, index) => (
        <Paper 
          key={index}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            flex: 1,
            minWidth: { xs: '100%', sm: '200px' },
            background: stat.gradient,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            }
          }}
        >
          <stat.icon sx={{ fontSize: 24, mb: 1, opacity: 0.9 }} />
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            {stat.value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {stat.title}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};