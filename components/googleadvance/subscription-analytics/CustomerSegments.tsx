// components/googleadvance/subscription-analytics/CustomerSegments.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  alpha,
} from '@mui/material';
import { googleColors } from '../common/GoogleColors';

interface CustomerSegmentsProps {
  customerSegments: Array<{ segment: string; count: number; value: number }>;
  currentColors: any;
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({
  customerSegments,
  currentColors,
}) => {
  const totalCustomers = customerSegments.reduce((sum, s) => sum + s.count, 0);
  const totalValue = customerSegments.reduce((sum, s) => sum + s.value, 0);

  const segmentColors = {
    Premium: googleColors.green,
    Regular: googleColors.blue,
    New: googleColors.yellow,
  };

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Customer Segments
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {customerSegments.map((segment) => {
            const percentage = (segment.count / totalCustomers) * 100;
            const valuePercentage = (segment.value / totalValue) * 100;
            const color = segmentColors[segment.segment as keyof typeof segmentColors] || googleColors.blue;

            return (
              <Box key={segment.segment}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" fontWeight="500">
                    {segment.segment}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {segment.count} customers
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: color,
                      borderRadius: 4,
                    },
                  }}
                />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {percentage.toFixed(1)}% of customers
                  </Typography>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    ₹{segment.value.toLocaleString()} ({valuePercentage.toFixed(1)}% of value)
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ 
          mt: 3, 
          pt: 3, 
          borderTop: `1px solid ${currentColors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Box>
            <Typography variant="caption" color={currentColors.textSecondary} display="block">
              Total Customers
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalCustomers}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color={currentColors.textSecondary} display="block">
              Total Value
            </Typography>
            <Typography variant="h6" fontWeight="bold" color={googleColors.green}>
              ₹{totalValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};