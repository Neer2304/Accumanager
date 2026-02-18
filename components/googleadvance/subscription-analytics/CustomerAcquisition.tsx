// components/googleadvance/subscription-analytics/CustomerAcquisition.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  alpha,
} from '@mui/material';
import {
  People,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface CustomerAcquisitionProps {
  customerMetrics: any;
  currentColors: any;
  googleColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const CustomerAcquisition: React.FC<CustomerAcquisitionProps> = ({
  customerMetrics,
  currentColors,
  googleColors,
  primaryColor,
  isMobile = false,
}) => {
  const acquisitionRate = customerMetrics?.newCustomers 
    ? (customerMetrics.newCustomers / customerMetrics.totalCustomers) * 100 
    : 15;

  const churnRate = 100 - parseInt(customerMetrics?.retentionRate || '85');

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Customer Acquisition & Churn
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Total Customers */}
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2,
                background: alpha(primaryColor, 0.1),
                color: primaryColor,
              }}>
                <People />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {customerMetrics?.totalCustomers || 800}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Total Customers
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* New vs Active */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonAdd sx={{ color: googleColors.green }} />
                <Typography variant="body2">New Customers</Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" color={googleColors.green}>
                +{customerMetrics?.newCustomers || 120}
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                This month
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonRemove sx={{ color: googleColors.red }} />
                <Typography variant="body2">Churned</Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" color={googleColors.red}>
                -{Math.round((customerMetrics?.totalCustomers || 800) * (churnRate / 100)) || 24}
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                This month ({churnRate}% rate)
              </Typography>
            </Box>
          </Box>

          {/* Acquisition Rate */}
          <Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Acquisition Rate</Typography>
              <Typography variant="body2" fontWeight="bold" color={googleColors.green}>
                {acquisitionRate.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={acquisitionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: currentColors.chipBackground,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: googleColors.green,
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Active vs Total */}
          <Box sx={{ 
            p: 2, 
            background: currentColors.surface,
            border: `1px solid ${currentColors.border}`,
            borderRadius: 2,
          }}>
            <Typography variant="subtitle2" gutterBottom>
              Customer Health
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Active Customers
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {customerMetrics?.activeCustomers || 720}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Engagement Rate
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={googleColors.green}>
                  {Math.round(((customerMetrics?.activeCustomers || 720) / (customerMetrics?.totalCustomers || 800)) * 100)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};