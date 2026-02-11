// components/admin/dashboard/PlatformMetrics.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Speed,
  Storage,
  Security,
  TrendingUp,
  AccessTime,
  People,
  MonetizationOn,
  DeviceHub,
} from '@mui/icons-material';

interface PlatformMetricsProps {
  totalProducts: number;
  totalUsageHours: number;
  revenue: number;
  totalUsers: number;
}

export const PlatformMetrics: React.FC<PlatformMetricsProps> = ({
  totalProducts,
  totalUsageHours,
  revenue,
  totalUsers,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  // Google Material Design Colors
  const googleColors = {
    primary: '#1a73e8',
    primaryLight: '#8ab4f8',
    secondary: '#34a853',
    warning: '#fbbc04',
    error: '#ea4335',
    purple: '#8b5cf6',
    cyan: '#0ea5e9',
    grey50: '#f8f9fa',
    grey100: '#f1f3f4',
    grey200: '#e8eaed',
    grey300: '#dadce0',
    grey400: '#bdc1c6',
    grey500: '#9aa0a6',
    grey600: '#80868b',
    grey700: '#5f6368',
    grey800: '#3c4043',
    grey900: '#202124',
  };

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

  const metrics = [
    {
      label: 'Platform Uptime',
      value: '99.9%',
      icon: <Speed />,
      color: googleColors.secondary,
      progress: 99.9,
      description: 'Last 30 days',
    },
    {
      label: 'API Response Time',
      value: '< 200ms',
      icon: <Speed />,
      color: googleColors.cyan,
      progress: 95,
      description: 'Average response',
    },
    {
      label: 'Data Accuracy',
      value: '99.5%',
      icon: <Storage />,
      color: googleColors.primary,
      progress: 99.5,
      description: 'Real-time sync',
    },
    {
      label: 'System Load',
      value: '45%',
      icon: <DeviceHub />,
      color: googleColors.warning,
      progress: 45,
      description: 'Current capacity',
    },
    {
      label: 'Security Score',
      value: 'A+',
      icon: <Security />,
      color: googleColors.secondary,
      progress: 98,
      description: 'Encryption & auth',
    },
    {
      label: 'User Satisfaction',
      value: '4.8/5',
      icon: <People />,
      color: googleColors.purple,
      progress: 96,
      description: 'Average rating',
    },
  ];

  const kpis = [
    {
      label: 'Avg Revenue Per User',
      value: formatCurrency(totalUsers > 0 ? revenue / totalUsers : 0),
      icon: <MonetizationOn />,
      change: '+12%',
      trend: 'up',
      trendColor: googleColors.secondary,
    },
    {
      label: 'Daily Active Users',
      value: Math.round(totalUsers * 0.35).toLocaleString(),
      icon: <People />,
      change: '+8%',
      trend: 'up',
      trendColor: googleColors.secondary,
    },
    {
      label: 'Avg Session Duration',
      value: '24m 18s',
      icon: <AccessTime />,
      change: '+5%',
      trend: 'up',
      trendColor: googleColors.secondary,
    },
    {
      label: 'Feature Adoption',
      value: '78%',
      icon: <TrendingUp />,
      change: '+15%',
      trend: 'up',
      trendColor: googleColors.secondary,
    },
  ];

  const services = [
    { label: 'Database', status: 'operational', color: googleColors.secondary },
    { label: 'API Gateway', status: 'operational', color: googleColors.secondary },
    { label: 'Cache Server', status: 'operational', color: googleColors.secondary },
    { label: 'File Storage', status: 'operational', color: googleColors.secondary },
    { label: 'Email Service', status: 'operational', color: googleColors.secondary },
    { label: 'Analytics', status: 'operational', color: googleColors.secondary },
  ];

  return (
    <Card sx={{
      borderRadius: '16px',
      backgroundColor: darkMode ? googleColors.grey900 : '#ffffff',
      border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
      boxShadow: 'none',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 500,
            color: darkMode ? googleColors.grey200 : googleColors.grey900,
            mb: 1,
          }}>
            Platform Health & Performance
          </Typography>
          <Typography variant="body2" sx={{ 
            color: darkMode ? googleColors.grey500 : googleColors.grey600,
          }}>
            Real-time system metrics and user engagement analytics
          </Typography>
        </Box>

        {/* Performance Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 4 
        }}>
          {metrics.map((metric, index) => (
            <Box
              key={index}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: `1px solid ${alpha(metric.color, 0.2)}`,
                backgroundColor: alpha(metric.color, 0.05),
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(metric.color, 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(metric.color, 0.15)}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: alpha(metric.color, 0.1),
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 500,
                    color: darkMode ? googleColors.grey200 : googleColors.grey900,
                  }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  }}>
                    {metric.label}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey200,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ 
                mt: 1, 
                display: 'block',
                color: darkMode ? googleColors.grey500 : googleColors.grey600,
              }}>
                {metric.description}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* KPI Indicators */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 500,
            color: darkMode ? googleColors.grey200 : googleColors.grey900,
            mb: 2,
          }}>
            Key Performance Indicators
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 2 
          }}>
            {kpis.map((kpi, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                  backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: darkMode ? googleColors.grey700 : googleColors.grey100,
                    borderColor: darkMode ? googleColors.grey600 : googleColors.grey300,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      backgroundColor: alpha(kpi.trendColor, 0.1),
                      color: kpi.trendColor,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 500,
                      color: darkMode ? googleColors.grey200 : googleColors.grey900,
                    }}>
                      {kpi.value}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                    }}>
                      {kpi.label}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={kpi.change}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: kpi.trendColor,
                    backgroundColor: alpha(kpi.trendColor, 0.1),
                    border: 'none',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* System Status */}
        <Box>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 500,
            color: darkMode ? googleColors.grey200 : googleColors.grey900,
            mb: 2,
          }}>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {services.map((service, index) => (
              <Chip
                key={index}
                label={`${service.label}: ${service.status}`}
                variant="outlined"
                size="small"
                icon={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: service.color,
                    }}
                  />
                }
                sx={{
                  borderColor: alpha(service.color, 0.3),
                  backgroundColor: alpha(service.color, 0.1),
                  color: service.color,
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};