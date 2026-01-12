import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { ReviewIcon } from '@/components/reviews/ReviewsIcons';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
}

export const RatingInput = ({ 
  value, 
  onChange, 
  label = 'Overall Rating *', 
  required = true 
}: RatingInputProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <Rating
          value={value}
          onChange={(event, newValue) => {
            onChange(newValue || 0);
          }}
          size="large"
          icon={<ReviewIcon name="Star" />}
          emptyIcon={<ReviewIcon name="Star" />}
        />
        <Typography variant="body2" color="text.secondary">
          {value > 0 ? `${value} star${value !== 1 ? 's' : ''}` : 'Select rating'}
        </Typography>
      </Box>
    </Box>
  );
};