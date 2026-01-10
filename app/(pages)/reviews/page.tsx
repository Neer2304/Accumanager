// app/reviews/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Alert,
  Stack,
  Chip,
  Paper,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ThumbUp as ThumbUpIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCompany: string;
  userRole: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  createdAt: string;
  reply?: {
    message: string;
    repliedBy: string;
    repliedAt: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Review form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Fetch reviews and user's review
  useEffect(() => {
    fetchReviews();
    fetchUserReview();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=5&sort=helpful');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await fetch('/api/reviews/my-review');
      if (response.ok) {
        const data = await response.json();
        if (data.review) {
          setUserReview(data.review);
          setRating(data.review.rating);
          setTitle(data.review.title);
          setComment(data.review.comment);
        }
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const url = editMode ? '/api/reviews/my-review' : '/api/reviews';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editMode 
          ? 'Review updated successfully! It will be visible after approval.' 
          : 'Review submitted successfully! It will be visible after approval.'
        );
        setUserReview(data.review);
        setEditMode(false);
        fetchReviews(); // Refresh the reviews list
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setRating(userReview.rating);
      setTitle(userReview.title);
      setComment(userReview.comment);
      setEditMode(true);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch('/api/reviews/my-review', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Review deleted successfully');
        setUserReview(null);
        setRating(0);
        setTitle('');
        setComment('');
        setEditMode(false);
        setDeleteDialog(false);
        fetchReviews();
      } else {
        setError('Failed to delete review');
      }
    } catch (error) {
      setError('An error occurred while deleting your review');
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });

      if (response.ok) {
        fetchReviews(); // Refresh to update helpful counts
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <PendingIcon color="warning" fontSize="small" />;
      case 'rejected':
        return <DeleteIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <MainLayout title="Reviews">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Reviews">
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <StarIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Customer Reviews
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Share your experience with AccumaManage
          </Typography>
        </Paper>

        {/* Main Content - Using flexbox instead of Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 4,
          '& > *': {
            flex: '1 1 calc(66.666% - 16px)',
            minWidth: 300
          }
        }}>
          {/* Left Column - Write Review */}
          <Box>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {userReview ? 'Your Review' : 'Write a Review'}
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
                        Your review is under review and will be visible once approved.
                      </Typography>
                    )}
                  </Alert>
                )}

                <form onSubmit={handleSubmitReview}>
                  <Stack spacing={3}>
                    {/* Rating */}
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Overall Rating *
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Rating
                          value={rating}
                          onChange={(event, newValue) => {
                            setRating(newValue || 0);
                          }}
                          size="large"
                          icon={<StarIcon fontSize="inherit" />}
                          emptyIcon={<StarIcon fontSize="inherit" />}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Title */}
                    <TextField
                      label="Review Title *"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief summary of your experience"
                      required
                      fullWidth
                    />

                    {/* Comment */}
                    <TextField
                      label="Your Review *"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share details of your experience with AccumaManage..."
                      multiline
                      rows={6}
                      required
                      fullWidth
                      helperText={`${comment.length}/1000 characters`}
                    />

                    {/* Action Buttons */}
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
                        startIcon={<StarIcon />}
                      >
                        {submitting ? (
                          <CircularProgress size={20} />
                        ) : editMode ? (
                          'Update Review'
                        ) : userReview ? (
                          'Update Review'
                        ) : (
                          'Submit Review'
                        )}
                      </Button>

                      {userReview && !editMode && (
                        <>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={handleEditReview}
                          >
                            Edit Review
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialog(true)}
                          >
                            Delete Review
                          </Button>
                        </>
                      )}

                      {editMode && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditMode(false);
                            if (userReview) {
                              setRating(userReview.rating);
                              setTitle(userReview.title);
                              setComment(userReview.comment);
                            }
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </Box>

                    {/* Messages */}
                    {error && (
                      <Alert severity="error" onClose={() => setError('')}>
                        {error}
                      </Alert>
                    )}

                    {success && (
                      <Alert severity="success" onClose={() => setSuccess('')}>
                        {success}
                      </Alert>
                    )}
                  </Stack>
                </form>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Recent Reviews from Our Users
                </Typography>
                <Stack spacing={2}>
                  {reviews.map((review) => (
                    <Card key={review._id} variant="outlined">
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
                            icon={<StarIcon />}
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
                            startIcon={<ThumbUpIcon />}
                            onClick={() => handleMarkHelpful(review._id)}
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
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Right Column - Stats & Info */}
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
            <Stack spacing={3}>
              {/* Review Guidelines */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    💡 Review Guidelines
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • Be specific about your experience
                    </Typography>
                    <Typography variant="body2">
                      • Mention specific features you like
                    </Typography>
                    <Typography variant="body2">
                      • Share how it helped your business
                    </Typography>
                    <Typography variant="body2">
                      • Keep it honest and constructive
                    </Typography>
                    <Typography variant="body2">
                      • No offensive language
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Why Review Matters */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    🌟 Why Your Review Matters
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Your feedback helps us improve AccumaManage and helps other businesses make informed decisions.
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon color="primary" />
                    <Typography variant="body2" fontWeight="medium">
                      Trusted by 500+ Indian Businesses
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Features to Mention */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    🚀 Consider Mentioning
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="GST Invoicing" size="small" variant="outlined" />
                    <Chip label="Inventory Management" size="small" variant="outlined" />
                    <Chip label="Event Tracking" size="small" variant="outlined" />
                    <Chip label="Customer Management" size="small" variant="outlined" />
                    <Chip label="Mobile App" size="small" variant="outlined" />
                    <Chip label="Support Quality" size="small" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Review</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your review? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteReview} color="error" variant="contained">
              Delete Review
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}