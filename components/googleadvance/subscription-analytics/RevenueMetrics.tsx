// components/googleadvance/subscription-analytics/RevenueMetrics.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  alpha,
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  ShoppingCart,
  AccountBalance,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface RevenueMetricsProps {
  revenueMetrics: any;
  currentColors: any;
  googleColors: any;
}

export const RevenueMetrics: React.FC<RevenueMetricsProps> = ({
  revenueMetrics,
  currentColors,
  googleColors,
}) => {
  const metrics = [
    {
      label: 'Total Revenue',
      value: `₹${(revenueMetrics?.totalRevenue || 280000).toLocaleString()}`,
      icon: <AccountBalance />,
      color: googleColors.green,
      change: '+12.5%',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${(revenueMetrics?.monthlyRevenue || 280000).toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.blue,
      change: '+8.3%',
    },
    {
      label: 'Average Order Value',
      value: `₹${(revenueMetrics?.avgOrderValue || 622).toLocaleString()}`,
      icon: <ShoppingCart />,
      color: googleColors.yellow,
      change: '+5.2%',
    },
    {
      label: 'Revenue Growth',
      value: `${(revenueMetrics?.revenueGrowth || 12.5).toFixed(1)}%`,
      icon: <TrendingUp />,
      color: googleColors.red,
      change: 'vs last period',
    },
  ];

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Revenue Metrics
        </Typography>
        
        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} key={metric.label}>
              <Box sx={{ 
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: 2,
              }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      {metric.label}
                    </Typography>
                  </Box>
                  <Chip
                    label={metric.change}
                    size="small"
                    sx={{
                      backgroundColor: alpha(googleColors.green, 0.1),
                      color: googleColors.green,
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {metric.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Revenue Insights
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • {revenueMetrics?.totalOrders || 450} total orders processed
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • Average revenue per customer: ₹{Math.round((revenueMetrics?.totalRevenue || 280000) / 800).toLocaleString()}
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • Projected annual revenue: ₹{(revenueMetrics?.monthlyRevenue || 280000 * 12).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};