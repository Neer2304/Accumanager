"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';

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
  return (
    <Card2 sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Rating Distribution
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star as keyof typeof distribution]
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
          
          return (
            <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 100 }}>
                <Typography variant="body1">{star}</Typography>
                <CombinedIcon name="Star" size={16} sx={{ color: '#fbbf24' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: 'grey.200',
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${percentage}%`,
                      backgroundColor: 'primary.main',
                      borderRadius: 4
                    }} 
                  />
                </Box>
              </Box>
              <Typography variant="body1" sx={{ width: 40, textAlign: 'right' }}>
                {count}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Card2>
  );
};