"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Import our components
import { Alert2 } from '@/components/ui/alert2';
import { CombinedIcon } from '@/components/ui/icons2';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { RatingDistribution } from '@/components/reviews/RatingDistribution';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { ReviewCTA } from '@/components/reviews/ReviewCTA';
import { EmptyReviews } from '@/components/reviews/EmptyReviews';
import { ReviewItemSkeleton, ReviewStatsSkeleton } from '@/components/ui/skeleton2';

// Import types
import { Review } from '@/types/reviews';

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterSort, setFilterSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [page, filterRating, filterSort]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = `/api/reviews?page=${page}&limit=10&sort=${filterSort}`;
      if (filterRating !== 'all') url += `&rating=${filterRating}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalReviews(data.pagination?.total || 0);
      setAverageRating(data.summary?.averageRating || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/reviews/add');
      return;
    }
    router.push('/reviews/add');
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Customer Reviews
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Read what our customers say about their experience
          </Typography>

          {/* Stats */}
          {loading ? (
            <ReviewStatsSkeleton />
          ) : (
            <ReviewStats 
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          )}
        </Box>

        {/* Search and Filters */}
        <ReviewFilters
          searchTerm={searchTerm}
          filterRating={filterRating}
          filterSort={filterSort}
          onSearchChange={setSearchTerm}
          onFilterRatingChange={setFilterRating}
          onFilterSortChange={setFilterSort}
          onSearchSubmit={handleSearch}
          onWriteReview={handleWriteReview}
          isAuthenticated={isAuthenticated}
        />

        {/* Rating Distribution */}
        {!loading && (
          <RatingDistribution
            distribution={ratingDistribution}
            totalReviews={totalReviews}
          />
        )}

        {/* Error Message */}
        {error && (
          <Alert2 
            severity="error" 
            message={error}
            dismissible
            onDismiss={() => setError('')}
            sx={{ mb: 4 }}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <ReviewItemSkeleton count={3} />
          </Box>
        ) : (
          <>
            {/* Reviews List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              {reviews.length === 0 ? (
                <EmptyReviews 
                  searchTerm={searchTerm}
                  onWriteReview={handleWriteReview}
                />
              ) : (
                reviews.map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        {/* CTA */}
        <ReviewCTA
          isAuthenticated={isAuthenticated}
          onWriteReview={handleWriteReview}
        />
      </Container>
    </Box>
  );
}