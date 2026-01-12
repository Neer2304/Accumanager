import { useState, useEffect } from 'react';

export interface ReviewReply {
  message: string;
  repliedBy: string;
  repliedAt: string;
}

export interface Review {
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
  reply?: ReviewReply;
}

export interface UseReviewsDataReturn {
  reviews: Review[];
  userReview: Review | null;
  loading: boolean;
  submitting: boolean;
  error: string;
  success: string;
  fetchReviews: () => Promise<void>;
  fetchUserReview: () => Promise<void>;
  submitReview: (data: { rating: number; title: string; comment: string }, editMode: boolean) => Promise<void>;
  deleteReview: () => Promise<void>;
  markHelpful: (reviewId: string) => Promise<void>;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setSubmitting: (submitting: boolean) => void;
}

export const useReviewsData = (): UseReviewsDataReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=5&sort=helpful');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await fetch('/api/reviews/my-review');
      if (response.ok) {
        const data = await response.json();
        if (data.review) {
          setUserReview(data.review);
        }
      }
    } catch (err) {
      console.error('Error fetching user review:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (
    data: { rating: number; title: string; comment: string },
    editMode: boolean
  ) => {
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
          rating: data.rating,
          title: data.title.trim(),
          comment: data.comment.trim(),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(
          editMode
            ? 'Review updated successfully! It will be visible after approval.'
            : 'Review submitted successfully! It will be visible after approval.'
        );
        setUserReview(responseData.review);
        await fetchReviews();
      } else {
        setError(responseData.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    try {
      const response = await fetch('/api/reviews/my-review', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Review deleted successfully');
        setUserReview(null);
        await fetchReviews();
        return true;
      } else {
        setError('Failed to delete review');
        return false;
      }
    } catch (err) {
      setError('An error occurred while deleting your review');
      return false;
    }
  };

  const markHelpful = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });

      if (response.ok) {
        await fetchReviews();
      }
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchUserReview();
  }, []);

  return {
    reviews,
    userReview,
    loading,
    submitting,
    error,
    success,
    fetchReviews,
    fetchUserReview,
    submitReview,
    deleteReview,
    markHelpful,
    setError,
    setSuccess,
    setSubmitting,
  };
};