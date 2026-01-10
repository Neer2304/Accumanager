'use client'

import { MainLayout } from '@/components/Layout/MainLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  useEffect(() => {
    console.log('🏠 Dashboard Page - Auth:', { isAuthenticated, isLoading })
  }, [isAuthenticated, isLoading])

  return (
    <MainLayout 
      title="Dashboard Overview"
      maxWidth={false}
      sx={{
        px: { xs: 0, sm: 1, md: 2 },
        pt: { xs: 1, sm: 2 },
      }}
    >
      <Dashboard />
    </MainLayout>
  )
}