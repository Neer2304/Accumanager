import { useState, useEffect, useCallback } from 'react'

interface AdvanceSettings {
  preferences: any
  notifications: any
  integrations: any
  billing: any
  security: any
  appearance: any
  analytics: any
  customization: any
  lastUpdated: string
  version: string
}

interface UseAdvanceSettingsReturn {
  settings: AdvanceSettings | null
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (section: string, data: any) => Promise<boolean>
  resetSettings: () => Promise<boolean>
  deleteSettings: () => Promise<boolean>
}

export function useAdvanceSettings(): UseAdvanceSettingsReturn {
  const [settings, setSettings] = useState<AdvanceSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/advance/settings', {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to access settings')
        }
        throw new Error(`Failed to fetch settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
      } else {
        throw new Error(result.message || 'Failed to load settings')
      }
    } catch (err: any) {
      console.error('Error fetching advance settings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = async (section: string, data: any): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/advance/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ section, ...data })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to update settings')
        }
        throw new Error(`Failed to update settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
        return true
      } else {
        throw new Error(result.message || 'Failed to update settings')
      }
    } catch (err: any) {
      console.error('Error updating advance settings:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetSettings = async (): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/advance/settings', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to reset settings')
        }
        throw new Error(`Failed to reset settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
        return true
      } else {
        throw new Error(result.message || 'Failed to reset settings')
      }
    } catch (err: any) {
      console.error('Error resetting advance settings:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteSettings = async (): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/advance/settings', {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to delete settings')
        }
        throw new Error(`Failed to delete settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setSettings(null)
        return true
      } else {
        throw new Error(result.message || 'Failed to delete settings')
      }
    } catch (err: any) {
      console.error('Error deleting advance settings:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    resetSettings,
    deleteSettings
  }
}