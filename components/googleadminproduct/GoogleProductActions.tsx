// components/googleadminproduct/GoogleProductActions.tsx
'use client'

import React from 'react'
import {
  Stack,
  Button,
  alpha,
} from '@mui/material'
import {
  Print,
  Download,
  Share,
} from '@mui/icons-material'
import { ProductActionsProps } from './types'

export default function GoogleProductActions({
  onPrint,
  onExport,
  onShare,
  darkMode,
  isMobile,
}: ProductActionsProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<Print />}
        onClick={onPrint}
        fullWidth={isMobile}
        sx={{
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          borderRadius: '24px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            borderColor: darkMode ? '#5f6368' : '#bdc1c6',
            backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
          }
        }}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={onExport}
        fullWidth={isMobile}
        sx={{
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          borderRadius: '24px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            borderColor: darkMode ? '#5f6368' : '#bdc1c6',
            backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
          }
        }}
      >
        Export
      </Button>
      <Button
        variant="contained"
        startIcon={<Share />}
        onClick={onShare}
        fullWidth={isMobile}
        sx={{
          backgroundColor: '#34a853',
          color: '#ffffff',
          borderRadius: '24px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#2e8b47',
          }
        }}
      >
        Share
      </Button>
    </Stack>
  )
}