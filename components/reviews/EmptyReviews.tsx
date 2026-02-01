"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Button2 } from '../ui/button2';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';

interface EmptyReviewsProps {
  searchTerm: string;
  onWriteReview: () => void;
}

export const EmptyReviews: React.FC<EmptyReviewsProps> = ({
  searchTerm,
  onWriteReview,
}) => {
  return (
    <Card2 sx={{ p: 6, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        No reviews found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {searchTerm ? 'Try a different search term' : 'Be the first to share your experience!'}
      </Typography>
      <Button2
        variant="contained"
        onClick={onWriteReview}
        iconLeft={<CombinedIcon name="Add" size={16} />}
      >
        Write the First Review
      </Button2>
    </Card2>
  );
};