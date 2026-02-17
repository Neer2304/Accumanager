// app/about/page.tsx
'use client'

import React from 'react'
import {
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'
import { LandingHeader } from "@/components/landing/Header"
import {
  GoogleAboutSkeleton,
  GoogleAboutHero,
  GoogleAboutMissionVision,
  GoogleAboutValues,
  GoogleAboutReviews,
  GoogleAboutCTA,
  GoogleAboutFooter,
  useAboutData,
} from '@/components/googleabout'

export default function AboutPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
  const { mode } = useThemeContext()
  const darkMode = mode === 'dark'
  
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { reviews, summary, loading, error } = useAboutData()

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  if (loading) {
    return <GoogleAboutSkeleton />
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      <GoogleAboutHero 
        isMobile={isMobile}
        isTablet={isTablet}
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleAboutMissionVision 
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleAboutValues 
        isMobile={isMobile}
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleAboutReviews 
        reviews={reviews}
        summary={summary}
        error={error}
        isAuthenticated={isAuthenticated}
        isMobile={isMobile}
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleAboutCTA 
        isAuthenticated={isAuthenticated}
        authLoading={authLoading}
        isMobile={isMobile}
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleAboutFooter 
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />
    </Box>
  )
}