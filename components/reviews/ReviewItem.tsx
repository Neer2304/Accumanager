"use client";

import React from 'react';
import { Box, Typography, Avatar, Chip, Rating } from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';
import { Review } from '@/types/reviews';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card2 sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
        {/* User Info */}
        <Box sx={{ display: 'flex', gap: 2, minWidth: 200 }}>
          <Avatar
            sx={{ 
              width: 56, 
              height: 56,
              bgcolor: 'primary.main'
            }}
          >
            {review.userName?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {review.userCompany || review.userRole || 'Customer'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Review Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="h5" fontWeight="bold">
              {review.title}
            </Typography>
            {review.featured && (
              <Chip
                icon={<CombinedIcon name="Verified" size={14} />}
                label="Featured"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {review.comment}
          </Typography>

          {/* Review Stats */}
          {review.helpful > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip
                icon={<CombinedIcon name="ThumbUp" size={14} />}
                label={`${review.helpful} helpful`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Card2>
  );
};