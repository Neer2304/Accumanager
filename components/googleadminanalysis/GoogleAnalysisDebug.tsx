// components/googleadminanalysis/GoogleAnalysisDebug.tsx
'use client'

import React from 'react'
import {
  Box,
  alpha,
} from '@mui/material'

interface GoogleAnalysisDebugProps {
  data: any
  darkMode?: boolean
  isMobile?: boolean
}

export default function GoogleAnalysisDebug({ data, darkMode, isMobile }: GoogleAnalysisDebugProps) {
  if (process.env.NODE_ENV !== 'development' || !data) return null

  return (
    <Box 
      sx={{ 
        mt: 3, 
        p: { xs: 1, sm: 1.5 }, 
        borderRadius: '12px',
        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
      }}
    >
      <details>
        <summary style={{ 
          cursor: 'pointer', 
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          fontWeight: 500,
          outline: 'none',
          fontSize: isMobile ? '0.8rem' : '0.875rem'
        }}>
          Debug Information
        </summary>
        <Box 
          sx={{ 
            mt: 1, 
            p: 1, 
            borderRadius: '8px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            maxHeight: '150px',
            overflow: 'auto'
          }}
        >
          <pre style={{ 
            margin: 0, 
            fontSize: isMobile ? '10px' : '11px',
            color: darkMode ? '#e8eaed' : '#202124'
          }}>
            {JSON.stringify(data.systemOverview?.databaseStats, null, 2)}
          </pre>
        </Box>
      </details>
    </Box>
  )
}