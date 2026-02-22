// store/slices/reviewsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Review, ReviewStats } from '@/types/review'

export interface ReviewsState {
  items: Review[]
  userReview: Review | null
  stats: ReviewStats | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: {
    rating: number | null
    sort: 'newest' | 'oldest' | 'helpful' | 'rating'
    featured: boolean
  }
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  userReviewLoading: boolean
  userReviewError: string | null
}

const initialState: ReviewsState = {
  items: [],
  userReview: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    rating: null,
    sort: 'newest',
    featured: false,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
  userReviewLoading: false,
  userReviewError: null,
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // Reviews list actions
    setReviews: (state, action: PayloadAction<{
      reviews: Review[]
      pagination: any
      stats: ReviewStats
    }>) => {
      state.items = action.payload.reviews
      state.pagination = action.payload.pagination
      state.stats = action.payload.stats
    },
    
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.unshift(action.payload)
      if (state.stats) {
        state.stats.totalReviews += 1
        const ratingDist = state.stats.ratingDistribution.find(r => r._id === action.payload.rating)
        if (ratingDist) {
          ratingDist.count += 1
        }
        state.stats.averageRating = state.items.reduce((sum, r) => sum + r.rating, 0) / state.items.length
      }
    },
    
    updateReviewInList: (state, action: PayloadAction<Review>) => {
      const index = state.items.findIndex(r => r._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    
    removeReviewFromList: (state, action: PayloadAction<string>) => {
      const review = state.items.find(r => r._id === action.payload)
      state.items = state.items.filter(r => r._id !== action.payload)
      
      if (state.stats && review) {
        state.stats.totalReviews -= 1
        const ratingDist = state.stats.ratingDistribution.find(r => r._id === review.rating)
        if (ratingDist) {
          ratingDist.count -= 1
        }
        if (state.items.length > 0) {
          state.stats.averageRating = state.items.reduce((sum, r) => sum + r.rating, 0) / state.items.length
        } else {
          state.stats.averageRating = 0
        }
      }
    },
    
    // User review actions
    setUserReview: (state, action: PayloadAction<Review | null>) => {
      state.userReview = action.payload
    },
    
    updateUserReview: (state, action: PayloadAction<Review>) => {
      state.userReview = action.payload
      updateReviewInList(state, { payload: action.payload, type: '' })
    },
    
    clearUserReview: (state) => {
      state.userReview = null
    },
    
    // Helpful toggle
    toggleHelpfulInList: (state, action: PayloadAction<{
      reviewId: string
      helpful: boolean
      newCount: number
    }>) => {
      const review = state.items.find(r => r._id === action.payload.reviewId)
      if (review) {
        review.helpful = action.payload.newCount
        review.userHasMarkedHelpful = action.payload.helpful
      }
      
      if (state.userReview?._id === action.payload.reviewId) {
        state.userReview.helpful = action.payload.newCount
        state.userReview.userHasMarkedHelpful = action.payload.helpful
      }
    },
    
    // Filter actions
    setRatingFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.rating = action.payload
      state.pagination.page = 1
    },
    
    setSortFilter: (state, action: PayloadAction<'newest' | 'oldest' | 'helpful' | 'rating'>) => {
      state.filters.sort = action.payload
      state.pagination.page = 1
    },
    
    setFeaturedFilter: (state, action: PayloadAction<boolean>) => {
      state.filters.featured = action.payload
      state.pagination.page = 1
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    
    setUserReviewLoading: (state, action: PayloadAction<boolean>) => {
      state.userReviewLoading = action.payload
    },
    
    // Error states
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    setUserReviewError: (state, action: PayloadAction<string | null>) => {
      state.userReviewError = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    clearUserReviewError: (state) => {
      state.userReviewError = null
    },
    
    // Reset
    resetState: () => initialState,
  },
})

export const {
  setReviews,
  addReview,
  updateReviewInList,
  removeReviewFromList,
  setUserReview,
  updateUserReview,
  clearUserReview,
  toggleHelpfulInList,
  setRatingFilter,
  setSortFilter,
  setFeaturedFilter,
  setPage,
  resetFilters,
  setLoading,
  setSubmitting,
  setUserReviewLoading,
  setError,
  setUserReviewError,
  clearError,
  clearUserReviewError,
  resetState,
} = reviewsSlice.actions

export default reviewsSlice.reducer