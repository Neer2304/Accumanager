// components/googleadvance/common/UnderDevelopmentBanner.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
} from '@mui/material';
import { Construction } from '@mui/icons-material';
import { UnderDevelopmentBannerProps } from '../types';
import { googleColors } from './GoogleColors';

export const UnderDevelopmentBanner: React.FC<UnderDevelopmentBannerProps> = ({
  currentColors,
  isMobile = false,
  message = "This page and all its features are currently under development. Some features may not be available yet. We're working hard to bring you an amazing experience!",
  mode = 'light',
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.15)} 0%, ${alpha(googleColors.yellow, 0.05)} 100%)`,
        border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
        borderRadius: '16px',
        backgroundColor: currentColors.card,
        transition: 'all 0.3s ease',
        boxShadow: mode === 'dark' 
          ? '0 2px 4px rgba(0,0,0,0.4)' 
          : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.2)} 0%, ${alpha(googleColors.yellow, 0.1)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
            }}
          >
            <Construction sx={{ fontSize: 28, color: googleColors.yellow }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} color={googleColors.yellow} gutterBottom>
              🚧 Under Development
            </Typography>
            <Typography variant="body1" color={currentColors.textSecondary}>
              {message}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};