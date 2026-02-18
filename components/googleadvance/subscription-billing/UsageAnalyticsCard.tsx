// components/googleadvance/subscription-billing/UsageAnalyticsCard.tsx

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
  Storage,
  People,
  Assessment,
  Speed,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface UsageAnalyticsCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const UsageAnalyticsCard: React.FC<UsageAnalyticsCardProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  // Mock data
  const usage = {
    storage: {
      used: 45,
      total: 100,
      unit: 'GB',
    },
    apiCalls: {
      used: 12500,
      total: 50000,
      unit: 'calls',
    },
    users: {
      used: 8,
      total: 10,
      unit: 'users',
    },
    bandwidth: {
      used: 256,
      total: 500,
      unit: 'GB',
    },
  };

  const features = [
    { name: 'Advanced Analytics', used: true },
    { name: 'Priority Support', used: true },
    { name: 'Custom Reports', used: true },
    { name: 'API Access', used: true },
    { name: 'White Labeling', used: false },
    { name: 'Dedicated Server', used: false },
  ];

  return (
    <Box>
      {/* Usage Metrics */}
      <Card sx={{ background: currentColors.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Resource Usage
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Storage sx={{ color: googleColors.blue }} />
                  <Typography variant="body2">Storage</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {usage.storage.used} / {usage.storage.total} {usage.storage.unit}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {Math.round((usage.storage.used / usage.storage.total) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.storage.used / usage.storage.total) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.blue,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Speed sx={{ color: googleColors.green }} />
                  <Typography variant="body2">API Calls</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {usage.apiCalls.used.toLocaleString()} / {usage.apiCalls.total.toLocaleString()} {usage.apiCalls.unit}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {Math.round((usage.apiCalls.used / usage.apiCalls.total) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.apiCalls.used / usage.apiCalls.total) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.green,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <People sx={{ color: googleColors.yellow }} />
                  <Typography variant="body2">Team Members</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {usage.users.used} / {usage.users.total} {usage.users.unit}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {Math.round((usage.users.used / usage.users.total) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.users.used / usage.users.total) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.yellow,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Assessment sx={{ color: googleColors.red }} />
                  <Typography variant="body2">Bandwidth</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {usage.bandwidth.used} / {usage.bandwidth.total} {usage.bandwidth.unit}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {Math.round((usage.bandwidth.used / usage.bandwidth.total) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.bandwidth.used / usage.bandwidth.total) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: googleColors.red,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Features Usage */}
      <Card sx={{ background: currentColors.card }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Plan Features
          </Typography>
          <Grid container spacing={2}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ 
                  p: 1.5, 
                  background: feature.used ? alpha(googleColors.green, 0.1) : 'transparent',
                  border: `1px solid ${feature.used ? alpha(googleColors.green, 0.3) : currentColors.border}`,
                  borderRadius: 2,
                }}>
                  <Typography variant="body2">
                    {feature.name}
                  </Typography>
                  <Chip
                    label={feature.used ? 'Active' : 'Not Included'}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: feature.used 
                        ? alpha(googleColors.green, 0.1)
                        : alpha(currentColors.textSecondary, 0.1),
                      color: feature.used ? googleColors.green : currentColors.textSecondary,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};