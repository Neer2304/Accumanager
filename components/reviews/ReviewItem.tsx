// components/reviews/ReviewItem.tsx
"use client";

import React from 'react';
import { Box, Typography, Rating, useTheme } from '@mui/material';
import { Verified, ThumbUp, Business, Person } from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { Review } from '@/types/reviews';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card hover sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, p: 3 }}>
        {/* User Info */}
        <Box sx={{ display: 'flex', gap: 2, minWidth: { xs: '100%', sm: 200 } }}>
          <Avatar
            size="lg"
            sx={{
              bgcolor: '#4285f4',
            }}
          >
            {review.userName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {review.userName || 'Anonymous User'}
            </Typography>
            {(review.userCompany || review.userRole) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                {review.userCompany ? (
                  <Business sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                ) : (
                  <Person sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                )}
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {review.userCompany || review.userRole || 'Customer'}
                </Typography>
              </Box>
            )}
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
              {formatDate(review.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Review Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
            <Rating 
              value={review.rating} 
              readOnly 
              size="small"
              sx={{
                '& .MuiRating-icon': {
                  color: '#fbbc04',
                }
              }}
            />
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {review.title}
            </Typography>
            {review.featured && (
              <Chip
                icon={<Verified sx={{ fontSize: 14 }} />}
                label="Featured"
                size="small"
                color="primary"
                variant="filled"
              />
            )}
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {review.comment}
          </Typography>

          {/* Review Stats */}
          {review.helpful > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<ThumbUp sx={{ fontSize: 14 }} />}
                label={`${review.helpful} people found this helpful`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};