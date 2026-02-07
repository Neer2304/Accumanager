// components/reviews/ReviewStats.tsx
"use client";

import React from 'react';
import { Box, Typography, Rating, useTheme, alpha } from '@mui/material';
import { Star } from '@mui/icons-material';
import { Card } from '@/components/ui/Card';

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({
  averageRating,
  totalReviews,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 3,
      mb: 4,
      justifyContent: 'center'
    }}>
      <Card 
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          minWidth: 140,
          textAlign: 'center',
          border: `1px solid ${alpha('#4285f4', 0.2)}`,
          background: darkMode 
            ? `linear-gradient(135deg, ${alpha('#4285f4', 0.1)} 0%, ${alpha('#4285f4', 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha('#4285f4', 0.08)} 0%, ${alpha('#4285f4', 0.03)} 100%)`,
        }}
      >
        <Typography variant="h2" fontWeight={600} color="#4285f4">
          {averageRating.toFixed(1)}
        </Typography>
        <Rating 
          value={averageRating} 
          readOnly 
          precision={0.1} 
          size="medium"
          sx={{ 
            mb: 1,
            '& .MuiRating-icon': {
              color: '#fbbc04',
            }
          }} 
        />
        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Average Rating
        </Typography>
      </Card>
      
      <Card 
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          minWidth: 140,
          textAlign: 'center',
          border: `1px solid ${alpha('#34a853', 0.2)}`,
          background: darkMode 
            ? `linear-gradient(135deg, ${alpha('#34a853', 0.1)} 0%, ${alpha('#34a853', 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha('#34a853', 0.08)} 0%, ${alpha('#34a853', 0.03)} 100%)`,
        }}
      >
        <Typography variant="h2" fontWeight={600} color="#34a853">
          {totalReviews.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 0.5 }}>
          <Star sx={{ color: '#fbbc04', fontSize: 20 }} />
          <Typography variant="body1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
            Total Reviews
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Customer Feedback
        </Typography>
      </Card>
    </Box>
  );
};