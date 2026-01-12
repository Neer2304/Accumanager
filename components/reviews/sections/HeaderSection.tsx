import React from 'react';
import { Paper, Typography } from '@mui/material';
import { ReviewIcon } from '../ReviewsIcons';
import { REVIEWS_CONTENT } from '../ReviewsContent';

export const HeaderSection = () => {
  const { header } = REVIEWS_CONTENT;

  return (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        textAlign: 'center',
        background: header.gradient,
        color: 'white',
        borderRadius: 3,
      }}
    >
      <ReviewIcon name="Star" size="extraLarge" sx={{ mb: 2 }} />
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        {header.title}
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9 }}>
        {header.subtitle}
      </Typography>
    </Paper>
  );
};