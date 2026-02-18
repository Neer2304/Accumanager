// components/googleadvance/subscription-analytics/RetentionMetrics.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Grid,
  alpha,
} from '@mui/material';
import {
  People,
  TrendingUp,
  AccessTime,
  Repeat,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface RetentionMetricsProps {
  retentionMetrics: any;
  currentColors: any;
  googleColors: any;
  alpha: any;
}

export const RetentionMetrics: React.FC<RetentionMetricsProps> = ({
  retentionMetrics,
  currentColors,
  googleColors,
  alpha,
}) => {
  const metrics = [
    {
      label: 'Retention Rate',
      value: retentionMetrics?.retentionRate || '85%',
      icon: <People />,
      color: googleColors.green,
      progress: parseInt(retentionMetrics?.retentionRate || '85'),
    },
    {
      label: 'Repeat Purchase Rate',
      value: retentionMetrics?.repeatPurchaseRate || '72%',
      icon: <Repeat />,
      color: googleColors.blue,
      progress: parseInt(retentionMetrics?.repeatPurchaseRate || '72'),
    },
    {
      label: 'Avg Days Between Orders',
      value: `${retentionMetrics?.avgDaysBetweenOrders || 45} days`,
      icon: <AccessTime />,
      color: googleColors.yellow,
      progress: 45,
    },
    {
      label: 'Churn Probability',
      value: `${retentionMetrics?.churnProbability || 15}%`,
      icon: <TrendingUp />,
      color: retentionMetrics?.churnRisk === 'high' 
        ? googleColors.red 
        : retentionMetrics?.churnRisk === 'medium'
        ? googleColors.yellow
        : googleColors.green,
      progress: retentionMetrics?.churnProbability || 15,
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
          Retention Metrics
        </Typography>
        
        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid item xs={12} key={metric.label}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                  <Typography variant="body2" color={currentColors.textSecondary}>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: metric.color }}>
                  {metric.value}
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={metric.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: currentColors.chipBackground,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          background: alpha(retentionMetrics?.churnRisk === 'high' 
            ? googleColors.red 
            : retentionMetrics?.churnRisk === 'medium'
            ? googleColors.yellow
            : googleColors.green, 0.1),
          border: `1px solid ${alpha(retentionMetrics?.churnRisk === 'high' 
            ? googleColors.red 
            : retentionMetrics?.churnRisk === 'medium'
            ? googleColors.yellow
            : googleColors.green, 0.3)}`,
          borderRadius: 2,
        }}>
          <Typography variant="subtitle2" gutterBottom>
            Churn Risk Assessment
          </Typography>
          <Typography variant="body2" color={currentColors.textSecondary}>
            Current churn risk is <strong style={{ color: retentionMetrics?.churnRisk === 'high' ? googleColors.red : retentionMetrics?.churnRisk === 'medium' ? googleColors.yellow : googleColors.green }}>
              {retentionMetrics?.churnRisk || 'low'}
            </strong>. Customer lifetime value is approximately {retentionMetrics?.customerLifetime || 18} months.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};