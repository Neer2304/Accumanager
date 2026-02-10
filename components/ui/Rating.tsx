import React from 'react';
import { Rating as MuiRating, RatingProps as MuiRatingProps } from '@mui/material';

export const Rating: React.FC<MuiRatingProps> = (props) => {
  return <MuiRating {...props} />;
};