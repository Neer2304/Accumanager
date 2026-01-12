import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Person,
  TrendingUp,
  AttachMoney,
  Public,
} from '@mui/icons-material';

interface CustomerStatsProps {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  interStateCustomers: number;
  customerUsage?: number;
  customerLimit?: number;
  customerUsagePercent?: number;
  remainingCustomers?: number;
  isMobile?: boolean;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({
  totalCustomers,
  activeCustomers,
  totalRevenue,
  interStateCustomers,
  customerUsage,
  customerLimit,
  customerUsagePercent,
  remainingCustomers,
  isMobile = false,
}) => {
  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Person,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Active Customers',
      value: activeCustomers,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: AttachMoney,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Inter-State',
      value: interStateCustomers,
      icon: Public,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Usage Stats */}
      {customerUsage !== undefined && customerLimit !== undefined && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Customer Usage
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customerUsage} / {customerLimit} used
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={customerUsagePercent || 0}
            color={customerUsagePercent && customerUsagePercent > 90 ? 'error' : customerUsagePercent && customerUsagePercent > 75 ? 'warning' : 'primary'}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title="Remaining customers you can add">
              <Typography variant="caption" color="text.secondary">
                {remainingCustomers || 0} remaining
              </Typography>
            </Tooltip>
            <Typography variant="caption" fontWeight="bold">
              {customerUsagePercent || 0}%
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {stats.map((stat, index) => (
          <Paper
            key={index}
            sx={{
              p: isMobile ? 2 : 3,
              background: stat.gradient,
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: 120,
            }}
          >
            <stat.icon sx={{ fontSize: isMobile ? 32 : 40, mb: 1 }} />
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {stat.title}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};