// hooks/useVisitors.ts
'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchVisitors,
  trackVisitor,
  deleteVisitor,
  deleteVisitorsBulk,
  setFilters,
  setPage,
  setLimit,
  toggleVisitorSelection,
  selectAllVisitors,
  deselectAllVisitors,
  clearSelection,
  clearError,
  resetFilters,
  startTracking,
  stopTracking,
  selectVisitors,
  selectVisitorsStats,
  selectVisitorsPagination,
  selectVisitorsFilters,
  selectSelectedVisitors,
  selectVisitorsLoading,
  selectVisitorsError,
  selectTracking,
  selectActiveNow,
  selectTodayVisitors,
  selectUniqueIPs,
} from '@/store/slices/visitorsSlice'
import { VisitorsFilters, TrackVisitorPayload } from '@/types/visitor.types'

export const useVisitors = () => {
  const dispatch = useAppDispatch()

  // Selectors
  const visitors = useAppSelector(selectVisitors)
  const stats = useAppSelector(selectVisitorsStats)
  const pagination = useAppSelector(selectVisitorsPagination)
  const filters = useAppSelector(selectVisitorsFilters)
  const selectedVisitors = useAppSelector(selectSelectedVisitors)
  const loading = useAppSelector(selectVisitorsLoading)
  const error = useAppSelector(selectVisitorsError)
  const tracking = useAppSelector(selectTracking)
  const activeNow = useAppSelector(selectActiveNow)
  const todayVisitors = useAppSelector(selectTodayVisitors)
  const uniqueIPs = useAppSelector(selectUniqueIPs)

  // Actions
  const loadVisitors = useCallback(() => {
    dispatch(fetchVisitors(filters))
  }, [dispatch, filters])

  const updateFilters = useCallback((newFilters: Partial<VisitorsFilters>) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const changePage = useCallback((page: number) => {
    dispatch(setPage(page))
  }, [dispatch])

  const changeLimit = useCallback((limit: number) => {
    dispatch(setLimit(limit))
  }, [dispatch])

  const toggleSelect = useCallback((id: string) => {
    dispatch(toggleVisitorSelection(id))
  }, [dispatch])

  const selectAll = useCallback(() => {
    dispatch(selectAllVisitors())
  }, [dispatch])

  const deselectAll = useCallback(() => {
    dispatch(deselectAllVisitors())
  }, [dispatch])

  const clearSelected = useCallback(() => {
    dispatch(clearSelection())
  }, [dispatch])

  const removeVisitor = useCallback(async (id: string) => {
    await dispatch(deleteVisitor(id))
  }, [dispatch])

  const removeVisitorsBulk = useCallback(async (ids: string[]) => {
    await dispatch(deleteVisitorsBulk(ids))
  }, [dispatch])

  const track = useCallback(async (data: TrackVisitorPayload) => {
    await dispatch(trackVisitor(data))
  }, [dispatch])

  const startTrackingSession = useCallback(() => {
    dispatch(startTracking())
  }, [dispatch])

  const stopTrackingSession = useCallback(() => {
    dispatch(stopTracking())
  }, [dispatch])

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const clearErrorState = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Auto-load when filters change
  useEffect(() => {
    loadVisitors()
  }, [loadVisitors])

  return {
    // Data
    visitors,
    stats,
    pagination,
    filters,
    selectedVisitors,
    loading,
    error,
    tracking,
    activeNow,
    todayVisitors,
    uniqueIPs,

    // Actions
    loadVisitors,
    updateFilters,
    changePage,
    changeLimit,
    toggleSelect,
    selectAll,
    deselectAll,
    clearSelected,
    removeVisitor,
    removeVisitorsBulk,
    track,
    startTrackingSession,
    stopTrackingSession,
    resetAllFilters,
    clearErrorState,

    // Helpers
    hasSelected: selectedVisitors.length > 0,
    selectedCount: selectedVisitors.length,
    isAllSelected: visitors.length > 0 && selectedVisitors.length === visitors.length,
    isSomeSelected: selectedVisitors.length > 0 && selectedVisitors.length < visitors.length,
  }
}

// Hook for tracking visitor on page load
export const useVisitorTracking = (options?: {
  pageUrl?: string
  userId?: string
  autoTrack?: boolean
}) => {
  const { track, startTrackingSession, stopTrackingSession, tracking } = useVisitors()
  const [isClient, setIsClient] = useState(false)
  
  const { 
    pageUrl = '/', 
    userId, 
    autoTrack = true 
  } = options || {}

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    if (autoTrack && !tracking.sessionId) {
      startTrackingSession()
      
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      
      track({
        pageUrl: window.location.pathname,
        userId,
        screenResolution: `${screenWidth}x${screenHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    }

    return () => {
      if (autoTrack && isClient) {
        stopTrackingSession()
      }
    }
  }, [autoTrack, pageUrl, userId, tracking.sessionId, isClient])

  return { track, startTrackingSession, stopTrackingSession, tracking }
}