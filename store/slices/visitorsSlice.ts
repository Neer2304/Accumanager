// store/slices/visitorsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  Visitor, 
  VisitorsStats, 
  VisitorsPagination, 
  VisitorsFilters,
  VisitorsState,
  TrackVisitorPayload 
} from '@/types/visitor.types'
import { RootState } from '@/store/store'

// Initial state
const initialState: VisitorsState = {
  visitors: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  },
  filters: {
    range: 'week',
    search: '',
    page: 1,
    limit: 50
  },
  selectedVisitors: [],
  loading: false,
  error: null,
  tracking: {
    sessionId: null,
    isTracking: false,
    currentVisitorId: null
  }
}

// Helper function
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Async thunks
export const fetchVisitors = createAsyncThunk(
  'visitors/fetchVisitors',
  async (filters: VisitorsFilters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        range: filters.range,
        search: filters.search || '',
      })

      const response = await fetch(`/api/admin/visitors?${queryParams}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch visitors')
      }

      return {
        visitors: result.data.visitors,
        stats: result.data.stats,
        pagination: result.data.pagination
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch visitors')
    }
  }
)

export const trackVisitor = createAsyncThunk(
  'visitors/trackVisitor',
  async (data: TrackVisitorPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const sessionId = state.visitors.tracking.sessionId || generateSessionId()

      const response = await fetch('/api/admin/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sessionId,
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to track visitor')
      }

      return {
        sessionId,
        visitorId: result.visitorId,
        isNew: result.isNew
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to track visitor')
    }
  }
)

export const deleteVisitor = createAsyncThunk(
  'visitors/deleteVisitor',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/visitors?id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete visitor')
      }

      return id
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete visitor')
    }
  }
)

export const deleteVisitorsBulk = createAsyncThunk(
  'visitors/deleteVisitorsBulk',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await Promise.all(
        ids.map(id => 
          fetch(`/api/admin/visitors?id=${id}`, { method: 'DELETE' })
        )
      )
      return ids
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete visitors')
    }
  }
)

// Slice
const visitorsSlice = createSlice({
  name: 'visitors',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<VisitorsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload
      state.filters.page = 1
    },
    toggleVisitorSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedVisitors.indexOf(action.payload)
      if (index === -1) {
        state.selectedVisitors.push(action.payload)
      } else {
        state.selectedVisitors.splice(index, 1)
      }
    },
    selectAllVisitors: (state) => {
      state.selectedVisitors = state.visitors.map(v => v._id)
    },
    deselectAllVisitors: (state) => {
      state.selectedVisitors = []
    },
    clearSelection: (state) => {
      state.selectedVisitors = []
    },
    clearError: (state) => {
      state.error = null
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    startTracking: (state) => {
      state.tracking.isTracking = true
      if (!state.tracking.sessionId) {
        state.tracking.sessionId = generateSessionId()
      }
    },
    stopTracking: (state) => {
      state.tracking.isTracking = false
    },
    clearTracking: (state) => {
      state.tracking = initialState.tracking
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch visitors
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false
        state.visitors = action.payload.visitors
        state.stats = action.payload.stats
        state.pagination = action.payload.pagination
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Track visitor
      .addCase(trackVisitor.fulfilled, (state, action) => {
        state.tracking.sessionId = action.payload.sessionId
        state.tracking.currentVisitorId = action.payload.visitorId
      })

      // Delete visitor
      .addCase(deleteVisitor.fulfilled, (state, action) => {
        state.visitors = state.visitors.filter(v => v._id !== action.payload)
        state.selectedVisitors = state.selectedVisitors.filter(id => id !== action.payload)
      })

      // Bulk delete
      .addCase(deleteVisitorsBulk.fulfilled, (state, action) => {
        state.visitors = state.visitors.filter(v => !action.payload.includes(v._id))
        state.selectedVisitors = []
      })
  }
})

// Actions
export const {
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
  clearTracking,
} = visitorsSlice.actions

// Selectors
export const selectVisitors = (state: RootState) => state.visitors.visitors
export const selectVisitorsStats = (state: RootState) => state.visitors.stats
export const selectVisitorsPagination = (state: RootState) => state.visitors.pagination
export const selectVisitorsFilters = (state: RootState) => state.visitors.filters
export const selectSelectedVisitors = (state: RootState) => state.visitors.selectedVisitors
export const selectVisitorsLoading = (state: RootState) => state.visitors.loading
export const selectVisitorsError = (state: RootState) => state.visitors.error
export const selectTracking = (state: RootState) => state.visitors.tracking
export const selectActiveNow = (state: RootState) => state.visitors.stats?.activeNow || 0
export const selectTodayVisitors = (state: RootState) => state.visitors.stats?.todayVisitors || 0
export const selectUniqueIPs = (state: RootState) => state.visitors.stats?.uniqueIPs || 0

export default visitorsSlice.reducer