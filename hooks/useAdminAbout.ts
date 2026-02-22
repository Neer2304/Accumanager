// hooks/useAdminAbout.ts
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminAboutService } from '@/services/adminAboutService'
import { About, AboutSection, Labels } from '@/types/about'
import {
  setAboutData,
  setLabels,
  updateSection,
  updateLabel,
  setActiveSection,
  setLoading,
  setSaving,
  setError,
  setSuccess,
  clearMessages,
} from '@/store/slices/adminAboutSlice'

interface UseAdminAboutReturn {
  // State
  data: About | null
  labels: Labels | null
  loading: boolean
  saving: boolean
  error: string | null
  success: string | null
  activeSection: AboutSection

  // Actions
  loadAboutData: () => Promise<void>
  loadLabels: () => Promise<void>
  updateSection: (section: AboutSection, updates: Record<string, any>) => Promise<boolean>
  updateLabel: (key: string, value: string) => Promise<boolean>
  updateLabels: (labels: Partial<Labels>) => Promise<boolean>
  bulkUpdate: (data: Partial<About>) => Promise<boolean>
  resetToDefaults: () => Promise<boolean>

  // UI Actions
  setActiveSection: (section: AboutSection) => void
  clearMessages: () => void

  // Getters for specific sections
  getCompanyInfo: () => Partial<About> | null
  getContactInfo: () => About['contact'] | null
  getSocialMedia: () => About['socialMedia'] | null
  getSEO: () => About['seo'] | null
  getTheme: () => About['theme'] | null
  getSystemSettings: () => About['system'] | null
}

export const useAdminAbout = (autoLoad: boolean = true): UseAdminAboutReturn => {
  const dispatch = useDispatch()

  // Selectors
  const data = useSelector((state: any) => state.adminAbout.data)
  const labels = useSelector((state: any) => state.adminAbout.labels)
  const loading = useSelector((state: any) => state.adminAbout.loading)
  const saving = useSelector((state: any) => state.adminAbout.saving)
  const error = useSelector((state: any) => state.adminAbout.error)
  const success = useSelector((state: any) => state.adminAbout.success)
  const activeSection = useSelector((state: any) => state.adminAbout.activeSection)

  // Load all about data
  const loadAboutData = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(clearMessages())

      const data = await AdminAboutService.getAboutData()
      dispatch(setAboutData(data))
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load about data'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Load labels only
  const loadLabels = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(clearMessages())

      const labelsData = await AdminAboutService.getLabels()
      dispatch(setLabels(labelsData))
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load labels'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Update specific section
  const updateSectionHandler = useCallback(async (
    section: AboutSection,
    updates: Record<string, any>
  ): Promise<boolean> => {
    try {
      dispatch(setSaving(true))
      dispatch(clearMessages())

      const updatedData = await AdminAboutService.updateSection(section, updates)
      dispatch(updateSection({ section, data: updatedData }))
      dispatch(setSuccess(`${section} updated successfully`))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || `Failed to update ${section}`))
      return false
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch])

  // Update single label
  const updateLabelHandler = useCallback(async (key: string, value: string): Promise<boolean> => {
    try {
      dispatch(setSaving(true))
      dispatch(clearMessages())

      const updatedLabels = await AdminAboutService.updateLabel(key, value)
      dispatch(updateLabel({ key, value }))
      dispatch(setLabels(updatedLabels))
      dispatch(setSuccess('Label updated successfully'))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update label'))
      return false
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch])

  // Update multiple labels
  const updateLabelsHandler = useCallback(async (labels: Partial<Labels>): Promise<boolean> => {
    try {
      dispatch(setSaving(true))
      dispatch(clearMessages())

      const updatedLabels = await AdminAboutService.updateLabels(labels)
      dispatch(setLabels(updatedLabels))
      dispatch(setSuccess('Labels updated successfully'))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update labels'))
      return false
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch])

  // Bulk update
  const bulkUpdateHandler = useCallback(async (updateData: Partial<About>): Promise<boolean> => {
    try {
      dispatch(setSaving(true))
      dispatch(clearMessages())

      const updatedData = await AdminAboutService.bulkUpdate(updateData)
      dispatch(setAboutData(updatedData))
      dispatch(setSuccess('About data updated successfully'))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update about data'))
      return false
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch])

  // Reset to defaults
  const resetToDefaultsHandler = useCallback(async (): Promise<boolean> => {
    try {
      dispatch(setSaving(true))
      dispatch(clearMessages())

      const defaultData = await AdminAboutService.resetToDefaults()
      dispatch(setAboutData(defaultData))
      dispatch(setSuccess('About data reset to defaults'))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to reset data'))
      return false
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch])

  // Getters
  const getCompanyInfo = useCallback(() => {
    if (!data) return null
    const { companyName, companyDescription, companyLogo } = data
    return { companyName, companyDescription, companyLogo }
  }, [data])

  const getContactInfo = useCallback(() => data?.contact || null, [data])
  const getSocialMedia = useCallback(() => data?.socialMedia || null, [data])
  const getSEO = useCallback(() => data?.seo || null, [data])
  const getTheme = useCallback(() => data?.theme || null, [data])
  const getSystemSettings = useCallback(() => data?.system || null, [data])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadAboutData()
    }
  }, [autoLoad, loadAboutData])

  return {
    // State
    data,
    labels,
    loading,
    saving,
    error,
    success,
    activeSection,

    // Actions
    loadAboutData,
    loadLabels,
    updateSection: updateSectionHandler,
    updateLabel: updateLabelHandler,
    updateLabels: updateLabelsHandler,
    bulkUpdate: bulkUpdateHandler,
    resetToDefaults: resetToDefaultsHandler,

    // UI Actions
    setActiveSection: (section) => dispatch(setActiveSection(section)),
    clearMessages: () => dispatch(clearMessages()),

    // Getters
    getCompanyInfo,
    getContactInfo,
    getSocialMedia,
    getSEO,
    getTheme,
    getSystemSettings,
  }
}