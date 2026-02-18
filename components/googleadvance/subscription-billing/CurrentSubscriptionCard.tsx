// components/googleadvance/subscription-billing/CurrentSubscriptionCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Button,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  CalendarToday,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface CurrentSubscriptionCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const CurrentSubscriptionCard: React.FC<CurrentSubscriptionCardProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  // Mock data
  const subscription = {
    plan: 'Premium Plan',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    features: ['Advanced Analytics', 'Priority Support', 'Custom Reports', 'API Access'],
  };

  const daysRemaining = 30;
  const progress = (30 - daysRemaining) / 30 * 100;

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Current Subscription
            </Typography>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Manage your plan and billing
            </Typography>
          </Box>
          <Chip
            label={subscription.status}
            size="small"
            sx={{
              backgroundColor: alpha(googleColors.green, 0.1),
              color: googleColors.green,
              border: `1px solid ${alpha(googleColors.green, 0.3)}`,
              fontWeight: 500,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {subscription.plan}
            </Typography>
            <Typography variant="body2" color={currentColors.textSecondary}>
              ₹25,000/month
            </Typography>
          </Box>

          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarToday sx={{ fontSize: 16, color: currentColors.textSecondary }} />
              <Typography variant="body2" color={currentColors.textSecondary}>
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ width: 200 }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Billing cycle
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {daysRemaining} days left
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
                    backgroundColor: primaryColor,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Plan Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {subscription.features.map((feature, index) => (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                <CheckCircle sx={{ fontSize: 16, color: googleColors.green }} />
                <Typography variant="body2">{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            disabled
            sx={{
              background: primaryColor,
              color: 'white',
              '&.Mui-disabled': {
                background: primaryColor,
                color: 'white',
                opacity: 0.5,
              }
            }}
          >
            Upgrade Plan
          </Button>
          <Button
            variant="outlined"
            disabled
            sx={{
              border: `1px solid ${currentColors.border}`,
              color: currentColors.textPrimary,
            }}
          >
            Manage Payment Methods
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};