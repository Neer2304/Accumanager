// components/googleadvance/subscription-analytics/SubscriptionMetrics.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  alpha,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  CalendarToday,
  ShoppingCart,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface SubscriptionMetricsProps {
  subscriptionMetrics: any;
  currentColors: any;
}

export const SubscriptionMetrics: React.FC<SubscriptionMetricsProps> = ({
  subscriptionMetrics,
  currentColors,
}) => {
  const metrics = [
    {
      label: 'Monthly Recurring Revenue',
      value: `₹${(subscriptionMetrics?.mrr || 25000).toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.blue,
      subtext: 'MRR',
    },
    {
      label: 'Annual Recurring Revenue',
      value: `₹${(subscriptionMetrics?.arr || 300000).toLocaleString()}`,
      icon: <TrendingUp />,
      color: googleColors.green,
      subtext: 'ARR',
    },
    {
      label: 'Total Paid to Date',
      value: `₹${(subscriptionMetrics?.totalPaid || 150000).toLocaleString()}`,
      icon: <AttachMoney />,
      color: googleColors.yellow,
      subtext: 'Lifetime',
    },
    {
      label: 'Monthly Average',
      value: `₹${(subscriptionMetrics?.monthlyAmount || 25000).toLocaleString()}`,
      icon: <CalendarToday />,
      color: googleColors.red,
      subtext: 'per month',
    },
    {
      label: 'Total Orders',
      value: subscriptionMetrics?.totalOrders || 450,
      icon: <ShoppingCart />,
      color: googleColors.blue,
      subtext: 'all time',
    },
    {
      label: 'Days Remaining',
      value: subscriptionMetrics?.daysRemaining || 15,
      icon: <CalendarToday />,
      color: subscriptionMetrics?.daysRemaining < 7 ? googleColors.red : googleColors.green,
      subtext: 'in current cycle',
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
          Subscription Metrics
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
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {metric.value}
                </Typography>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  {metric.subtext}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {subscriptionMetrics?.isTrial && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            background: alpha(googleColors.blue, 0.1),
            border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
            borderRadius: 2,
          }}>
            <Typography variant="subtitle2" color={googleColors.blue} gutterBottom>
              Trial Mode Active
            </Typography>
            <Typography variant="body2" color={currentColors.textSecondary}>
              {subscriptionMetrics.trialDaysRemaining} days remaining in trial period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};