// contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { setCredentials, logout, setLoading, setError, resetLoading } from '@/store/slices/authSlice'

const AuthContext = createContext<{ isInitialized: boolean }>({ isInitialized: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const hasCheckedAuth = useRef(false)

  useEffect(() => {
    if (hasCheckedAuth.current) {
      return
    }

    hasCheckedAuth.current = true
    console.log('🔐 [AuthProvider] Checking auth status...')

    const checkAuth = async () => {
      try {
        dispatch(setLoading(true))
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Auth check failed')
        }

        const data = await response.json()
        console.log('📊 [AuthProvider] Auth check response:', data)
        
        if (data.isAuthenticated && data.user) {
          console.log('✅ [AuthProvider] User authenticated - setting credentials')
          dispatch(setCredentials({ 
            user: {
              id: data.user.id,
              email: data.user.email,
              role: data.user.role,
              name: data.user.name || 'User',
              shopName: data.user.shopName || ''
            }
          }))
        } else {
          console.log('❌ [AuthProvider] User not authenticated - logging out')
          dispatch(logout())
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Auth check error:', error)
        dispatch(logout()) // This will set loading to false
      }
      // Remove the finally block - let the actions handle loading state
    }

    checkAuth()

    // Safety timeout - if loading is still true after 10 seconds, force it to false
    const safetyTimer = setTimeout(() => {
      if (auth.isLoading) {
        console.warn('⚠️ Loading stuck for 10s, forcing stop')
        dispatch(resetLoading())
      }
    }, 10000)

    return () => clearTimeout(safetyTimer)
  }, [dispatch]) // Remove auth.isAuthenticated from dependencies

  return (
    <AuthContext.Provider value={{ isInitialized: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)