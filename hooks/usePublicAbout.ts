// hooks/usePublicAbout.ts
import { useState, useEffect, useCallback } from 'react'
import { PublicAboutService } from '@/services/publicAboutService'
import { PublicAbout, Labels } from '@/types/about'

interface UsePublicAboutReturn {
  // State
  data: PublicAbout | null
  labels: Labels | null
  loading: boolean
  error: string | null

  // Getters
  getLabel: (key: string, defaultValue?: string) => string
  getCompanyInfo: () => Partial<PublicAbout> | null
  getContactInfo: () => PublicAbout['contact'] | null
  getSocialMedia: () => PublicAbout['socialMedia'] | null
  getTheme: () => PublicAbout['theme'] | null

  // Actions
  refreshData: () => Promise<void>
}

export const usePublicAbout = (autoLoad: boolean = true): UsePublicAboutReturn => {
  const [data, setData] = useState<PublicAbout | null>(null)
  const [labels, setLabels] = useState<Labels | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const aboutData = await PublicAboutService.getAboutData()
      setData(aboutData)
      setLabels(aboutData.labels || null)
    } catch (err: any) {
      setError(err.message || 'Failed to load about data')
    } finally {
      setLoading(false)
    }
  }, [])

  const getLabel = useCallback((key: string, defaultValue?: string): string => {
    if (labels && labels[key]) {
      return labels[key]
    }
    return defaultValue || key
  }, [labels])

  const getCompanyInfo = useCallback(() => {
    if (!data) return null
    const { companyName, companyDescription, companyLogo } = data
    return { companyName, companyDescription, companyLogo }
  }, [data])

  const getContactInfo = useCallback(() => data?.contact || null, [data])
  const getSocialMedia = useCallback(() => data?.socialMedia || null, [data])
  const getTheme = useCallback(() => data?.theme || null, [data])

  useEffect(() => {
    if (autoLoad) {
      loadData()
    }
  }, [autoLoad, loadData])

  return {
    data,
    labels,
    loading,
    error,
    getLabel,
    getCompanyInfo,
    getContactInfo,
    getSocialMedia,
    getTheme,
    refreshData: loadData,
  }
}