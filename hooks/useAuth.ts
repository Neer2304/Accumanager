// hooks/useAuth.ts - UPDATED
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { setCredentials, logout, setLoading, setError, restoreAuth } from '@/store/slices/authSlice'
import { authService } from '@/services/authService'
import { offlineStorage } from '@/utils/offlineStorage'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  
  // Add state for legal disclaimer
  const [showLegalDisclaimer, setShowLegalDisclaimer] = useState(false)
  const [loginSuccessData, setLoginSuccessData] = useState<any>(null)

  // Restore auth state on page refresh
  useEffect(() => {
    const restoreAuthFromStorage = async () => {
      try {
        console.log('🔄 Checking for saved auth in storage...')
        const savedAuth = await offlineStorage.getItem<any>('auth')
        
        if (savedAuth && savedAuth.user) {
          console.log('✅ Found saved auth, restoring...', savedAuth.user.name)
          
          // Make sure the user object has the right structure
          const userData = {
            id: savedAuth.user._id || savedAuth.user.id,
            name: savedAuth.user.name,
            email: savedAuth.user.email,
            role: savedAuth.user.role || 'user',
            shopName: savedAuth.user.shopName
          }
          
          dispatch(restoreAuth({ user: userData }))
          console.log('✅ Auth restored for user:', userData.name)
        } else {
          console.log('📭 No saved auth found in storage')
          dispatch(setLoading(false))
        }
      } catch (error) {
        console.error('❌ Error restoring auth:', error)
        dispatch(setLoading(false))
      }
    }

    restoreAuthFromStorage()
  }, [dispatch])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('✅ Login successful, user:', data.user)
      
      // Make sure we store the user data correctly
      const userData = {
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
        shopName: data.user.shopName
      }
      
      const authDataToStore = {
        ...data,
        user: userData
      }
      
      // Save auth data temporarily
      dispatch(setCredentials({ user: userData }))
      offlineStorage.setItem('auth_temp', authDataToStore) // Temporary storage
      
      // Check if user has already accepted legal disclaimer
      const hasAccepted = localStorage.getItem('legal_disclaimer_accepted')
      
      if (hasAccepted) {
        // User already accepted, go directly to dashboard
        offlineStorage.setItem('auth', authDataToStore) // Move to permanent storage
        offlineStorage.removeItem('auth_temp') // Clean up temp
        router.push('/dashboard')
      } else {
        // Show legal disclaimer modal
        setLoginSuccessData({ user: userData, authData: authDataToStore })
        setShowLegalDisclaimer(true)
      }
    },
    onError: (error: Error) => {
      console.error('❌ Login error:', error)
      dispatch(setError(error.message))
      dispatch(setLoading(false))
    },
  })

  // Function to handle disclaimer acceptance
  const handleAcceptDisclaimer = () => {
    if (loginSuccessData) {
      // Move temp auth to permanent storage
      offlineStorage.setItem('auth', loginSuccessData.authData)
      offlineStorage.removeItem('auth_temp')
      
      // Store acceptance in localStorage
      localStorage.setItem('legal_disclaimer_accepted', 'true')
      localStorage.setItem('legal_disclaimer_accepted_date', new Date().toISOString())
      localStorage.setItem('legal_disclaimer_user_id', loginSuccessData.user.id)
      
      // Hide modal and redirect to dashboard
      setShowLegalDisclaimer(false)
      router.push('/dashboard')
    }
  }

  // Function to handle disclaimer rejection
  const handleRejectDisclaimer = () => {
    // Clear temp auth and logout
    offlineStorage.removeItem('auth_temp')
    dispatch(logout())
    setShowLegalDisclaimer(false)
    router.push('/login')
  }

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log('✅ Registration successful, user:', data.user)
      
      const userData = {
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
        shopName: data.user.shopName
      }
      
      const authDataToStore = {
        ...data,
        user: userData
      }
      
      // Save auth data temporarily
      dispatch(setCredentials({ user: userData }))
      offlineStorage.setItem('auth_temp', authDataToStore)
      
      // Check if user has already accepted legal disclaimer
      const hasAccepted = localStorage.getItem('legal_disclaimer_accepted')
      
      if (hasAccepted) {
        // User already accepted
        offlineStorage.setItem('auth', authDataToStore)
        offlineStorage.removeItem('auth_temp')
        router.push('/dashboard')
      } else {
        // Show legal disclaimer modal
        setLoginSuccessData({ user: userData, authData: authDataToStore })
        setShowLegalDisclaimer(true)
      }
    },
    onError: (error: Error) => {
      console.error('❌ Registration error:', error)
      dispatch(setError(error.message))
      dispatch(setLoading(false))
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      console.log('✅ Logout successful')
      dispatch(logout())
      offlineStorage.removeItem('auth')
      queryClient.clear()
      router.push('/login')
    },
    onError: (error: Error) => {
      console.error('❌ Logout error:', error)
      dispatch(logout())
      offlineStorage.removeItem('auth')
      queryClient.clear()
      router.push('/login')
    },
  })

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (auth.user?.name) {
      return auth.user.name
    }
    return 'User'
  }

  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    showLegalDisclaimer,
    loginSuccessData,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    clearError: () => dispatch(setError(null)),
    handleAcceptDisclaimer,
    handleRejectDisclaimer,
    
    // Helper
    getUserDisplayName,
  }
}