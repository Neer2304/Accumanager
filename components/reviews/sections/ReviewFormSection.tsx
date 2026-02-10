import React from 'react';
import {
  Box,
  Typography,
  Rating as MuiRating,
  TextField as MuiTextField,
  CircularProgress as MuiCircularProgress,
} from '@mui/material';
import { Review } from '@/hooks/useReviewsData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';

interface ReviewFormSectionProps {
  userReview: Review | null;
  editMode: boolean;
  rating: number;
  title: string;
  comment: string;
  submitting: boolean;
  error: string;
  success: string;
  onRatingChange: (value: number) => void;
  onTitleChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  darkMode?: boolean;
}

export const ReviewFormSection = ({
  userReview,
  editMode,
  rating,
  title,
  comment,
  submitting,
  error,
  success,
  onRatingChange,
  onTitleChange,
  onCommentChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  darkMode = false,
}: ReviewFormSectionProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Card
      title={userReview ? "Your Review" : "Write a Review"}
      subtitle={userReview ? "You can update or delete your review" : "Share your experience with us"}
      hover
      sx={{ mb: 4 }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User Review Status */}
          {userReview && (
            <Alert
              severity="info"
              title="Your Review Status"
              message={`Status: ${userReview.status === 'pending' ? 'Pending Approval' : 'Published'}`}
              sx={{ mb: 2 }}
            />
          )}

          {/* Rating */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Your Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MuiRating
                value={rating}
                onChange={(event, newValue) => {
                  onRatingChange(newValue || 0);
                }}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#1a73e8',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: darkMode ? '#5f6368' : '#dadce0',
                  },
                }}
              />
              <Badge
                badgeContent={rating > 0 ? `${rating} stars` : 'Not rated'}
                // color={rating > 0 ? "primary" : "default"}
                // size="small"
              />
            </Box>
          </Box>

          {/* Title */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Review Title
            </Typography>
            <MuiTextField
              fullWidth
              placeholder="Give your review a title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              size="medium"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                  },
                },
              }}
            />
          </Box>

          {/* Comment */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Your Review
            </Typography>
            <MuiTextField
              fullWidth
              multiline
              rows={6}
              placeholder="Share your detailed experience..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                  },
                },
              }}
            />
            <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mt: 1 }}>
              {comment.length}/500 characters
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            pt: 2
          }}>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
              iconLeft={submitting ? <MuiCircularProgress size={16} /> : null}
            >
              {submitting 
                ? 'Submitting...' 
                : editMode 
                  ? 'Update Review' 
                  : userReview 
                    ? 'Update Review' 
                    : 'Submit Review'
              }
            </Button>

            {userReview && !editMode && (
              <>
                <Button
                  variant="outlined"
                  onClick={onEdit}
                  size="medium"
                >
                  Edit Review
                </Button>
                <Button
                  variant="outlined"
                  onClick={onDelete}
                  size="medium"
                  color="error"
                >
                  Delete Review
                </Button>
              </>
            )}

            {editMode && (
              <Button
                variant="outlined"
                onClick={onCancelEdit}
                size="medium"
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Card>
  );
};