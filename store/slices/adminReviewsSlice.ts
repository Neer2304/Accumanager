// store/slices/adminReviewsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewFilters } from '@/types/reviewss';

interface AdminReviewsState {
  items: Review[];
  selectedReview: Review | null;
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
  selectedIds: string[]; // For bulk actions
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminReviewsState = {
  items: [],
  selectedReview: null,
  filters: {
    status: 'pending',
    page: 1,
    limit: 20,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  stats: {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    avgRating: 0,
  },
  selectedIds: [],
  loading: false,
  submitting: false,
  error: null,
  success: null,
};

const adminReviewsSlice = createSlice({
  name: 'adminReviews',
  initialState,
  reducers: {
    // Data actions
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = action.payload;
    },
    setSelectedReview: (state, action: PayloadAction<Review | null>) => {
      state.selectedReview = action.payload;
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.items.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedReview?._id === action.payload._id) {
        state.selectedReview = action.payload;
      }
    },
    removeReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r._id !== action.payload);
      if (state.selectedReview?._id === action.payload) {
        state.selectedReview = null;
      }
      // Remove from selected if present
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },

    // Bulk selection
    toggleSelectReview: (state, action: PayloadAction<string>) => {
      const index = state.selectedIds.indexOf(action.payload);
      if (index === -1) {
        state.selectedIds.push(action.payload);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    selectAllReviews: (state) => {
      state.selectedIds = state.items.map(r => r._id);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<Partial<ReviewFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      if (action.payload.status !== undefined || 
          action.payload.search !== undefined ||
          action.payload.rating !== undefined) {
        state.filters.page = 1;
      }
    },
    setStatusFilter: (state, action: PayloadAction<ReviewFilters['status']>) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<{ total: number; totalPages: number }>) => {
      state.pagination.total = action.payload.total;
      state.pagination.totalPages = action.payload.totalPages;
    },

    // Stats
    setStats: (state, action: PayloadAction<Partial<AdminReviewsState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },

    // Error/Success
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // Reset
    resetState: () => initialState,
  },
});

export const {
  setReviews,
  setSelectedReview,
  updateReview,
  removeReview,
  clearSelectedReview,
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
  resetState,
} = adminReviewsSlice.actions;

export default adminReviewsSlice.reducer;