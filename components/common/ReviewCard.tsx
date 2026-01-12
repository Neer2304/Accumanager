import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import { ReviewIcon } from '@/components/reviews/ReviewsIcons';

interface ReviewCardProps {
  review: {
    _id: string;
    userName: string;
    userAvatar?: string;
    userRole: string;
    userCompany: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    createdAt: string;
    reply?: {
      message: string;
      repliedBy: string;
      repliedAt: string;
    };
  };
  onHelpful: (reviewId: string) => void;
}

export const ReviewCard = ({ review, onHelpful }: ReviewCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        {/* Review Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {review.userAvatar || review.userName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {review.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.userRole} • {review.userCompany}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<ReviewIcon name="Star" size="small" />}
            label={review.rating}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Review Content */}
        <Typography variant="h6" gutterBottom>
          {review.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {review.comment}
        </Typography>

        {/* Review Footer */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {new Date(review.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
          
          <Button
            size="small"
            startIcon={<ReviewIcon name="ThumbUp" size="small" />}
            onClick={() => onHelpful(review._id)}
          >
            Helpful ({review.helpful})
          </Button>
        </Box>

        {/* Admin Reply */}
        {review.reply && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Response from AccumaManage Team
            </Typography>
            <Typography variant="body2">
              {review.reply.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {new Date(review.reply.repliedAt).toLocaleDateString('en-IN')}
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};