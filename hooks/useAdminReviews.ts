// hooks/useAdminReviews.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminReviewService } from '@/services/adminReviewService';
import { SuperAdminReviewService } from '@/services/superAdminReviewService';
import { ReviewFilters, ModerationAction, AdminReplyData } from '@/types/reviewss';
import {
  setReviews,
  setSelectedReview,
  updateReview,
  removeReview,
  toggleSelectReview,
  selectAllReviews,
  clearSelection,
  setFilters,
  setStatusFilter,
  setPage,
  resetFilters,
  setPagination,
  setStats,
  setLoading,
  setSubmitting,
  setError,
  setSuccess,
  clearMessages,
} from '@/store/slices/adminReviewsSlice';

interface UseAdminReviewsOptions {
  autoLoad?: boolean;
  isSuperAdmin?: boolean;
}

interface UseAdminReviewsReturn {
  // State
  reviews: any[];
  selectedReview: any | null;
  filters: ReviewFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    avgRating: number;
  };
  selectedIds: string[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;

  // Selection actions
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelected: () => void;
  hasSelected: boolean;
  selectedCount: number;

  // Filter actions
  setStatus: (status: ReviewFilters['status']) => void;
  setSearchQuery: (query: string) => void;
  setRatingFilter: (rating: number | undefined) => void;
  setReviewsPage: (page: number) => void;
  resetAllFilters: () => void;

  // Review actions
  loadReviews: () => Promise<void>;
  loadMore: () => Promise<void>;
  approveReview: (reviewId: string) => Promise<boolean>;
  rejectReview: (reviewId: string, reason: string) => Promise<boolean>;
  toggleFeature: (reviewId: string, featured: boolean) => Promise<boolean>;
  replyToReview: (reviewId: string, message: string) => Promise<boolean>;
  selectReview: (review: any | null) => void;

  // Bulk actions
  bulkApprove: () => Promise<boolean>;
  bulkReject: (reason?: string) => Promise<boolean>;

  // Super admin actions
  deleteReview: (reviewId: string) => Promise<boolean>;

  // Messages
  clearError: () => void;
  clearSuccess: () => void;
  clearAllMessages: () => void;

  // Helpers
  getPendingCount: () => number;
  getApprovedCount: () => number;
  getRejectedCount: () => number;
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
}

