import { useState, useEffect } from 'react'

export interface Review {
  _id: string
  userName: string
  userCompany: string
  userRole: string
  rating: number
  title: string
  comment: string
  createdAt: string
  featured?: boolean
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{ _id: number; count: number }>
}

export interface UseAboutDataReturn {
  reviews: Review[]
  summary: ReviewSummary | null
  loading: boolean
  error: string | null
  fetchReviews: () => Promise<void>
}

export const useAboutData = (): UseAboutDataReturn => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reviews?limit=4&featured=true')
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setSummary(data.summary || null)
      } else {
        setError(data.error || 'Failed to load reviews')
      }
    } catch (err) {
      setError('Unable to connect to the server')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return {
    reviews,
    summary,
    loading,
    error,
    fetchReviews
  }
}