// components/googlesettings/GoogleSettingsHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  alpha,
  useTheme,
} from '@mui/material'
import Link from 'next/link'
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material'

interface GoogleSettingsHeaderProps {
  darkMode?: boolean
  isMobile?: boolean
  isTablet?: boolean
}

export default function GoogleSettingsHeader({ 
  darkMode, 
  isMobile, 
  isTablet 
}: GoogleSettingsHeaderProps) {
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: { xs: 1, sm: 2 },
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
        }}
      >
        <MuiLink
          component={Link}
          href="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontWeight: 300,
            '&:hover': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
          Dashboard
        </MuiLink>
        <Typography
          color={darkMode ? '#e8eaed' : '#202124'}
          fontWeight={400}
        >
          Settings
        </Typography>
      </Breadcrumbs>

      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
          fontWeight={500}
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <SettingsIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }} />
          Settings
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontWeight: 300,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.5,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Configure your application preferences and manage business settings
        </Typography>
      </Box>
    </Box>
  )
}