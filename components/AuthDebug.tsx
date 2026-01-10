// components/AuthDebug.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [autoHide, setAutoHide] = useState(false)

  // Auto-hide after 5 seconds when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && !autoHide) {
      setAutoHide(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000) // Hide after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading, autoHide])

  // Show debug again when auth state changes
  useEffect(() => {
    setIsVisible(true)
    setAutoHide(false)
  }, [isAuthenticated, isLoading, user])

  if (!isVisible) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      border: '2px solid #00ff00'
    }}>
      <div><strong>Auth Debug (Auto-hides in 5s):</strong></div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Loading: {isLoading ? '🔄' : '✅'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>User ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'None'}</div>
      <button 
        onClick={() => setIsVisible(false)}
        style={{
          marginTop: '5px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '2px 8px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  )
}