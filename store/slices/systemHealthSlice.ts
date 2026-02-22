// store/slices/systemHealthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SystemService, SystemAlert, UserStats } from '@/services/systemHealthService'

export interface SystemHealthState {
  services: SystemService[]
  alerts: SystemAlert[]
  userStats: UserStats | null
  lastUpdated: string | null
  isLoading: boolean
  error: string | null
  autoRefresh: boolean
  refreshInterval: number
  selectedServiceId: string | null
  showResolvedAlerts: boolean
}

const initialState: SystemHealthState = {
  services: [],
  alerts: [],
  userStats: null,
  lastUpdated: null,
  isLoading: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 30000,
  selectedServiceId: null,
  showResolvedAlerts: false,
}

const systemHealthSlice = createSlice({
  name: 'systemHealth',
  initialState,
  reducers: {
    // Data actions
    setSystemHealth: (state, action: PayloadAction<{
      services: SystemService[]
      alerts: SystemAlert[]
      userStats: UserStats
      lastUpdated: string
    }>) => {
      state.services = action.payload.services
      state.alerts = action.payload.alerts
      state.userStats = action.payload.userStats
      state.lastUpdated = action.payload.lastUpdated
    },
    
    updateServices: (state, action: PayloadAction<SystemService[]>) => {
      state.services = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    
    updateAlerts: (state, action: PayloadAction<SystemAlert[]>) => {
      state.alerts = action.payload
    },
    
    addAlert: (state, action: PayloadAction<SystemAlert>) => {
      state.alerts.unshift(action.payload)
    },
    
    resolveAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload)
      if (alert) {
        alert.resolved = true
      }
    },
    
    updateServiceStatus: (state, action: PayloadAction<{
      serviceId: string
      status: SystemService['status']
    }>) => {
      const service = state.services.find(s => s.id === action.payload.serviceId)
      if (service) {
        service.status = action.payload.status
      }
    },
    
    // UI state actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload
    },
    
    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedServiceId = action.payload
    },
    
    setShowResolvedAlerts: (state, action: PayloadAction<boolean>) => {
      state.showResolvedAlerts = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    resetState: () => initialState,
  },
})

export const {
  setSystemHealth,
  updateServices,
  updateAlerts,
  addAlert,
  resolveAlert,
  updateServiceStatus,
  setLoading,
  setError,
  setAutoRefresh,
  setRefreshInterval,
  setSelectedService,
  setShowResolvedAlerts,
  clearError,
  resetState,
} = systemHealthSlice.actions

export default systemHealthSlice.reducer