export const useAdminReviews = (options: UseAdminReviewsOptions = {}): UseAdminReviewsReturn => {
  const dispatch = useDispatch();
  const isSuperAdmin = options.isSuperAdmin || false;

  // Selectors
  const reviews = useSelector((state: any) => state.adminReviews.items);
  const selectedReview = useSelector((state: any) => state.adminReviews.selectedReview);
  const filters = useSelector((state: any) => state.adminReviews.filters);
  const pagination = useSelector((state: any) => state.adminReviews.pagination);
  const stats = useSelector((state: any) => state.adminReviews.stats);
  const selectedIds = useSelector((state: any) => state.adminReviews.selectedIds);
  const loading = useSelector((state: any) => state.adminReviews.loading);
  const submitting = useSelector((state: any) => state.adminReviews.submitting);
  const error = useSelector((state: any) => state.adminReviews.error);
  const success = useSelector((state: any) => state.adminReviews.success);

  // Load reviews
  const loadReviews = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      let response;
      
      if (isSuperAdmin && filters.status === 'all') {
        // Super admin can see all
        const superResponse = await SuperAdminReviewService.getAllReviews(
          filters.page || 1,
          filters.limit || 20
        );
        response = {
          reviews: superResponse.reviews,
          pagination: superResponse.pagination
        };
        
        // Update stats if available
        if (superResponse.stats) {
          const statsMap = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: superResponse.pagination.total,
            avgRating: 0
          };
          
          superResponse.stats.forEach((stat: any) => {
            if (stat._id === 'pending') statsMap.pending = stat.count;
            if (stat._id === 'approved') {
              statsMap.approved = stat.count;
              statsMap.avgRating = stat.avgRating || 0;
            }
            if (stat._id === 'rejected') statsMap.rejected = stat.count;
          });
          
          dispatch(setStats(statsMap));
        }
      } else {
        // Regular admin view
        response = await AdminReviewService.getReviews(filters);
      }

      dispatch(setReviews(response.reviews));
      dispatch(setPagination({
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load reviews'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters, isSuperAdmin]);

  // Load more (next page)
  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages && !loading) {
      dispatch(setPage(pagination.page + 1));
    }
  }, [dispatch, pagination.page, pagination.totalPages, loading]);

  // Approve review
  const approveReview = useCallback(async (reviewId: string): Promise<boolean> => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const updatedReview = await AdminReviewService.approveReview(reviewId);
      dispatch(updateReview(updatedReview));
      dispatch(setSuccess('Review approved successfully'));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to approve review'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Reject review
  const rejectReview = useCallback(async (reviewId: string, reason: string): Promise<boolean> => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const updatedReview = await AdminReviewService.rejectReview(reviewId, reason);
      dispatch(updateReview(updatedReview));
      dispatch(setSuccess('Review rejected successfully'));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to reject review'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Toggle featured
  const toggleFeature = useCallback(async (reviewId: string, featured: boolean): Promise<boolean> => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const updatedReview = await AdminReviewService.toggleFeature(reviewId, featured);
      dispatch(updateReview(updatedReview));
      dispatch(setSuccess(`Review ${featured ? 'featured' : 'unfeatured'} successfully`));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update featured status'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Reply to review
  const replyToReview = useCallback(async (reviewId: string, message: string): Promise<boolean> => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const updatedReview = await AdminReviewService.replyToReview(reviewId, { message });
      dispatch(updateReview(updatedReview));
      dispatch(setSuccess('Reply added successfully'));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to add reply'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Bulk approve
  const bulkApprove = useCallback(async (): Promise<boolean> => {
    if (selectedIds.length === 0) {
      dispatch(setError('No reviews selected'));
      return false;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      await AdminReviewService.batchApprove(selectedIds);
      
      // Update each review in state
      selectedIds.forEach(id => {
        dispatch(updateReview({ 
          _id: id, 
          status: 'approved',
          approvedAt: new Date().toISOString()
        } as any));
      });
      
      dispatch(clearSelection());
      dispatch(setSuccess(`${selectedIds.length} reviews approved successfully`));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to approve reviews'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch, selectedIds]);

  // Bulk reject
  const bulkReject = useCallback(async (reason: string = ''): Promise<boolean> => {
    if (selectedIds.length === 0) {
      dispatch(setError('No reviews selected'));
      return false;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      await AdminReviewService.batchReject(selectedIds, reason);
      
      selectedIds.forEach(id => {
        dispatch(updateReview({ 
          _id: id, 
          status: 'rejected',
          rejectionReason: reason,
          rejectedAt: new Date().toISOString()
        } as any));
      });
      
      dispatch(clearSelection());
      dispatch(setSuccess(`${selectedIds.length} reviews rejected successfully`));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to reject reviews'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch, selectedIds]);

  // Super admin delete
  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    if (!isSuperAdmin) {
      dispatch(setError('Only super admin can delete reviews'));
      return false;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      await SuperAdminReviewService.deleteReview(reviewId);
      dispatch(removeReview(reviewId));
      dispatch(setSuccess('Review deleted successfully'));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to delete review'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch, isSuperAdmin]);

  // Selection actions
  const toggleSelect = useCallback((id: string) => {
    dispatch(toggleSelectReview(id));
  }, [dispatch]);

  const selectAll = useCallback(() => {
    dispatch(selectAllReviews());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  // Filter actions
  const setStatus = useCallback((status: ReviewFilters['status']) => {
    dispatch(setStatusFilter(status));
  }, [dispatch]);

  const setSearchQuery = useCallback((query: string) => {
    dispatch(setFilters({ search: query }));
  }, [dispatch]);

  const setRatingFilter = useCallback((rating: number | undefined) => {
    dispatch(setFilters({ rating }));
  }, [dispatch]);

  const setReviewsPage = useCallback((page: number) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const selectReview = useCallback((review: any | null) => {
    dispatch(setSelectedReview(review));
  }, [dispatch]);

  // Messages
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const clearSuccess = useCallback(() => {
    dispatch(setSuccess(null));
  }, [dispatch]);

  const clearAllMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  // Computed values
  const hasSelected = selectedIds.length > 0;
  const selectedCount = selectedIds.length;
  const getPendingCount = useCallback(() => stats.pending, [stats.pending]);
  const getApprovedCount = useCallback(() => stats.approved, [stats.approved]);
  const getRejectedCount = useCallback(() => stats.rejected, [stats.rejected]);
  const hasNextPage = useCallback(() => pagination.page < pagination.totalPages, [pagination]);
  const hasPrevPage = useCallback(() => pagination.page > 1, [pagination.page]);

  // Auto-load on mount and filter changes
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadReviews();
    }
  }, [loadReviews, options.autoLoad, filters.status, filters.page, filters.search, filters.rating]);

  return {
    // State
    reviews,
    selectedReview,
    filters,
    pagination,
    stats,
    selectedIds,
    loading,
    submitting,
    error,
    success,

    // Selection
    toggleSelect,
    selectAll,
    clearSelected,
    hasSelected,
    selectedCount,

    // Filter actions
    setStatus,
    setSearchQuery,
    setRatingFilter,
    setReviewsPage,
    resetAllFilters,

    // Review actions
    loadReviews,
    loadMore,
    approveReview,
    rejectReview,
    toggleFeature,
    replyToReview,
    selectReview,

    // Bulk actions
    bulkApprove,
    bulkReject,

    // Super admin
    deleteReview,

    // Messages
    clearError,
    clearSuccess,
    clearAllMessages,

    // Helpers
    getPendingCount,
    getApprovedCount,
    getRejectedCount,
    hasNextPage,
    hasPrevPage,
  };
};