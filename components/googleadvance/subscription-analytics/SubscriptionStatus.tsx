// components/googleadvance/subscription-analytics/SubscriptionStatus.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  alpha,
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  CalendarToday,
  Star,
  Autorenew,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface SubscriptionStatusProps {
  currentSubscription: any;
  subscriptionMetrics: any;
  currentColors: any;
  isMobile?: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  currentSubscription,
  subscriptionMetrics,
  currentColors,
  isMobile = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return googleColors.green;
      case 'trial': return googleColors.blue;
      case 'expired': return googleColors.red;
      case 'cancelled': return googleColors.yellow;
      default: return currentColors.textSecondary;
    }
  };

  const statusColor = getStatusColor(currentSubscription?.status || 'active');
  const progress = subscriptionMetrics?.daysRemaining 
    ? ((30 - subscriptionMetrics.daysRemaining) / 30) * 100 
    : 70;

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2,
                background: alpha(statusColor, 0.1),
                color: statusColor,
              }}>
                <Star />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {currentSubscription?.plan || 'Premium Plan'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={currentSubscription?.status || 'active'}
                    size="small"
                    sx={{
                      backgroundColor: alpha(statusColor, 0.1),
                      color: statusColor,
                      border: `1px solid ${alpha(statusColor, 0.3)}`,
                      fontWeight: 500,
                    }}
                  />
                  {currentSubscription?.autoRenew && (
                    <Chip
                      icon={<Autorenew />}
                      label="Auto-renew"
                      size="small"
                      sx={{
                        backgroundColor: alpha(googleColors.blue, 0.1),
                        color: googleColors.blue,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarToday sx={{ fontSize: 16, color: currentColors.textSecondary }} />
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Current Period Ends: {new Date(currentSubscription?.currentPeriodEnd || new Date()).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    Billing Cycle Progress
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {subscriptionMetrics?.daysRemaining || 15} days left
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: statusColor,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              background: currentColors.surface,
              border: `1px solid ${currentColors.border}`,
              borderRadius: 2,
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Subscription Metrics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color={currentColors.textSecondary} display="block">
                    MRR
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹{(subscriptionMetrics?.mrr || 25000).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" color={currentColors.textSecondary} display="block">
                    ARR
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹{(subscriptionMetrics?.arr || 300000).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" color={currentColors.textSecondary} display="block">
                    Total Paid
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹{(subscriptionMetrics?.totalPaid || 150000).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" color={currentColors.textSecondary} display="block">
                    Total Orders
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {subscriptionMetrics?.totalOrders || 450}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {currentSubscription?.features && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Plan Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {currentSubscription.features.map((feature: string, index: number) => (
                <Box key={index} display="flex" alignItems="center" gap={0.5}>
                  <CheckCircle sx={{ fontSize: 16, color: googleColors.green }} />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};