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
    updateSection: (state, action: PayloadAction<{ section: AboutSection; data: Record<string, unknown> }>) => {
      if (!state.data) return

      const { section, data } = action.payload
      
      switch (section) {
        case 'company':
          state.data = { ...state.data, ...data }
          break
        case 'contact':
          state.data.contact = { ...state.data.contact, ...data }
          break
        case 'socialMedia':
          state.data.socialMedia = { ...state.data.socialMedia, ...data }
          break
        case 'labels':
          state.data.labels = { ...state.data.labels, ...data }
          state.labels = state.data.labels
          break
        case 'seo':
          state.data.seo = { ...state.data.seo, ...data }
          break
        case 'theme':
          state.data.theme = { ...state.data.theme, ...data }
          break
        case 'system':
          state.data.system = { ...state.data.system, ...data }
          break
      }
    },
    updateLabel: (state, action: PayloadAction<{ key: string; value: string }>) => {
      if (state.labels) {
        state.labels[action.payload.key] = action.payload.value
      }
      if (state.data?.labels) {
        state.data.labels[action.payload.key] = action.payload.value
      }
    },
    clearData: (state) => {
      state.data = null
      state.labels = null
    },
    setActiveSection: (state, action: PayloadAction<AboutSection>) => {
      state.activeSection = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload
    },
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