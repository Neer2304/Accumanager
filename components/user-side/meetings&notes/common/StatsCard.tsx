// app/components/user-side/meetings&notes/common/StatsCard.tsx
"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { GlassCard } from './GlassCard';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  icon,
  color = 'primary',
  trend 
}: StatsCardProps) {
  return (
    <GlassCard>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {title}
            </Typography>
          </Box>
          
          {icon && (
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </Box>
          )}
        </Box>
        
        {trend && (
          <Typography 
            variant="caption" 
            color={trend.isPositive ? 'success.main' : 'error.main'}
            sx={{ display: 'block', mt: 1 }}
          >
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}% from last month
          </Typography>
        )}
      </Box>
    </GlassCard>
  );
}