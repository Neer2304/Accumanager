import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Stack,
  TextField,
  Button,
  Rating,
  CircularProgress,
} from '@mui/material';
import { ReviewIcon, getStatusIcon, getStatusText } from '../ReviewsIcons';
import { REVIEWS_CONTENT } from '../ReviewsContent';
import { Review } from '@/hooks/useReviewsData';

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
}: ReviewFormSectionProps) => {
  const { form, rating: ratingContent, title: titleContent, comment: commentContent, buttons, validation } = REVIEWS_CONTENT;

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {userReview ? form.userReviewTitle : form.title}
        </Typography>

        {userReview && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
            icon={getStatusIcon(userReview.status)}
          >
            <Typography variant="body2" fontWeight="medium">
              Status: {getStatusText(userReview.status)}
            </Typography>
            {userReview.status === 'pending' && (
              <Typography variant="caption" display="block">
                {form.statusMessages.pending}
              </Typography>
            )}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* Rating */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {ratingContent.label}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => {
                    onRatingChange(newValue || 0);
                  }}
                  size="large"
                  icon={<ReviewIcon name="Star" />}
                  emptyIcon={<ReviewIcon name="Star" />}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : ratingContent.placeholder}
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <TextField
              label={titleContent.label}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={titleContent.placeholder}
              required
              fullWidth
              InputProps={{
                startAdornment: <ReviewIcon name="Title" size="small" sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            {/* Comment */}
            <TextField
              label={commentContent.label}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder={commentContent.placeholder}
              multiline
              rows={6}
              required
              fullWidth
              helperText={`${comment.length}/${validation.commentMaxLength} ${commentContent.helperText}`}
              InputProps={{
                startAdornment: <ReviewIcon name="Comment" size="small" sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1.5 }} />,
              }}
            />

            {/* Action Buttons */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
                startIcon={<ReviewIcon name="Star" />}
              >
                {submitting ? (
                  <CircularProgress size={20} />
                ) : editMode ? (
                  buttons.update
                ) : userReview ? (
                  buttons.update
                ) : (
                  buttons.submit
                )}
              </Button>

              {userReview && !editMode && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<ReviewIcon name="Edit" />}
                    onClick={onEdit}
                  >
                    {buttons.edit}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ReviewIcon name="Delete" />}
                    onClick={onDelete}
                  >
                    {buttons.delete}
                  </Button>
                </>
              )}

              {editMode && (
                <Button
                  variant="outlined"
                  onClick={onCancelEdit}
                >
                  {buttons.cancel}
                </Button>
              )}
            </Box>

            {/* Messages */}
            {error && (
              <Alert severity="error" onClose={() => onRatingChange(0)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" onClose={() => onRatingChange(0)}>
                {success}
              </Alert>
            )}
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};