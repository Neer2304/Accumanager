// components/googleadvance/subscription-billing/BillingCyclesCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  alpha,
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Pending,
  Error,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface BillingCyclesCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const BillingCyclesCard: React.FC<BillingCyclesCardProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  // Mock data
  const cycles = [
    {
      period: 'Jan 15 - Feb 14, 2024',
      amount: 25000,
      status: 'active',
      progress: 50,
    },
    {
      period: 'Dec 15 - Jan 14, 2024',
      amount: 25000,
      status: 'completed',
      progress: 100,
    },
    {
      period: 'Nov 15 - Dec 14, 2023',
      amount: 25000,
      status: 'completed',
      progress: 100,
    },
    {
      period: 'Oct 15 - Nov 14, 2023',
      amount: 15000,
      status: 'completed',
      progress: 100,
    },
  ];

  const upcomingCycle = {
    period: 'Feb 15 - Mar 14, 2024',
    amount: 25000,
    daysLeft: 15,
  };

  return (
    <Box>
      {/* Upcoming Cycle */}
      <Card sx={{ background: currentColors.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Current Billing Cycle
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CalendarToday sx={{ color: primaryColor }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {cycles[0].period}
              </Typography>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Amount: ₹{cycles[0].amount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Cycle Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {cycles[0].progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={cycles[0].progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: currentColors.chipBackground,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: primaryColor,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Upcoming Cycle */}
      <Card sx={{ background: currentColors.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Upcoming Cycle
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarToday sx={{ color: googleColors.yellow }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {upcomingCycle.period}
              </Typography>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Amount: ₹{upcomingCycle.amount.toLocaleString()} • {upcomingCycle.daysLeft} days left
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Past Cycles */}
      <Card sx={{ background: currentColors.card }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Past Billing Cycles
          </Typography>
          <Grid container spacing={2}>
            {cycles.slice(1).map((cycle, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ 
                  p: 2, 
                  background: currentColors.surface,
                  border: `1px solid ${currentColors.border}`,
                  borderRadius: 2,
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {cycle.period}
                      </Typography>
                      <Typography variant="caption" color={currentColors.textSecondary}>
                        ₹{cycle.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<CheckCircle />}
                      label="Paid"
                      size="small"
                      sx={{
                        backgroundColor: alpha(googleColors.green, 0.1),
                        color: googleColors.green,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};