// components/googlereports/components/ReportMetricsGrid.tsx
import React from 'react';
import { Box } from '@mui/material';
import { ReportMetricCard } from './ReportMetricCard';
import { Metrics } from './types';
import {
  TrendingUp as TrendIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  MonetizationOn as RevenueIcon,
  TrendingDown as ChurnIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';

interface ReportMetricsGridProps {
  metrics: Metrics;
  formatCurrency: (amount: number) => string;
  loading?: boolean;
}

export const ReportMetricsGrid: React.FC<ReportMetricsGridProps> = ({
  metrics,
  formatCurrency,
  loading = false
}) => {
  const metricItems = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: <RevenueIcon fontSize="small" />,
      color: 'success' as const,
      trend: { value: 12.5, direction: 'up' as const, label: 'vs last month' }
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      icon: <PeopleIcon fontSize="small" />,
      color: 'primary' as const,
      trend: { value: 8.2, direction: 'up' as const, label: 'vs last month' }
    },
    {
      title: 'New Users',
      value: metrics.newUsers.toLocaleString(),
      icon: <PeopleIcon fontSize="small" />,
      color: 'info' as const,
      trend: { value: 15.3, direction: 'up' as const, label: 'vs last month' }
    },
    {
      title: 'Avg Revenue/User',
      value: formatCurrency(metrics.avgRevenuePerUser),
      icon: <PaymentIcon fontSize="small" />,
      color: 'secondary' as const,
      subtitle: 'ARPU'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: <PercentIcon fontSize="small" />,
      color: 'warning' as const,
      trend: { value: 2.1, direction: 'up' as const, label: 'vs last month' }
    },
    {
      title: 'Churn Rate',
      value: `${metrics.churnRate}%`,
      icon: <ChurnIcon fontSize="small" />,
      color: 'error' as const,
      trend: { value: 0.5, direction: 'down' as const, label: 'vs last month' }
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 2, sm: 3 },
      mb: 4
    }}>
      {metricItems.map((metric, index) => (
        <Box 
          key={index}
          sx={{ 
            flex: {
              xs: '1 1 calc(50% - 16px)',
              sm: '1 1 calc(33.333% - 24px)',
              md: '1 1 calc(16.666% - 25px)'
            },
            minWidth: {
              xs: 'calc(50% - 16px)',
              sm: 'calc(33.333% - 24px)',
              md: '200px'
            }
          }}
        >
          <ReportMetricCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
            subtitle={metric.subtitle}
            loading={loading}
          />
        </Box>
      ))}
    </Box>
  );
};