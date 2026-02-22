// hooks/useAdminReviewModeration.ts
import { useCallback, useState } from 'react';
import { AdminReviewService } from '@/services/adminReviewService';

interface UseAdminReviewModerationReturn {
  loading: boolean;
  error: string | null;
  approveReview: (reviewId: string) => Promise<boolean>;
  rejectReview: (reviewId: string, reason: string) => Promise<boolean>;
  toggleFeature: (reviewId: string, featured: boolean) => Promise<boolean>;
  replyToReview: (reviewId: string, message: string) => Promise<boolean>;
}

export const useAdminReviewModeration = (): UseAdminReviewModerationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);
      await AdminReviewService.approveReview(reviewId);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectReview = useCallback(async (reviewId: string, reason: string) => {
    try {
      setLoading(true);
      setError(null);
      await AdminReviewService.rejectReview(reviewId, reason);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeature = useCallback(async (reviewId: string, featured: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await AdminReviewService.toggleFeature(reviewId, featured);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const replyToReview = useCallback(async (reviewId: string, message: string) => {
    try {
      setLoading(true);
      setError(null);
      await AdminReviewService.replyToReview(reviewId, { message });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    approveReview,
    rejectReview,
    toggleFeature,
    replyToReview,
  };
};