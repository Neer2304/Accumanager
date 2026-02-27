// components/googlehub/GoogleHubContainer.tsx
'use client'

import React from 'react'
import { Box, Container, useTheme, alpha } from '@mui/material'
import { GoogleHubProps, googleColors } from './types'

export default function GoogleHubContainer({ children, sx }: GoogleHubProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? googleColors.black : googleColors.white,
      minHeight: '100vh',
      transition: 'background-color 0.3s',
      ...sx 
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  )
}