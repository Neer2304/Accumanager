// store/slices/pipelineStagesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PipelineStage, PipelineStageStats, PipelineStageFilters } from '@/types/pipeline'

export interface PipelineStagesState {
  items: PipelineStage[]
  filteredItems: PipelineStage[]
  selectedStage: PipelineStage | null
  stats: PipelineStageStats | null
  filters: PipelineStageFilters
  searchQuery: string
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  success: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const initialState: PipelineStagesState = {
  items: [],
  filteredItems: [],
  selectedStage: null,
  stats: null,
  filters: {},
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: null,
  pagination: {
    page: 1,
    limit: 100,
    total: 0,
    pages: 0,
  },
}

const pipelineStagesSlice = createSlice({
  name: 'pipelineStages',
  initialState,
  reducers: {
    // Data actions
    setStages: (state, action: PayloadAction<PipelineStage[]>) => {
      state.items = action.payload
      state.filteredItems = action.payload
      state.pagination.total = action.payload.length
    },
    
    setFilteredStages: (state, action: PayloadAction<PipelineStage[]>) => {
      state.filteredItems = action.payload
    },
    
    addStage: (state, action: PayloadAction<PipelineStage>) => {
      state.items.push(action.payload)
      state.filteredItems = [...state.items]
      state.pagination.total += 1
    },
    
    updateStage: (state, action: PayloadAction<PipelineStage>) => {
      const index = state.items.findIndex(s => s._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
      
      const filteredIndex = state.filteredItems.findIndex(s => s._id === action.payload._id)
      if (filteredIndex !== -1) {
        state.filteredItems[filteredIndex] = action.payload
      }
      
      if (state.selectedStage?._id === action.payload._id) {
        state.selectedStage = action.payload
      }
    },
    
    removeStage: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(s => s._id !== action.payload)
      state.filteredItems = state.filteredItems.filter(s => s._id !== action.payload)
      state.pagination.total -= 1
      
      if (state.selectedStage?._id === action.payload) {
        state.selectedStage = null
      }
    },
    
    setSelectedStage: (state, action: PayloadAction<PipelineStage | null>) => {
      state.selectedStage = action.payload
    },
    
    setStats: (state, action: PayloadAction<PipelineStageStats>) => {
      state.stats = action.payload
    },
    
    // Filter actions
    setFilters: (state, action: PayloadAction<PipelineStageFilters>) => {
      state.filters = action.payload
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    
    clearFilters: (state) => {
      state.filters = {}
      state.searchQuery = ''
      state.filteredItems = state.items
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    
    // Error/Success states
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload
    },
    
    clearMessages: (state) => {
      state.error = null
      state.success = null
    },
    
    // Pagination
    setPagination: (state, action: PayloadAction<Partial<typeof state.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    
    // Reset
    resetState: () => initialState,
  },
})

export const {
  setStages,
  setFilteredStages,
  addStage,
  updateStage,
  removeStage,
  setSelectedStage,
  setStats,
  setFilters,
  setSearchQuery,
  clearFilters,
  setLoading,
  setSubmitting,
  setError,
  setSuccess,
  clearMessages,
  setPagination,
  resetState,
} = pipelineStagesSlice.actions

export default pipelineStagesSlice.reducer