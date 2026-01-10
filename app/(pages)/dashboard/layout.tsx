'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/layout'
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    console.log('🏠 DashboardLayout - Auth status:', { 
      isAuthenticated, 
      isLoading 
    })

    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Redirecting to login...')
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        px={isMobile ? 2 : 4}
      >
        <CircularProgress 
          size={isMobile ? 32 : 40} 
          thickness={isMobile ? 4 : 3.6}
        />
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          color="textSecondary"
          align="center"
        >
          Loading Dashboard...
        </Typography>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return <Layout>{children}</Layout>
}