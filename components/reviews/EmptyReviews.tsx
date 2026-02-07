// components/reviews/EmptyReviews.tsx
"use client";

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { RateReview, SearchOff } from '@mui/icons-material';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EmptyReviewsProps {
  searchTerm: string;
  onWriteReview: () => void;
}

export const EmptyReviews: React.FC<EmptyReviewsProps> = ({
  searchTerm,
  onWriteReview,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      hover
      sx={{ 
        p: { xs: 4, sm: 6 }, 
        textAlign: 'center',
        border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      }}
    >
      {searchTerm ? (
        <>
          <SearchOff sx={{ 
            fontSize: 60, 
            mb: 2,
            color: darkMode ? '#5f6368' : '#9aa0a6',
          }} />
          <Typography 
            variant="h5" 
            fontWeight={500}
            gutterBottom
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            No reviews found
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            Try a different search term or browse all reviews
          </Typography>
        </>
      ) : (
        <>
          <RateReview sx={{ 
            fontSize: 60, 
            mb: 2,
            color: '#4285f4',
          }} />
          <Typography 
            variant="h5" 
            fontWeight={500}
            gutterBottom
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Be the first to share your experience!
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            Your review will help other businesses make better decisions
          </Typography>
          <Button
            variant="contained"
            onClick={onWriteReview}
            iconLeft={<RateReview />}
            size="medium"
          >
            Write the First Review
          </Button>
        </>
      )}
    </Card>
  );
};