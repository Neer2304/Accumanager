// components/googleadvance/subscription-analytics/RevenueTrend.tsx

'use client';

import React from 'react';
import {
  Box,
  Typography,
  alpha,
} from '@mui/material';
import { Timeline } from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface RevenueTrendProps {
  monthlyTrend: any[];
  totalRevenue: number;
  currentColors: any;
  isMobile?: boolean;
}

export const RevenueTrend: React.FC<RevenueTrendProps> = ({
  monthlyTrend,
  totalRevenue,
  currentColors,
  isMobile = false,
}) => {
  return (
    <Box>
      <Box sx={{ height: isMobile ? 200 : 250 }}>
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: currentColors.surface,
          borderRadius: 2,
          p: 3,
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Timeline sx={{ 
              fontSize: 48, 
              color: googleColors.blue, 
              mb: 2 
            }} />
            <Typography variant="body1" color={currentColors.textSecondary}>
              Revenue trend chart would appear here
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              Last {monthlyTrend.length} months total: ₹{totalRevenue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};