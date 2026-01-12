'use client';

import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useReviewsData } from '@/hooks/useReviewsData';
import { HeaderSection } from './sections/HeaderSection';
import { ReviewFormSection } from './sections/ReviewFormSection';
import { ReviewListSection } from './sections/ReviewListSection';
import { SidebarSection } from './sections/SidebarSection';
import { DeleteDialog } from './sections/DeleteDialog';

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
    const success = await deleteReview();
    if (success) {
      setFormData({ rating: 0, title: '', comment: '' });
      setEditMode(false);
      setDeleteDialog(false);
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
        <HeaderSection />

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          '& > *': {
            flex: '1 1 calc(66.666% - 16px)',
            minWidth: 300
          }
        }}>
          {/* Left Column - Write Review & Recent Reviews */}
          <Box>
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
            />

            <ReviewListSection
              reviews={reviews}
              onMarkHelpful={markHelpful}
            />
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
            <SidebarSection />
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      </Box>
    </MainLayout>
  );
}