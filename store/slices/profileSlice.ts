// store/slices/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  lowStockAlerts: boolean
  monthlyReports: boolean
}

export interface UserSubscription {
  plan: string
  status: string
  expiresAt?: string
  features?: string[]
}

export interface UserUsage {
  storageUsed?: number
  apiCalls?: number
  lastActive?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  businessName?: string
  gstNumber?: string
  businessAddress?: string
  createdAt?: string
  isActive?: boolean
  preferences?: UserPreferences
  subscription?: UserSubscription
  usage?: UserUsage
  avatar?: string
}

interface ProfileState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  updateSuccess: boolean
  preferencesLoading: boolean
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  updateSuccess: false,
  preferencesLoading: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Profile data actions
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.profile?.preferences) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload }
      }
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.avatar = action.payload
      }
    },
    clearProfile: (state) => {
      state.profile = null
    },
    
    // Loading state actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setPreferencesLoading: (state, action: PayloadAction<boolean>) => {
      state.preferencesLoading = action.payload
    },
    
    // Success state actions
    setUpdateSuccess: (state, action: PayloadAction<boolean>) => {
      state.updateSuccess = action.payload
    },
    
    // Error state actions
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },
  },
})

export const {
  setProfile,
  updateProfile,
  updatePreferences,
  updateAvatar,
  clearProfile,
  setLoading,
  setPreferencesLoading,
  setUpdateSuccess,
  setError,
  clearError,
  clearUpdateSuccess,
} = profileSlice.actions

export default profileSlice.reducer