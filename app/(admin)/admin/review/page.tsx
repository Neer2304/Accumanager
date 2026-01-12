"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

// Common Components
import { PageHeader } from '@/components/common';

// Review Components
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewStatsCard from '@/components/reviews/ReviewStatsCard';
import ReviewEmptyState from '@/components/reviews/ReviewEmptyState';
import RejectReviewDialog from '@/components/reviews/RejectReviewDialog';
import UserDetailsDialog from '@/components/users/UserDetailsDialog';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  userCompany: string;
  userRole: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  helpful?: number;
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  subscription?: {
    plan: string;
    status: string;
    joinedDate: string;
  };
  stats?: {
    totalOrders?: number;
    totalSpent?: number;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reviews?status=pending');
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        setError(data.error || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedUser(data.user);
        setUserDialogOpen(true);
      } else {
        setError(data.error || 'Failed to fetch user details');
      }
    } catch (err) {
      setError('Failed to fetch user details');
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewId, 
          status: 'approved' 
        })
      });
      
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to approve review');
      }
    } catch (err) {
      setError('Failed to approve review');
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedReview) return;
    
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewId: selectedReview._id, 
          status: 'rejected',
          reply: reason ? { message: reason } : undefined
        })
      });
      
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== selectedReview._id));
        setRejectDialogOpen(false);
        setSelectedReview(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to reject review');
      }
    } catch (err) {
      setError('Failed to reject review');
    }
  };

  const handleBulkApprove = async () => {
    try {
      const response = await fetch('/api/admin/reviews/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewIds: reviews.map(r => r._id) 
        })
      });
      
      if (response.ok) {
        setReviews([]);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to bulk approve reviews');
      }
    } catch (err) {
      setError('Failed to bulk approve reviews');
    }
  };

  const positiveCount = reviews.filter(r => r.rating >= 4).length;
  const criticalCount = reviews.filter(r => r.rating <= 2).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <PageHeader
        title="Review Moderation"
        subtitle={`Pending reviews: ${reviews.length}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Reviews' },
        ]}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Stats Card */}
      {reviews.length > 0 && (
        <ReviewStatsCard
          totalReviews={reviews.length}
          positiveCount={positiveCount}
          criticalCount={criticalCount}
          onBulkApprove={handleBulkApprove}
        />
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading pending reviews...
          </Typography>
        </Box>
      ) : reviews.length === 0 ? (
        <ReviewEmptyState onRefresh={fetchPendingReviews} />
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: '1 1 calc(50% - 12px)',
            minWidth: 300
          }
        }}>
          {reviews.map((review) => (
            <Box key={review._id}>
              <ReviewCard
                review={review}
                onApprove={handleApprove}
                onReject={(review) => {
                  setSelectedReview(review);
                  setRejectDialogOpen(true);
                }}
                onViewUser={fetchUserDetails}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Reject Review Dialog */}
      <RejectReviewDialog
        open={rejectDialogOpen}
        review={selectedReview}
        onClose={() => {
          setRejectDialogOpen(false);
          setSelectedReview(null);
        }}
        onReject={handleReject}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        open={userDialogOpen}
        user={selectedUser}
        onClose={() => setUserDialogOpen(false)}
      />
    </Container>
  );
}