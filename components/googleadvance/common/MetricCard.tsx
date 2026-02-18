// components/googleadvance/common/MetricCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { MetricCardProps } from '../types';
import { googleColors } from './GoogleColors';

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  trendValue,
  currentColors,
  isMobile = false,
}) => {
  const cardColor = color || googleColors.blue;

  return (
    <Card
      sx={{
        flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 12px)',
        minWidth: isMobile ? '100%' : '250px',
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography 
            variant="body2" 
            color={currentColors.textSecondary}
            fontSize={isMobile ? '0.875rem' : '1rem'}
          >
            {title}
          </Typography>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: 2,
            background: alpha(cardColor, 0.1),
            color: cardColor
          }}>
            {icon}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography 
            variant="h5" 
            fontWeight="bold"
            fontSize={isMobile ? '1.25rem' : '1.5rem'}
          >
            {value}
          </Typography>
          {trend && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: trend === 'up' 
                ? googleColors.green 
                : trend === 'down'
                ? googleColors.red
                : googleColors.yellow
            }}>
              {trend === 'up' ? <TrendingUp /> : 
               trend === 'down' ? <TrendingDown /> : 
               <TrendingFlat />}
              {trendValue && (
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {trendValue > 0 ? `+${trendValue}%` : `${trendValue}%`}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {subtitle && (
          <Typography 
            variant="caption" 
            color={currentColors.textSecondary}
            fontSize={isMobile ? '0.75rem' : '0.875rem'}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};