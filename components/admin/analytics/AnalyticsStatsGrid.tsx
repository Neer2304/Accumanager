import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Payment,
  CalendarToday,
} from '@mui/icons-material';

interface AnalyticsStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  trialUsers: number;
  totalUsers: number;
  paymentCount: number;
}

interface AnalyticsStatsGridProps {
  stats: AnalyticsStats;
}

export const AnalyticsStatsGrid: React.FC<AnalyticsStatsGridProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <Payment />,
      color: '#1976d2',
      subtitle: 'Based on completed payments',
      trend: true,
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.activeSubscriptions),
      icon: <People />,
      color: '#9c27b0',
      subtitle: `${stats.trialUsers} trial users`,
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <Payment />,
      color: '#ed6c02',
      subtitle: 'Last 30 days',
    },
    {
      title: 'Total Payments',
      value: formatNumber(stats.paymentCount),
      icon: <CalendarToday />,
      color: '#0288d1',
      subtitle: 'Successful transactions',
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
            
            {stat.trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 14, mr: 0.5, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Based on completed payments
                </Typography>
              </Box>
            )}
            
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