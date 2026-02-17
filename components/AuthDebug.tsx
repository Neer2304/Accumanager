// components/AuthDebug.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // Show only once when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && !hasShown) {
      setIsVisible(true)
      setHasShown(true)
      
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading, hasShown])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      background: '#2d2e30',
      color: '#e8eaed',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '13px',
      zIndex: 9999,
      width: '300px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
      border: '1px solid #3c4043',
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
      animation: 'slideIn 0.2s ease',
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#8ab4f8',
          }} />
          <span style={{
            fontWeight: '500',
            color: '#8ab4f8',
            fontSize: '14px',
          }}>
            Account
          </span>
        </div>
        <div style={{
          background: '#3c4043',
          color: '#9aa0a6',
          padding: '4px 8px',
          borderRadius: '16px',
          fontSize: '11px',
          fontWeight: '500',
        }}>
          Auto-hides in 5s
        </div>
      </div>

      {/* User Info */}
      <div style={{
        background: '#202124',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '12px',
        border: '1px solid #3c4043',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#8ab4f8',
            color: '#202124',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '500',
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{
            flex: 1,
          }}>
            <div style={{
              fontWeight: '500',
              color: '#e8eaed',
              marginBottom: '2px',
            }}>
              {user?.email || 'Signed in'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#34a853',
              }} />
              <span style={{
                color: '#9aa0a6',
                fontSize: '11px',
              }}>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#9aa0a6' }}>Status</span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#34a853',
            fontWeight: '500',
          }}>
            <span>✓</span>
            Authenticated
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#9aa0a6' }}>User ID</span>
          <span style={{
            color: '#e8eaed',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}>
            {user?.id ? `${user.id.substring(0, 6)}...` : 'None'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            flex: 1,
            background: '#3c4043',
            border: 'none',
            color: '#8ab4f8',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#4a4d51'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#3c4043'}
        >
          Refresh
        </button>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            flex: 1,
            background: '#202124',
            border: '1px solid #3c4043',
            color: '#9aa0a6',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2d2e30'
            e.currentTarget.style.color = '#e8eaed'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#202124'
            e.currentTarget.style.color = '#9aa0a6'
          }}
        >
          Close
        </button>
      </div>

      {/* Progress bar for auto-hide */}
      <div style={{
        marginTop: '12px',
        height: '2px',
        background: '#3c4043',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: '#8ab4f8',
          animation: 'shrink 5s linear forwards',
        }} />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}