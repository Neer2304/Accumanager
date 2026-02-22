// hooks/useReviews.ts
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReviewService } from '@/services/reviewService'
import { ReviewFilters } from '@/types/review'
import {
  setReviews,
  toggleHelpfulInList,
  setRatingFilter,
  setSortFilter,
  setFeaturedFilter,
  setPage,
  resetFilters,
  setLoading,
  setError,
  clearError,
  setSubmitting,
} from '@/store/slices/reviewsSlice'

interface UseReviewsOptions {
  autoLoad?: boolean
  initialFilters?: ReviewFilters
}

export const useReviews = (options: UseReviewsOptions = {}) => {
  const dispatch = useDispatch()

  // Selectors
  const reviews = useSelector((state: any) => state.reviews.items)
  const stats = useSelector((state: any) => state.reviews.stats)
  const pagination = useSelector((state: any) => state.reviews.pagination)
  const filters = useSelector((state: any) => state.reviews.filters)
  const isLoading = useSelector((state: any) => state.reviews.isLoading)
  const error = useSelector((state: any) => state.reviews.error)

  // Load reviews with current filters
  const loadReviews = useCallback(async (page?: number) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const currentPage = page || pagination.page
      
      const response = await ReviewService.getReviews({
        page: currentPage,
        limit: pagination.limit,
        rating: filters.rating || undefined,
        sort: filters.sort,
        featured: filters.featured,
      })

      dispatch(setReviews({
        reviews: response.reviews,
        pagination: response.pagination,
        stats: response.summary,
      }))
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load reviews'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, pagination.page, pagination.limit, filters])

  // Toggle helpful on a review
  const toggleHelpful = useCallback(async (reviewId: string) => {
    try {
      const result = await ReviewService.toggleHelpful(reviewId)
      
      dispatch(toggleHelpfulInList({
        reviewId,
        helpful: result.helpful,
        newCount: result.newCount,
      }))

      return result
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update helpful'))
      throw err
    }
  }, [dispatch])

  // Filter actions
  const setRating = useCallback((rating: number | null) => {
    dispatch(setRatingFilter(rating))
    loadReviews(1)
  }, [dispatch, loadReviews])

  const setSort = useCallback((sort: 'newest' | 'oldest' | 'helpful' | 'rating') => {
    dispatch(setSortFilter(sort))
    loadReviews(1)
  }, [dispatch, loadReviews])

  const setFeatured = useCallback((featured: boolean) => {
    dispatch(setFeaturedFilter(featured))
    loadReviews(1)
  }, [dispatch, loadReviews])

  const changePage = useCallback((newPage: number) => {
    dispatch(setPage(newPage))
    loadReviews(newPage)
  }, [dispatch, loadReviews])

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters())
    loadReviews(1)
  }, [dispatch, loadReviews])

  // Pagination helpers
  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      changePage(pagination.page + 1)
    }
  }, [pagination.hasNext, pagination.page, changePage])

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      changePage(pagination.page - 1)
    }
  }, [pagination.hasPrev, pagination.page, changePage])

  // Auto-load on mount or when options change
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadReviews()
    }
  }, [loadReviews, options.autoLoad])

  return {
    // State
    reviews,
    stats,
    pagination,
    filters,
    isLoading,
    error,

    // Actions
    loadReviews,
    toggleHelpful,
    setRating,
    setSort,
    setFeatured,
    changePage,
    nextPage,
    prevPage,
    resetFilters: resetAllFilters,
    clearError: () => dispatch(clearError()),

    // Helpers
    getRatingPercentages: ReviewService.getRatingPercentages,
    formatDate: ReviewService.formatReviewDate,
    getStarRating: ReviewService.getStarRating,
  }
}