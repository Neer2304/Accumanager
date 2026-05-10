import { useState, useEffect } from 'react'

// Define interfaces for better type safety
interface AboutLabels {
  hero?: {
    title?: string;
    subtitle?: string;
    cta?: string;
  };
  features?: {
    title?: string;
    [key: string]: unknown;
  };
  team?: {
    title?: string;
    description?: string;
  };
  contact?: {
    title?: string;
    email?: string;
    phone?: string;
  };
  [key: string]: unknown;
}

interface AboutData {
  companyName: string;
  companyDescription: string;
  hero?: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features?: {
    title: string;
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  team?: {
    title: string;
    members?: Array<{
      name: string;
      role: string;
      bio: string;
      image?: string;
    }>;
  };
  contact?: {
    title: string;
    email: string;
    phone: string;
    address: string;
  };
  labels: AboutLabels;
  [key: string]: unknown;
}

interface UpdateResponse {
  success: boolean;
  data?: AboutData;
  error?: string;
  message?: string;
}

interface ErrorWithMessage {
  message: string;
  name?: string;
  code?: number;
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  const updateAboutData = async (section: string, updates: Record<string, unknown>) => {
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
      
      const data = await response.json() as UpdateResponse
      
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  const updateLabels = async (newLabels: AboutLabels) => {
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
      
      const data = await response.json() as UpdateResponse
      
      if (data.success) {
        setAboutData(prev => ({
          ...prev!,
          labels: data.data as AboutLabels
        }))
        return { success: true, data: data.data }
      } else {
        setError(data.message || 'Failed to update labels')
        return { success: false, error: data.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Get specific label value with proper typing
  const getLabel = <T = unknown>(path: string): T | null => {
    if (!aboutData?.labels) return null
    
    const keys = path.split('.')
    let value: unknown = aboutData.labels
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        return null
      }
    }
    
    return value as T
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