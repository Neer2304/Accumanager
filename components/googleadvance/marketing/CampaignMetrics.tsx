// components/googleadvance/marketing/CampaignMetrics.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface CampaignMetricsProps {
  campaigns: any[];
  analytics: any;
  currentColors: any;
  isMobile?: boolean;
}

export const CampaignMetrics: React.FC<CampaignMetricsProps> = ({
  campaigns,
  analytics,
  currentColors,
  isMobile = false,
}) => {
  const metrics = [
    {
      label: 'Open Rate',
      value: analytics?.averageOpenRate?.toFixed(1) || 0,
      target: 25,
      icon: <TrendingUp />,
      color: googleColors.blue,
    },
    {
      label: 'Click Rate',
      value: analytics?.averageClickRate?.toFixed(1) || 0,
      target: 15,
      icon: <TrendingUp />,
      color: googleColors.green,
    },
    {
      label: 'Conversion Rate',
      value: analytics?.averageConversionRate?.toFixed(1) || 0,
      target: 10,
      icon: <People />,
      color: googleColors.yellow,
    },
    {
      label: 'Revenue per Campaign',
      value: analytics?.totalRevenue 
        ? `₹${Math.round(analytics.totalRevenue / (analytics.totalCampaigns || 1)).toLocaleString()}`
        : '₹0',
      target: 50000,
      icon: <AttachMoney />,
      color: googleColors.red,
    },
  ];

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Campaign Performance Metrics
        </Typography>
        
        <Grid container spacing={3}>
          {metrics.map((metric, index) => {
            const numericValue = typeof metric.value === 'string' 
              ? parseInt(metric.value.replace(/[^0-9]/g, '')) 
              : metric.value;
            const progress = (numericValue / metric.target) * 100;
            const isAboveTarget = numericValue >= metric.target;
            
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                      <Typography variant="body2" color={currentColors.textSecondary}>
                        {metric.label}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="bold">
                        {metric.value}%
                      </Typography>
                      {isAboveTarget ? (
                        <TrendingUp sx={{ color: googleColors.green, fontSize: 16 }} />
                      ) : (
                        <TrendingDown sx={{ color: googleColors.red, fontSize: 16 }} />
                      )}
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: currentColors.chipBackground,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isAboveTarget ? googleColors.green : googleColors.yellow,
                        borderRadius: 4,
                      },
                    }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Current: {metric.value}%
                    </Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Target: {metric.target}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};