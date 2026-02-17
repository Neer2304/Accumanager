// components/googleadminterms/GoogleTermsHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  alpha,
} from '@mui/material'
import Link from 'next/link'
import {
  ArrowBack,
  Description,
  Add as AddIcon,
} from '@mui/icons-material'
import { TermsHeaderProps } from './types'

export default function GoogleTermsHeader({
  onCreateClick,
  darkMode,
  isMobile,
  isTablet,
}: TermsHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
      <Button
        component={Link}
        href="/admin/dashboard"
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 2,
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
          },
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            borderRadius: '16px',
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
          }}>
            <Description sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Terms & Conditions
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mt: 0.5,
              }}
            >
              Manage legal terms and version history
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateClick}
          sx={{
            backgroundColor: '#1a73e8',
            '&:hover': {
              backgroundColor: '#1669c1',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
            },
            borderRadius: '12px',
            px: 3,
            py: 1.25,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          Create New Version
        </Button>
      </Box>
    </Box>
  )
}