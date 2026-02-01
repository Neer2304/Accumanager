"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Button2 } from '../ui/button2';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';

interface ReviewCTAProps {
  isAuthenticated: boolean;
  onWriteReview: () => void;
}

export const ReviewCTA: React.FC<ReviewCTAProps> = ({
  isAuthenticated,
  onWriteReview,
}) => {
  return (
    <Card2 sx={{ 
      p: { xs: 4, sm: 6 }, 
      mt: 6, 
      borderRadius: 2,
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      textAlign: 'center'
    }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
        Share Your Experience
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }} color="white">
        Your feedback helps us improve and helps other businesses make decisions
      </Typography>
      <Button2
        variant="contained"
        onClick={onWriteReview}
        size="large"
        iconLeft={<CombinedIcon name="Add" size={20} />}
        sx={{ 
          backgroundColor: 'white',
          color: 'primary.main',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: 'grey.100'
          }
        }}
      >
        {isAuthenticated ? 'Write a Review' : 'Sign in to Review'}
      </Button2>
      {!isAuthenticated && (
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }} color="white">
          You need to be signed in to submit a review
        </Typography>
      )}
    </Card2>
  );
};