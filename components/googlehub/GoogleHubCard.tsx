// components/googlehub/GoogleHubCard.tsx
'use client'

import React from 'react'
import { Card as MuiCard, useTheme, alpha } from '@mui/material'
import { GoogleHubProps, googleColors } from './types'

interface GoogleHubCardProps extends GoogleHubProps {
  hover?: boolean
  gradient?: boolean
  onClick?: () => void
}

export default function GoogleHubCard({ 
  children, 
  hover = false, 
  gradient = false,
  onClick,
  sx 
}: GoogleHubCardProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <MuiCard
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: darkMode ? googleColors.greyDark : googleColors.white,
        border: `1px solid ${darkMode ? googleColors.greyDark : googleColors.greyBorder}`,
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...(gradient && {
          background: `linear-gradient(135deg, ${alpha(googleColors.blue, 0.05)} 0%, ${alpha(googleColors.purple, 0.05)} 100%)`,
        }),
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? '0 8px 16px rgba(0,0,0,0.5)' 
              : '0 8px 16px rgba(0,0,0,0.1)',
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MuiCard>
  )
}