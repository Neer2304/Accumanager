// components/googleadminterms/GoogleTermsAlerts.tsx
'use client'

import React from 'react'
import { Alert, alpha } from '@mui/material'
import { TermsAlertsProps } from './types'

export default function GoogleTermsAlerts({
  error,
  success,
  onErrorClose,
  onSuccessClose,
  darkMode,
}: TermsAlertsProps) {
  return (
    <>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: '1px solid #ea4335',
            color: darkMode ? '#e8eaed' : '#202124',
            '& .MuiAlert-icon': { color: '#ea4335' },
            '& .MuiAlert-message': { width: '100%' },
            '& .MuiAlert-action': { alignItems: 'center' },
          }}
          onClose={onErrorClose}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: '1px solid #34a853',
            color: darkMode ? '#e8eaed' : '#202124',
            '& .MuiAlert-icon': { color: '#34a853' },
            '& .MuiAlert-message': { width: '100%' },
            '& .MuiAlert-action': { alignItems: 'center' },
          }}
          onClose={onSuccessClose}
        >
          {success}
        </Alert>
      )}
    </>
  )
}