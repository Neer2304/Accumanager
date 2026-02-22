// store/slices/materialsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Material } from '@/types/material'

interface MaterialsState {
  items: Material[]
  selectedMaterial: Material | null
  isLoading: boolean
  error: string | null
  filters: {
    search: string
    category: string
    status: string
  }
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const initialState: MaterialsState = {
  items: [],
  selectedMaterial: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    status: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
}

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    // Data actions
    setMaterials: (state, action: PayloadAction<Material[]>) => {
      state.items = action.payload
    },
    setSelectedMaterial: (state, action: PayloadAction<Material | null>) => {
      state.selectedMaterial = action.payload
    },
    addMaterial: (state, action: PayloadAction<Material>) => {
      state.items.unshift(action.payload)
    },
    updateMaterial: (state, action: PayloadAction<Material>) => {
      const index = state.items.findIndex(m => m._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
      if (state.selectedMaterial?._id === action.payload._id) {
        state.selectedMaterial = action.payload
      }
    },
    removeMaterial: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(m => m._id !== action.payload)
      if (state.selectedMaterial?._id === action.payload) {
        state.selectedMaterial = null
      }
    },

    // Filter actions
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.pagination.page = 1
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload
      state.pagination.page = 1
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },

    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setPagination: (state, action: PayloadAction<{ total: number; pages: number }>) => {
      state.pagination.total = action.payload.total
      state.pagination.pages = action.payload.pages
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetState: () => initialState,
  },
})

export const {
  setMaterials,
  setSelectedMaterial,
  addMaterial,
  updateMaterial,
  removeMaterial,
  setSearch,
  setCategoryFilter,
  setStatusFilter,
  clearFilters,
  setPage,
  setPagination,
  setLoading,
  setError,
  clearError,
  resetState,
} = materialsSlice.actions

export default materialsSlice.reducer