// components/googleadminusers/GoogleUsersStats.tsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  People,
  AccountBalance,
  TrendingUp,
  Timeline,
} from '@mui/icons-material';

interface UsersStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  expiredUsers: number;
  recentSignups: number;
  revenueStats?: {
    monthly: number;
    total: number;
  };
}

interface GoogleUsersStatsProps {
  stats: UsersStats;
}

export const GoogleUsersStats: React.FC<GoogleUsersStatsProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      subtitle: `${stats.activeUsers} active`,
      icon: <People />,
      color: '#1976d2',
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(stats.activeUsers - stats.trialUsers),
      subtitle: `${stats.trialUsers} trials`,
      icon: <TrendingUp />,
      color: '#2e7d32',
    },
    {
      title: 'Recent Signups',
      value: formatNumber(stats.recentSignups),
      subtitle: 'Last 30 days',
      icon: <Timeline />,
      color: '#ed6c02',
    },
    {
      title: 'Expired/Inactive',
      value: formatNumber(stats.expiredUsers),
      subtitle: 'Need attention',
      icon: <AccountBalance />,
      color: '#d32f2f',
    },
  ];

  if (stats.revenueStats) {
    statCards.push({
      title: 'Monthly Revenue',
      value: formatCurrency(stats.revenueStats.monthly),
      subtitle: `Total: ${formatCurrency(stats.revenueStats.total)}`,
      icon: <AccountBalance />,
      color: '#9c27b0',
    });
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: `repeat(${statCards.length}, 1fr)` 
      }, 
      gap: 3 
    }}>
      {statCards.map((stat, index) => (
        <Card
          key={index}
          sx={{
            background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 1, opacity: 0.9 }}>{stat.icon}</Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                {stat.title}
              </Typography>
            </Box>
            
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {stat.value}
            </Typography>
            
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
              {stat.subtitle}
            </Typography>
            
            <Box
              sx={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                opacity: 0.1,
                transform: 'scale(2)',
              }}
            >
              {stat.icon}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};