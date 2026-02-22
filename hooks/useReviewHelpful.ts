// hooks/useReviewHelpful.ts
import { useState, useCallback } from 'react'
import { ReviewService } from '@/services/reviewService'
import { useDispatch } from 'react-redux'
import { toggleHelpfulInList } from '@/store/slices/reviewsSlice'

interface UseReviewHelpfulOptions {
  onSuccess?: (helpful: boolean, newCount: number) => void
  onError?: (error: string) => void
}

export const useReviewHelpful = (options: UseReviewHelpfulOptions = {}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const toggleHelpful = useCallback(async (reviewId: string, currentHelpful: boolean) => {
    try {
      // Set loading for this specific review
      setLoading(prev => ({ ...prev, [reviewId]: true }))
      setError(null)

      const result = await ReviewService.toggleHelpful(reviewId)
      
      // Update Redux state
      dispatch(toggleHelpfulInList({
        reviewId,
        helpful: result.helpful,
        newCount: result.newCount,
      }))

      // Callback
      options.onSuccess?.(result.helpful, result.newCount)

      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update helpful'
      setError(errorMessage)
      options.onError?.(errorMessage)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, [reviewId]: false }))
    }
  }, [dispatch, options])

  const isLoading = useCallback((reviewId: string) => {
    return !!loading[reviewId]
  }, [loading])

  return {
    toggleHelpful,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}