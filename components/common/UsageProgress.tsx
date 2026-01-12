import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface UsageProgressProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export const UsageProgress = ({ label, current, limit, unit = '' }: UsageProgressProps) => {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {current} / {limit} {unit}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={percentage}
        color={
          percentage > 90 ? 'error' :
          percentage > 75 ? 'warning' : 'primary'
        }
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {Math.round(percentage)}% used
      </Typography>
    </Box>
  );
};