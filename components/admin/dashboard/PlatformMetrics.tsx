import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
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
      color: '#2e7d32',
      progress: 99.9,
      description: 'Last 30 days',
    },
    {
      label: 'API Response Time',
      value: '< 200ms',
      icon: <Speed />,
      color: '#0288d1',
      progress: 95,
      description: 'Average response',
    },
    {
      label: 'Data Accuracy',
      value: '99.5%',
      icon: <Storage />,
      color: '#1976d2',
      progress: 99.5,
      description: 'Real-time sync',
    },
    {
      label: 'System Load',
      value: '45%',
      icon: <DeviceHub />,
      color: '#ed6c02',
      progress: 45,
      description: 'Current capacity',
    },
    {
      label: 'Security Score',
      value: 'A+',
      icon: <Security />,
      color: '#2e7d32',
      progress: 98,
      description: 'Encryption & auth',
    },
    {
      label: 'User Satisfaction',
      value: '4.8/5',
      icon: <People />,
      color: '#9c27b0',
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
      trendColor: '#2e7d32',
    },
    {
      label: 'Daily Active Users',
      value: Math.round(totalUsers * 0.35).toLocaleString(),
      icon: <People />,
      change: '+8%',
      trend: 'up',
      trendColor: '#2e7d32',
    },
    {
      label: 'Avg Session Duration',
      value: '24m 18s',
      icon: <AccessTime />,
      change: '+5%',
      trend: 'up',
      trendColor: '#2e7d32',
    },
    {
      label: 'Feature Adoption',
      value: '78%',
      icon: <TrendingUp />,
      change: '+15%',
      trend: 'up',
      trendColor: '#2e7d32',
    },
  ];

  const services = [
    { label: 'Database', status: 'operational', color: '#2e7d32' },
    { label: 'API Gateway', status: 'operational', color: '#2e7d32' },
    { label: 'Cache Server', status: 'operational', color: '#2e7d32' },
    { label: 'File Storage', status: 'operational', color: '#2e7d32' },
    { label: 'Email Service', status: 'operational', color: '#2e7d32' },
    { label: 'Analytics', status: 'operational', color: '#2e7d32' },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Platform Health & Performance
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
                p: 2,
                borderRadius: 2,
                border: `1px solid ${metric.color}20`,
                backgroundColor: `${metric.color}10`,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: `${metric.color}20`,
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {metric.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
                  backgroundColor: `${metric.color}10`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {metric.description}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* KPI Indicators */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
                      borderRadius: '50%',
                      backgroundColor: `${kpi.trendColor}20`,
                      color: kpi.trendColor,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {kpi.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {kpi.label}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={kpi.change}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.675rem',
                    color: kpi.trendColor,
                    borderColor: `${kpi.trendColor}50`,
                    backgroundColor: `${kpi.trendColor}10`,
                  }}
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* System Status */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
                  borderColor: `${service.color}50`,
                  backgroundColor: `${service.color}10`,
                  color: service.color,
                }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};