// contexts/UserContext.tsx - COMPLETE FILE
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { offlineStorage } from '@/utils/offlineStorage' // Using your existing offlineStorage

interface User {
  id: string
  name: string
  email: string
  role: string
  shopName?: string
  avatar?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore user from localStorage on mount
  useEffect(() => {
    const restoreUser = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Restoring user from storage...')
        
        // Try to get user from auth data
        const savedAuth = await offlineStorage.getItem<any>('auth')
        const savedUser = await offlineStorage.getItem<User>('user')
        
        if (savedAuth?.user) {
          console.log('✅ Found user in auth data:', savedAuth.user)
          setUserState({
            id: savedAuth.user._id || savedAuth.user.id || '',
            name: savedAuth.user.name || '',
            email: savedAuth.user.email || '',
            role: savedAuth.user.role || 'user',
            shopName: savedAuth.user.shopName,
            avatar: savedAuth.user.avatar
          })
        } else if (savedUser) {
          console.log('✅ Found user in user data:', savedUser)
          setUserState(savedUser)
        } else {
          console.log('📭 No user data found in storage')
        }
      } catch (error) {
        console.error('❌ Error restoring user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    restoreUser()
  }, [])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      offlineStorage.setItem('user', newUser)
      console.log('💾 User saved to storage:', newUser.name)
    } else {
      offlineStorage.removeItem('user')
      console.log('🗑️ User removed from storage')
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUserState(updatedUser)
      offlineStorage.setItem('user', updatedUser)
      console.log('✏️ User updated:', updatedUser.name)
    }
  }

  const clearUser = () => {
    setUserState(null)
    offlineStorage.removeItem('user')
    offlineStorage.removeItem('auth')
    console.log('🧹 User data cleared')
  }

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}