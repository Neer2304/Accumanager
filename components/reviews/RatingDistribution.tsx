// components/reviews/RatingDistribution.tsx
"use client";

import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { Star } from '@mui/icons-material';
import { LinearProgress } from '@/components/ui/Progress';

interface RatingDistributionProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getProgressColor = (rating: number) => {
    const colors = {
      5: '#34a853',
      4: '#8ab4f8',
      3: '#4285f4',
      2: '#fbbc04',
      1: '#ea4335',
    };
    return colors[rating as keyof typeof colors];
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star as keyof typeof distribution];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        const progressColor = getProgressColor(star);

        return (
          <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 100 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', width: 20 }}>
                {star}
              </Typography>
              <Star sx={{ color: '#fbbc04', fontSize: 16 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                value={percentage}
                color="primary"
                sx={{
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: progressColor,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 80 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {percentage.toFixed(1)}%
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', minWidth: 30, textAlign: 'right' }}>
                {count}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};