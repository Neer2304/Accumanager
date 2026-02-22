// hooks/useUserReview.ts
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReviewService } from '@/services/reviewService'
import { CreateReviewData, UpdateReviewData } from '@/types/review'
import {
  setUserReview,
  updateUserReview,
  clearUserReview,
  setUserReviewLoading,
  setUserReviewError,
  clearUserReviewError,
  setSubmitting,
} from '@/store/slices/reviewsSlice'

export const useUserReview = (autoLoad: boolean = true) => {
  const dispatch = useDispatch()

  // Selectors
  const userReview = useSelector((state: any) => state.reviews.userReview)
  const isLoading = useSelector((state: any) => state.reviews.userReviewLoading)
  const error = useSelector((state: any) => state.reviews.userReviewError)
  const isSubmitting = useSelector((state: any) => state.reviews.isSubmitting)

  // Load user's review
  const loadUserReview = useCallback(async () => {
    try {
      dispatch(setUserReviewLoading(true))
      dispatch(clearUserReviewError())

      const response = await ReviewService.getUserReview()
      dispatch(setUserReview(response.review))
    } catch (err: any) {
      dispatch(setUserReviewError(err.message || 'Failed to load your review'))
    } finally {
      dispatch(setUserReviewLoading(false))
    }
  }, [dispatch])

  // Create new review
  const createReview = useCallback(async (data: CreateReviewData) => {
    try {
      dispatch(setSubmitting(true))
      dispatch(clearUserReviewError())

      const newReview = await ReviewService.createReview(data)
      dispatch(setUserReview(newReview))
      
      return { success: true, review: newReview }
    } catch (err: any) {
      dispatch(setUserReviewError(err.message || 'Failed to submit review'))
      return { success: false, error: err.message }
    } finally {
      dispatch(setSubmitting(false))
    }
  }, [dispatch])

  // Update existing review
  const updateReview = useCallback(async (data: UpdateReviewData) => {
    try {
      dispatch(setSubmitting(true))
      dispatch(clearUserReviewError())

      const updatedReview = await ReviewService.updateReview(data)
      dispatch(updateUserReview(updatedReview))
      
      return { success: true, review: updatedReview }
    } catch (err: any) {
      dispatch(setUserReviewError(err.message || 'Failed to update review'))
      return { success: false, error: err.message }
    } finally {
      dispatch(setSubmitting(false))
    }
  }, [dispatch])

  // Delete review
  const deleteReview = useCallback(async () => {
    try {
      dispatch(setSubmitting(true))
      dispatch(clearUserReviewError())

      await ReviewService.deleteReview()
      dispatch(clearUserReview())
      
      return { success: true }
    } catch (err: any) {
      dispatch(setUserReviewError(err.message || 'Failed to delete review'))
      return { success: false, error: err.message }
    } finally {
      dispatch(setSubmitting(false))
    }
  }, [dispatch])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadUserReview()
    }
  }, [autoLoad, loadUserReview])

  // Helper to check if user can review
  const canSubmitReview = !userReview || userReview.status === 'rejected'

  return {
    // State
    userReview,
    isLoading,
    error,
    isSubmitting,
    canSubmitReview,

    // Actions
    loadUserReview,
    createReview,
    updateReview,
    deleteReview,
    clearError: () => dispatch(clearUserReviewError()),
  }
}