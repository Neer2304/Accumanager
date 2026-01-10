// components/FixLoading.tsx
'use client'

import { useAppDispatch } from '@/store/store'
import { resetLoading } from '@/store/slices/authSlice'

export default function FixLoading() {
  const dispatch = useAppDispatch()

  return (
    <button 
      onClick={() => {
        console.log('🔄 Manually resetting loading state')
        dispatch(resetLoading())
      }}
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: '#ff4444',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 9999
      }}
    >
      Fix Stuck Loading
    </button>
  )
}