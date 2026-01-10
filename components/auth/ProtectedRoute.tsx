// components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress, Typography, Button } from '@mui/material'

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🔐 ProtectedRoute - Status:', { 
      isAuthenticated, 
      isLoading, 
      user: user?.email 
    })

    // Only redirect if we're done loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to login...')
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router, user])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={3}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Checking Authentication...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          This should only take a moment
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Page
        </Button>
      </Box>
    )
  }

  // Show error state if needed
  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h6" color="error">
          Not Authenticated
        </Typography>
        <Typography variant="body2">
          Redirecting to login page...
        </Typography>
      </Box>
    )
  }

  // Render children only when authenticated
  console.log('✅ ProtectedRoute - Rendering children for user:', user?.email)
  return <>{children}</>
}