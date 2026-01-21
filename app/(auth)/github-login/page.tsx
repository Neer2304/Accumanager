'use client'

import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { 
  Box, Card, CardContent, Typography, Button, 
  Container, Avatar, CircularProgress, Fade, Stack 
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useAuth } from '@/hooks/useAuth'
import { AnimatedBackground } from '@/components/common'

export default function GithubLoginPage() {
  const { data: session, status } = useSession()
  const { loginWithGithub, isGithubLoading } = useAuth()

  useEffect(() => {
    const performSync = async () => {
      if (status === "authenticated" && session?.user) {
        await loginWithGithub({
          email: session.user.email || '',
          name: session.user.name || '',
          image: session.user.image || '',
          githubId: (session.user as any).id || session.user.email || ''
        })
      }
    }
    performSync()
  }, [status, session, loginWithGithub])

  return (
    <AnimatedBackground showRadial>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Fade in timeout={800}>
          <Card sx={{ 
            width: '100%', borderRadius: 8, 
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            backdropFilter: 'blur(25px)', border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent sx={{ p: 6 }}>
              {(status === "loading" || isGithubLoading) ? (
                <Stack alignItems="center" spacing={3}>
                  <CircularProgress size={60} sx={{ color: '#6e5494' }} />
                  <Typography variant="h6" sx={{ color: '#94a3b8', letterSpacing: 1.5 }}>
                    SYNCING GITHUB PROFILE...
                  </Typography>
                </Stack>
              ) : (
                <Box textAlign="center">
                  <Typography variant="h3" fontWeight="900" color="#f8fafc" mb={1}>AccuManage</Typography>
                  <Typography variant="h6" color="#94a3b8" mb={5}>Identity Verification</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<GitHubIcon />}
                    onClick={() => signIn('github')}
                    sx={{
                      py: 2, borderRadius: 3, fontWeight: 700, fontSize: '1.1rem',
                      bgcolor: '#24292e', '&:hover': { bgcolor: '#1b1f23' }
                    }}
                  >
                    Continue with GitHub
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