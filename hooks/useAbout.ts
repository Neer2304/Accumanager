import { useState, useEffect } from 'react'

interface AboutData {
  companyName: string
  companyDescription: string
  labels: {
    [key: string]: any
  }
  [key: string]: any
}

export function useAbout() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchAboutData = async (section?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = section 
        ? `/api/admin/about?section=${section}`
        : '/api/admin/about'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setAboutData(data.data)
      } else {
        setError(data.message || 'Failed to fetch data')
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }
  
  const updateAboutData = async (section: string, updates: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, updates })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setAboutData(prev => ({
          ...prev!,
          [section]: updates
        }))
        return { success: true, data: data.data }
      } else {
        setError(data.message || 'Failed to update')
        return { success: false, error: data.message }
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  const updateLabels = async (newLabels: Record<string, any>) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/about/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLabels)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAboutData(prev => ({
          ...prev!,
          labels: data.data
        }))
        return { success: true, data: data.data }
      } else {
        setError(data.message || 'Failed to update labels')
        return { success: false, error: data.message }
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }
  
  // Get specific label value
  const getLabel = (path: string) => {
    if (!aboutData?.labels) return null
    
    const keys = path.split('.')
    let value: any = aboutData.labels
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return null
      }
    }
    
    return value
  }
  
  useEffect(() => {
    fetchAboutData()
  }, [])
  
  return {
    aboutData,
    loading,
    error,
    fetchAboutData,
    updateAboutData,
    updateLabels,
    getLabel,
    refresh: () => fetchAboutData()
  }
}