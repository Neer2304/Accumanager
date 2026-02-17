// components/googlesettings/GoogleSettingsSaveBar.tsx
'use client'

import React from 'react'
import {
  Box,
  CircularProgress,
  alpha,
} from '@mui/material'
import { Save } from '@mui/icons-material'
import { Button } from '@/components/ui/Button'

interface GoogleSettingsSaveBarProps {
  saveStatus: 'idle' | 'saving' | 'success' | 'error'
  onSave: () => void
  darkMode?: boolean
}

export default function GoogleSettingsSaveBar({ 
  saveStatus, 
  onSave,
  darkMode 
}: GoogleSettingsSaveBarProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 20,
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        iconLeft={
          saveStatus === 'saving' ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <Save />
          )
        }
        onClick={onSave}
        disabled={saveStatus === 'saving'}
        size="large"
        sx={{
          minWidth: 200,
          borderRadius: '20px',
          boxShadow: 4,
          backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6,
            backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'}
      </Button>
    </Box>
  )
}