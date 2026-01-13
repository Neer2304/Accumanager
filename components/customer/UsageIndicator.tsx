import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';

interface UsageIndicatorProps {
  usage: number;
  limit: number;
  label?: string;
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  usage, 
  limit, 
  label = 'Customer Usage' 
}) => {
  const percentage = limit > 0 ? Math.round((usage / limit) * 100) : 0;
  
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {usage} of {limit} customers used
            </Typography>
          </Box>
          <Box sx={{ minWidth: 200, flex: 1, maxWidth: 300 }}>
            <LinearProgress 
              variant="determinate" 
              value={percentage} 
              color={percentage > 90 ? 'error' : percentage > 75 ? 'warning' : 'primary'}
              sx={{ 
                height: 8,
                borderRadius: 4,
                mb: 1
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                {limit - usage} remaining
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {percentage}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};