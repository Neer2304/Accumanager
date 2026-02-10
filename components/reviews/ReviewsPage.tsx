'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Button as MuiButton,
} from '@mui/material';
import {
  Home as HomeIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useReviewsData } from '@/hooks/useReviewsData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { TextField } from '@/components/ui/TextField';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { Dialog } from '@/components/ui/Dialog';
import { Divider } from '@/components/ui/Divider';

// Import your existing components
import { HeaderSection } from './sections/HeaderSection';
import { ReviewFormSection } from './sections/ReviewFormSection';
import { ReviewListSection } from './sections/ReviewListSection';
import { SidebarSection } from './sections/SidebarSection';
import { DeleteDialog } from './sections/DeleteDialog';

// Safe Fade component
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function ReviewsPage() {
  const {
    reviews,
    userReview,
    loading,
    submitting,
    error,
    success,
    submitReview,
    deleteReview,
    markHelpful,
    setError,
    setSuccess,
    setSubmitting,
  } = useReviewsData();

  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    rating: userReview?.rating || 0,
    title: userReview?.title || '',
    comment: userReview?.comment || '',
  });
  const [visibleReviews, setVisibleReviews] = useState(3); // Show 3 reviews initially
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
  };

  const handleCommentChange = (comment: string) => {
    setFormData({ ...formData, comment });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReview(formData, editMode);
    if (editMode) {
      setEditMode(false);
    }
  };

  const handleEdit = () => {
    if (userReview) {
      setFormData({
        rating: userReview.rating,
        title: userReview.title,
        comment: userReview.comment,
      });
      setEditMode(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview();
      // If deleteReview doesn't throw an error, assume it was successful
      setFormData({ rating: 0, title: '', comment: '' });
      setEditMode(false);
      setDeleteDialog(false);
      setSuccess('Review deleted successfully');
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (userReview) {
      setFormData({
        rating: userReview.rating,
        title: userReview.title,
        comment: userReview.comment,
      });
    } else {
      setFormData({ rating: 0, title: '', comment: '' });
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleReviews(prev => prev + 3);
      setLoadingMore(false);
    }, 500);
  };

  if (loading) {
    return (
      <MainLayout title="Customer Reviews">
        <Box sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <CircularProgress sx={{ color: "#1a73e8" }} />
        </Box>
      </MainLayout>
    );
  }

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
    <MainLayout title="Customer Reviews">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header with Google theme */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <SafeFade>
            <Breadcrumbs
              sx={{
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 400,
                  "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
                }}
              >
                <HomeIcon
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: "16px", sm: "18px" },
                  }}
                />
                Dashboard
              </MuiLink>
              <Typography
                color={darkMode ? "#e8eaed" : "#202124"}
                fontWeight={500}
              >
                Customer Reviews
              </Typography>
            </Breadcrumbs>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                fontWeight={500}
                gutterBottom
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Customer Reviews
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 400,
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  lineHeight: 1.5,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Share your experience and read what others have to say
              </Typography>
            </Box>
          </SafeFade>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          p: { xs: 2, sm: 3 } 
        }}>
          {/* Error/Success Alerts */}
          <SafeFade>
            {error && (
              <Alert
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError('')}
                sx={{ mb: 3 }}
              />
            )}
            
            {success && (
              <Alert
                severity="success"
                title="Success"
                message={success}
                dismissible
                onDismiss={() => setSuccess('')}
                sx={{ mb: 3 }}
              />
            )}
          </SafeFade>

          {/* Main Content Layout */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}>
            {/* Left Column - Write Review & Recent Reviews */}
            <Box sx={{ flex: { md: 2 } }}>
              <SafeFade>
                <ReviewFormSection
                  userReview={userReview}
                  editMode={editMode}
                  rating={formData.rating}
                  title={formData.title}
                  comment={formData.comment}
                  submitting={submitting}
                  error={error}
                  success={success}
                  onRatingChange={handleRatingChange}
                  onTitleChange={handleTitleChange}
                  onCommentChange={handleCommentChange}
                  onSubmit={handleSubmit}
                  onEdit={handleEdit}
                  onDelete={() => setDeleteDialog(true)}
                  onCancelEdit={handleCancelEdit}
                  darkMode={darkMode}
                />
              </SafeFade>

              <SafeFade>
                <ReviewListSection
                  reviews={displayedReviews}
                  onMarkHelpful={markHelpful}
                  darkMode={darkMode}
                />

                {/* Load More Button */}
                {hasMoreReviews && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    mb: 2 
                  }}>
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      size="large"
                      sx={{
                        minWidth: 200,
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          bgcolor: darkMode ? 'rgba(138, 180, 248, 0.04)' : 'rgba(26, 115, 232, 0.04)',
                        }
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Loading...
                        </>
                      ) : (
                        `Load More Reviews (${reviews.length - visibleReviews} remaining)`
                      )}
                    </Button>
                  </Box>
                )}

                {/* Show when all reviews are loaded */}
                {!hasMoreReviews && reviews.length > 3 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 3, 
                    p: 2,
                    borderRadius: 1,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  }}>
                    <Typography 
                      variant="body2" 
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                    >
                      You've viewed all {reviews.length} reviews
                    </Typography>
                  </Box>
                )}
              </SafeFade>
            </Box>

            {/* Right Column - Sidebar */}
            <Box sx={{ 
              flex: { md: 1 },
              minWidth: { xs: '100%', md: 300 }
            }}>
              <SafeFade>
                <SidebarSection 
                  totalReviews={reviews.length} 
                  darkMode={darkMode} 
                />
              </SafeFade>
            </Box>
          </Box>

          {/* Delete Confirmation Dialog */}
          <SafeFade>
            <DeleteDialog
              open={deleteDialog}
              onClose={() => setDeleteDialog(false)}
              onConfirm={handleDelete}
              darkMode={darkMode}
            />
          </SafeFade>
        </Box>
      </Box>
    </MainLayout>
  );
}