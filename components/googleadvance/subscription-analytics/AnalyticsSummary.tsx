// components/googleadvance/subscription-analytics/AnalyticsSummary.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Chip,
  alpha,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Warning,
  CheckCircle,
  Lightbulb,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface AnalyticsSummaryProps {
  revenueMetrics: any;
  customerMetrics: any;
  retentionMetrics: any;
  currentColors: any;
  primaryColor: string;
  googleColors: any;
  alpha: any;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  revenueMetrics,
  customerMetrics,
  retentionMetrics,
  currentColors,
  primaryColor,
  googleColors,
  alpha,
}) => {
  const summaryItems = [
    {
      title: 'Revenue Health',
      icon: <AttachMoney />,
      color: googleColors.green,
      items: [
        { label: 'Total Revenue', value: `₹${(revenueMetrics?.totalRevenue || 280000).toLocaleString()}` },
        { label: 'Monthly Avg', value: `₹${(revenueMetrics?.monthlyRevenue || 280000).toLocaleString()}` },
        { label: 'Growth Rate', value: `${(revenueMetrics?.revenueGrowth || 12.5).toFixed(1)}%` },
      ],
    },
    {
      title: 'Customer Health',
      icon: <People />,
      color: googleColors.blue,
      items: [
        { label: 'Total Customers', value: customerMetrics?.totalCustomers || 800 },
        { label: 'Active', value: customerMetrics?.activeCustomers || 720 },
        { label: 'New (30d)', value: customerMetrics?.newCustomers || 120 },
      ],
    },
    {
      title: 'Retention Health',
      icon: <TrendingUp />,
      color: retentionMetrics?.churnRisk === 'high' ? googleColors.red : googleColors.yellow,
      items: [
        { label: 'Retention Rate', value: retentionMetrics?.retentionRate || '85%' },
        { label: 'Repeat Rate', value: retentionMetrics?.repeatPurchaseRate || '72%' },
        { label: 'Churn Risk', value: retentionMetrics?.churnRisk || 'low' },
      ],
    },
  ];

  const recommendations = [
    'Increase engagement with inactive customers',
    'Optimize pricing for premium segment',
    'Launch referral program to reduce acquisition cost',
    'Improve onboarding for new customers',
  ];

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Analytics Summary
        </Typography>

        <Grid container spacing={3}>
          {summaryItems.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box sx={{ 
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: 2,
              }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box sx={{ color: item.color }}>{item.icon}</Box>
                  <Typography variant="subtitle2">{item.title}</Typography>
                </Box>
                
                {item.items.map((metric, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      {metric.label}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {metric.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3, borderColor: currentColors.border }} />

        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Lightbulb sx={{ color: googleColors.yellow }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Key Recommendations
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {recommendations.map((rec, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle sx={{ color: googleColors.green, fontSize: 16 }} />
                  <Typography variant="body2">{rec}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          background: alpha(googleColors.blue, 0.1),
          border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
          borderRadius: 2,
        }}>
          <Typography variant="subtitle2" gutterBottom color={googleColors.blue}>
            Overall Business Health
          </Typography>
          <Typography variant="body2" color={currentColors.textSecondary}>
            Your business is performing well with strong revenue growth and healthy retention rates. 
            Focus on converting new customers and reducing churn risk to maintain momentum.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};