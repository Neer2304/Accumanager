// components/googleabout/useAboutData.ts
import { useState, useEffect } from 'react'
import { Review, Summary } from '../types'

export const useAboutData = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/about')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data')
      }

      if (data.success) {
        setReviews(data.data.reviews)
        setSummary(data.data.summary)
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Error fetching about data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { reviews, summary, loading, error, refetch: fetchAboutData }
}