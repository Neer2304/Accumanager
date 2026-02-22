// store/slices/adminAboutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { About, AboutSection, Labels } from '@/types/about'

interface AdminAboutState {
  data: About | null
  labels: Labels | null
  loading: boolean
  saving: boolean
  error: string | null
  success: string | null
  activeSection: AboutSection
}

const initialState: AdminAboutState = {
  data: null,
  labels: null,
  loading: false,
  saving: false,
  error: null,
  success: null,
  activeSection: 'company',
}

const adminAboutSlice = createSlice({
  name: 'adminAbout',
  initialState,
  reducers: {
    // Data actions
    setAboutData: (state, action: PayloadAction<About>) => {
      state.data = action.payload
      if (action.payload.labels) {
        state.labels = action.payload.labels
      }
    },
    setLabels: (state, action: PayloadAction<Labels>) => {
      state.labels = action.payload
      if (state.data) {
        state.data.labels = action.payload
      }
    },
    updateSection: (state, action: PayloadAction<{ section: AboutSection; data: any }>) => {
      if (state.data) {
        if (action.payload.section === 'company') {
          // Company fields are at root
          state.data = { ...state.data, ...action.payload.data }
        } else {
          // Nested sections
          state.data[action.payload.section] = {
            ...state.data[action.payload.section],
            ...action.payload.data
          }
        }
      }
    },
    updateLabel: (state, action: PayloadAction<{ key: string; value: string }>) => {
      if (state.labels) {
        state.labels[action.payload.key] = action.payload.value
      }
    },
    clearData: (state) => {
      state.data = null
      state.labels = null
    },

    // UI state
    setActiveSection: (state, action: PayloadAction<AboutSection>) => {
      state.activeSection = action.payload
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload
    },

    // Error/Success
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

    // Reset
    resetState: () => initialState,
  },
})

export const {
  setAboutData,
  setLabels,
  updateSection,
  updateLabel,
  clearData,
  setActiveSection,
  setLoading,
  setSaving,
  setError,
  setSuccess,
  clearMessages,
  resetState,
} = adminAboutSlice.actions

export default adminAboutSlice.reducer