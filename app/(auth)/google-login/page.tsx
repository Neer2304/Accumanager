'use client'

import React, { useEffect } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'
import { 
  Box, Card, CardContent, Typography, Button, 
  Container, Avatar, CircularProgress, Fade, Stack, alpha 
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/store'
import { setCredentials, setError } from '@/store/slices/authSlice'
import { offlineStorage } from '@/utils/offlineStorage'
import { AnimatedBackground } from '@/components/common'
import { useRouter } from 'next/navigation'

export default function GoogleLoginPage() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const syncWithBackend = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          // 1. Call your backend bridge route
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              googleId: (session.user as any).id || session.user.email
            }),
          })

          const data = await response.json()
          if (!response.ok) throw new Error(data.message || 'Backend sync failed')

          // 2. Sync Redux State
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            shopName: data.user.shopName
          }
          dispatch(setCredentials({ user: userData }))

          // 3. Sync Offline Storage
          await offlineStorage.setItem('auth', { 
            user: userData, 
            token: data.token 
          })

          // 4. Check for Legal Disclaimer
          const hasAccepted = localStorage.getItem('legal_disclaimer_accepted')
          if (hasAccepted) {
            router.push('/dashboard')
          }
        } catch (err: any) {
          console.error("Sync Error:", err)
          dispatch(setError(err.message))
        }
      }
    }

    syncWithBackend()
  }, [status, session, dispatch, router])

  return (
    <AnimatedBackground showRadial>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Fade in timeout={1000}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 8, 
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top accent line */}
            <Box sx={{ 
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', 
              background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            }} />

            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              {status === "loading" ? (
                <Stack alignItems="center" spacing={3} py={5}>
                  <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6' }} />
                  <Typography variant="h6" sx={{ color: '#94a3b8', letterSpacing: 2 }}>CONNECTING...</Typography>
                </Stack>
              ) : session ? (
                <Stack spacing={4}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar 
                      src={session.user?.image || ''} 
                      sx={{ width: 80, height: 80, border: '2px solid #3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }} 
                    />
                    <Box>
                      <Typography variant="h4" fontWeight="800" sx={{ color: '#f8fafc' }}>AccuManage</Typography>
                      <Typography variant="body1" sx={{ color: '#3b82f6', fontWeight: 600 }}>Identity Verified</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    bgcolor: 'rgba(16, 185, 129, 0.1)', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', 
                    borderRadius: 4, p: 2, display: 'flex', alignItems: 'center', gap: 2 
                  }}>
                    <CheckCircleOutlineIcon sx={{ color: '#10b981' }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      Google session active. Click below to enter your workspace.
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<DashboardIcon />}
                      onClick={() => router.push('/dashboard')}
                      sx={{ 
                        py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1rem',
                        background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                        '&:hover': { transform: 'translateY(-2px)', background: '#2563eb' }
                      }}
                    >
                      Enter Dashboard
                    </Button>
                    <Button 
                      onClick={() => signOut({ callbackUrl: '/login' })} 
                      sx={{ color: '#94a3b8', textTransform: 'none', '&:hover': { color: '#f8fafc' } }}
                    >
                      Use different account
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Box textAlign="center">
                  <Typography variant="h3" fontWeight="900" sx={{ color: '#f8fafc', mb: 1 }}>AccuManage</Typography>
                  <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5 }}>Secure Social Authentication</Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={() => signIn('google')}
                    sx={{
                      py: 2, borderRadius: 3, fontWeight: 700, fontSize: '1.1rem',
                      color: '#f8fafc',
                      borderColor: 'rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.03)',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', transform: 'translateY(-2px)' }
                    }}
                  >
                    Continue with Google
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </AnimatedBackground>
  )
}