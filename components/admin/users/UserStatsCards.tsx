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

interface Stats {
  totalUsers: number;
  subscriptionStats: Array<{
    _id: string;
    count: number;
    active: number;
  }>;
  activeUsers: number;
  trialUsers: number;
  revenueStats?: {
    monthly: number;
    total: number;
  };
}

interface UserStatsCardsProps {
  stats: Stats;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
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

  const getPlanData = (planName: string) => {
    const plan = stats.subscriptionStats.find(p => p._id === planName);
    if (!plan) return { count: 0, active: 0 };
    return plan;
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
      value: formatNumber(getPlanData('monthly').active + getPlanData('quarterly').active + getPlanData('yearly').active),
      subtitle: `${getPlanData('trial').count} trials`,
      icon: <TrendingUp />,
      color: '#2e7d32',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.revenueStats?.monthly || 0),
      subtitle: 'Last 30 days',
      icon: <AccountBalance />,
      color: '#ed6c02',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.revenueStats?.total || 0),
      subtitle: 'Lifetime',
      icon: <Timeline />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: 'repeat(4, 1fr)' 
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          }}
        >
          <CardContent sx={{ p: 3, position: 'relative' }}>
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
            
            {/* Decorative background icon */}
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