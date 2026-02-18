// components/googleadvance/common/StatsCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import { StatsCardProps } from '../types';
import { googleColors } from './GoogleColors';

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  status,
  color,
  currentColors,
  isMobile = false,
}) => {
  const cardColor = color || googleColors.blue;

  return (
    <Card
      sx={{
        flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
        minWidth: isMobile ? '100%' : '200px',
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Typography 
          color={currentColors.textSecondary} 
          variant="body2"
          fontSize={isMobile ? '0.75rem' : '0.875rem'}
          gutterBottom
        >
          {label}
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography 
            variant="h5" 
            fontWeight="bold"
            fontSize={isMobile ? '1.25rem' : '1.5rem'}
          >
            {value}
          </Typography>
          <Box sx={{ 
            color: cardColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </Box>
        </Box>
        
        {status && (
          <Typography 
            variant="caption" 
            sx={{ color: cardColor, mt: 1, display: 'block' }}
            fontSize={isMobile ? '0.75rem' : '0.875rem'}
          >
            {status}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};