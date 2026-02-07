// components/reviews/ReviewCTA.tsx
"use client";

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { RateReview } from '@mui/icons-material';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ReviewCTAProps {
  isAuthenticated: boolean;
  onWriteReview: () => void;
}

export const ReviewCTA: React.FC<ReviewCTAProps> = ({
  isAuthenticated,
  onWriteReview,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      hover
      sx={{ 
        p: { xs: 3, sm: 4, md: 6 }, 
        mt: { xs: 4, sm: 6, md: 8 },
        borderRadius: '16px',
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        border: 'none',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <RateReview sx={{ 
          fontSize: 60, 
          mb: 2,
          color: 'white',
          opacity: 0.9,
        }} />
        <Typography 
          variant="h4" 
          fontWeight={600} 
          gutterBottom 
          sx={{ 
            color: 'white',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Share Your Experience
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            opacity: 0.95,
            color: 'white',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Your feedback helps us improve and helps other businesses make informed decisions
        </Typography>
        <Button
          variant="contained"
          onClick={onWriteReview}
          size="large"
          iconLeft={<RateReview />}
          sx={{ 
            backgroundColor: 'white',
            color: darkMode ? '#0d3064' : '#4285f4',
            fontWeight: 600,
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: darkMode ? '#f5f5f5' : '#e8f0fe',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255,255,255,0.2)',
            },
          }}
        >
          {isAuthenticated ? 'Write a Review' : 'Sign in to Write Review'}
        </Button>
        {!isAuthenticated && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              opacity: 0.9,
              color: 'white',
            }}
          >
            You need to be signed in to submit a review
          </Typography>
        )}
      </Box>
    </Card>
  );
};