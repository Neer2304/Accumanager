"use client";

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Rating } from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({
  averageRating,
  totalReviews,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 3,
      mb: 4,
      justifyContent: 'center'
    }}>
      <Card2 sx={{ p: 3, borderRadius: 2, minWidth: 120, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight="bold" color="primary.main">
          {averageRating.toFixed(1)}
        </Typography>
        <Rating value={averageRating} readOnly precision={0.1} size="small" />
        <Typography variant="body2" color="text.secondary">
          Average Rating
        </Typography>
      </Card2>
      
      <Card2 sx={{ p: 3, borderRadius: 2, minWidth: 120, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight="bold" color="secondary.main">
          {totalReviews}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Reviews
        </Typography>
      </Card2>
    </Box>
  );
};