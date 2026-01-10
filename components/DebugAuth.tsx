// components/DebugAuth.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DebugAuth() {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: '#333',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
        <div>Loading: {isLoading ? '🔄' : '✅'}</div>
        <div>User: {user?.email || 'None'}</div>
      </div>
    )
  }
  
  return null
}