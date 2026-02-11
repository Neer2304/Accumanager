import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Payment,
  CalendarToday,
  AttachMoney,
  TrendingDown,
  ShowChart,
} from '@mui/icons-material';

interface AnalyticsStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  trialUsers: number;
  totalUsers: number;
  paymentCount: number;
  conversionRate?: string | number; // Can be string or number
  avgRevenuePerUser?: number;
}

interface AnalyticsStatsGridProps {
  stats: AnalyticsStats;
  darkMode?: boolean;
}

export const AnalyticsStatsGrid: React.FC<AnalyticsStatsGridProps> = ({ stats, darkMode = false }) => {
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

  // Helper function to safely convert conversion rate to number
  const getConversionRateValue = () => {
    if (stats.conversionRate === undefined || stats.conversionRate === null) {
      return 0.0;
    }
    
    if (typeof stats.conversionRate === 'string') {
      const num = parseFloat(stats.conversionRate);
      return isNaN(num) ? 0.0 : num;
    }
    
    return stats.conversionRate as number;
  };

  const conversionRateValue = getConversionRateValue();
  const conversionRateFormatted = conversionRateValue.toFixed(1);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <AttachMoney />,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
      subtitle: 'Based on completed payments',
      trendIcon: <TrendingUp fontSize="small" />,
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.activeSubscriptions),
      subValue: `${stats.trialUsers || 0} trial users`,
      icon: <People />,
      color: darkMode ? '#aecbfa' : '#34a853',
      subtitle: 'Active subscriptions',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <ShowChart />,
      color: darkMode ? '#fdd663' : '#fbbc04',
      subtitle: 'Last 30 days',
    },
    {
      title: 'Total Payments',
      value: formatNumber(stats.paymentCount),
      icon: <CalendarToday />,
      color: darkMode ? '#81c995' : '#5f6368',
      subtitle: 'Successful transactions',
    },
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      icon: <People />,
      color: darkMode ? '#f28b82' : '#ea4335',
      subtitle: 'All registered users',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRateFormatted}%`,
      icon: <TrendingUp />,
      color: darkMode ? '#aecbfa' : '#5f6368',
      subtitle: 'User conversion rate',
      trendIcon: conversionRateValue > 10 ? 
        <TrendingUp fontSize="small" /> : 
        <TrendingDown fontSize="small" />,
    },
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(6, 1fr)' 
      }, 
      gap: 3 
    }}>
      {statCards.map((stat, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: stat.color,
          }} />

          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h3" 
                  component="div"
                  fontWeight="bold" 
                  sx={{ 
                    color: stat.color,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    lineHeight: 1
                  }}
                >
                  {stat.value}
                  {stat.subValue && (
                    <Typography 
                      component="span" 
                      variant="body1" 
                      color={darkMode ? '#9aa0a6' : '#5f6368'}
                      sx={{ ml: 0.5, fontSize: '0.875rem' }}
                    >
                      {stat.subValue}
                    </Typography>
                  )}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    mt: 0.5
                  }}
                >
                  {stat.title}
                </Typography>
              </Box>

              <Box sx={{
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${stat.color}20`,
                color: stat.color,
                flexShrink: 0
              }}>
                {stat.icon}
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              mt: 1,
              flexWrap: 'wrap'
            }}>
              {stat.trendIcon}
              <Typography 
                variant="caption" 
                color={darkMode ? '#9aa0a6' : '#5f6368'}
                sx={{ fontSize: '0.75rem' }}
              >
                {stat.subtitle}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};