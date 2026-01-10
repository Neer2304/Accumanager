// store/slices/authSlice.ts - UPDATED
import { createSlice } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  role: string
  shopName?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log('🔄 Setting credentials - stopping loading')
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
      state.isLoading = false
    },
    // ADD THIS NEW ACTION
    restoreAuth: (state, action) => {
      console.log('🔄 Restoring auth from storage')
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
      state.isLoading = false
    },
    logout: (state) => {
      console.log('🔄 Logging out - stopping loading')
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false
    },
    setLoading: (state, action) => {
      console.log('🔄 Setting loading to:', action.payload)
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      console.log('🔄 Setting error - stopping loading')
      state.error = action.payload
      state.isLoading = false
    },
    resetLoading: (state) => {
      console.log('🔄 Resetting loading state')
      state.isLoading = false
    },
  },
})

export const { setCredentials, restoreAuth, logout, setLoading, setError, resetLoading } = authSlice.actions
export default authSlice.reducer