// hooks/useSystemHealth.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SystemHealthService, SystemHealthData, SystemService, SystemAlert } from '@/services/systemHealthService'
import {
  setSystemHealth,
  updateServices,
  updateAlerts,
  resolveAlert as resolveAlertAction,
  setLoading,
  setError,
  setAutoRefresh,
  setRefreshInterval,
  setSelectedService,
  setShowResolvedAlerts,
  clearError,
} from '@/store/slices/systemHealthSlice'

interface UseSystemHealthOptions {
  autoLoad?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onAlert?: (alert: SystemAlert) => void
  onStatusChange?: (services: SystemService[]) => void
}

interface UseSystemHealthReturn {
  // State
  services: SystemService[]
  alerts: SystemAlert[]
  userStats: any
  lastUpdated: string | null
  isLoading: boolean
  error: string | null
  autoRefresh: boolean
  refreshInterval: number
  selectedServiceId: string | null
  showResolvedAlerts: boolean

  // Actions
  loadSystemHealth: () => Promise<void>
  loadDatabaseStats: () => Promise<any>
  resolveAlert: (alertId: string) => Promise<boolean>
  getHealthSummary: () => Promise<any>
  startAutoRefresh: (interval?: number) => void
  stopAutoRefresh: () => void
  selectService: (serviceId: string | null) => void
  toggleShowResolved: () => void
  resetError: () => void

  // Helpers
  getActiveAlerts: () => SystemAlert[]
  getCriticalAlerts: () => SystemAlert[]
  getServiceById: (serviceId: string) => SystemService | undefined
  getServicesByStatus: (status: SystemService['status']) => SystemService[]
  getOverallStatus: () => 'healthy' | 'degraded' | 'down'
  getServiceColor: (status: SystemService['status']) => string
  getAlertColor: (severity: SystemAlert['severity']) => string
  formatBytes: (bytes: number) => string
}

export const useSystemHealth = (options: UseSystemHealthOptions = {}): UseSystemHealthReturn => {
  const dispatch = useDispatch()
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Redux selectors
  const services = useSelector((state: any) => state.systemHealth.services)
  const alerts = useSelector((state: any) => state.systemHealth.alerts)
  const userStats = useSelector((state: any) => state.systemHealth.userStats)
  const lastUpdated = useSelector((state: any) => state.systemHealth.lastUpdated)
  const isLoading = useSelector((state: any) => state.systemHealth.isLoading)
  const error = useSelector((state: any) => state.systemHealth.error)
  const autoRefresh = useSelector((state: any) => state.systemHealth.autoRefresh)
  const refreshInterval = useSelector((state: any) => state.systemHealth.refreshInterval)
  const selectedServiceId = useSelector((state: any) => state.systemHealth.selectedServiceId)
  const showResolvedAlerts = useSelector((state: any) => state.systemHealth.showResolvedAlerts)

  // Load system health
  const loadSystemHealth = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const data = await SystemHealthService.getSystemHealth()
      
      dispatch(setSystemHealth({
        services: data.services,
        alerts: data.alerts,
        userStats: data.userStats,
        lastUpdated: data.lastUpdated,
      }))

      // Callback for status changes
      if (options.onStatusChange) {
        options.onStatusChange(data.services)
      }

      // Check for new alerts
      const newCriticalAlerts = data.alerts.filter(
        alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical')
      )
      
      if (newCriticalAlerts.length > 0 && options.onAlert) {
        newCriticalAlerts.forEach(alert => options.onAlert?.(alert))
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load system health'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, options])

  // Load database stats
  const loadDatabaseStats = useCallback(async () => {
    try {
      return await SystemHealthService.getDatabaseStats()
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load database stats'))
      throw err
    }
  }, [dispatch])

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      await SystemHealthService.resolveAlert(alertId)
      dispatch(resolveAlertAction(alertId))
      return true
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to resolve alert'))
      return false
    }
  }, [dispatch])

  // Get health summary
  const getHealthSummary = useCallback(async () => {
    return await SystemHealthService.getHealthSummary()
  }, [])

  // Auto-refresh controls
  const startAutoRefresh = useCallback((interval?: number) => {
    const newInterval = interval || refreshInterval
    
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
    }

    refreshTimerRef.current = setInterval(() => {
      loadSystemHealth()
    }, newInterval)

    dispatch(setAutoRefresh(true))
    if (interval) {
      dispatch(setRefreshInterval(interval))
    }
  }, [dispatch, refreshInterval, loadSystemHealth])

  const stopAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
    dispatch(setAutoRefresh(false))
  }, [dispatch])

  // UI state actions
  const selectService = useCallback((serviceId: string | null) => {
    dispatch(setSelectedService(serviceId))
  }, [dispatch])

  const toggleShowResolved = useCallback(() => {
    dispatch(setShowResolvedAlerts(!showResolvedAlerts))
  }, [dispatch, showResolvedAlerts])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Auto-load on mount
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadSystemHealth()
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [loadSystemHealth, options.autoLoad])

  // Auto-refresh setup
  useEffect(() => {
    if (options.autoRefresh) {
      startAutoRefresh(options.refreshInterval)
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [options.autoRefresh, options.refreshInterval, startAutoRefresh])

  // Helper functions
  const getActiveAlerts = useCallback(() => {
    return alerts.filter((alert: SystemAlert) => !alert.resolved)
  }, [alerts])

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(
      (alert: SystemAlert) => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical')
    )
  }, [alerts])

  const getServiceById = useCallback((serviceId: string) => {
    return services.find((s: SystemService) => s.id === serviceId)
  }, [services])

  const getServicesByStatus = useCallback((status: SystemService['status']) => {
    return services.filter((s: SystemService) => s.status === status)
  }, [services])

  const getOverallStatus = useCallback((): 'healthy' | 'degraded' | 'down' => {
    const hasDown = services.some((s: SystemService) => s.status === 'down')
    const hasDegraded = services.some((s: SystemService) => s.status === 'degraded')
    const hasCritical = alerts.some(
      (a: SystemAlert) => !a.resolved && a.severity === 'critical'
    )

    if (hasDown) return 'down'
    if (hasDegraded || hasCritical) return 'degraded'
    return 'healthy'
  }, [services, alerts])

  const getServiceColor = useCallback((status: SystemService['status']) => {
    return SystemHealthService.getServiceColor(status)
  }, [])

  const getAlertColor = useCallback((severity: SystemAlert['severity']) => {
    return SystemHealthService.getAlertColor(severity)
  }, [])

  const formatBytes = useCallback((bytes: number) => {
    return SystemHealthService.formatBytes(bytes)
  }, [])

  return {
    // State
    services,
    alerts,
    userStats,
    lastUpdated,
    isLoading,
    error,
    autoRefresh,
    refreshInterval,
    selectedServiceId,
    showResolvedAlerts,

    // Actions
    loadSystemHealth,
    loadDatabaseStats,
    resolveAlert,
    getHealthSummary,
    startAutoRefresh,
    stopAutoRefresh,
    selectService,
    toggleShowResolved,
    resetError,

    // Helpers
    getActiveAlerts,
    getCriticalAlerts,
    getServiceById,
    getServicesByStatus,
    getOverallStatus,
    getServiceColor,
    getAlertColor,
    formatBytes,
  }
}