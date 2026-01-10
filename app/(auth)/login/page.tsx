// app/login/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const onSubmit = (data: LoginFormData) => {
    clearError()
    login(data)
  }

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
        }}
      >
        <Card 
          sx={{ 
            width: '100%', 
            maxWidth: 450,
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography 
                component="h1" 
                variant="h4" 
                gutterBottom 
                fontWeight="bold"
                color="primary"
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Sign in to your AccumaManage account
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }} 
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email')}
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('password')}
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              {/* Forgot Password Link */}
              <Box textAlign="right" mb={2}>
                <Link 
                  href="/forgot-password" 
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot your password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ 
                  mt: 1, 
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Box 
                      component="span" 
                      sx={{ 
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 },
                        }
                      }}
                    >
                      Signing In...
                    </Box>
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Account Info */}
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'info.light', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'info.main'
                }}
              >
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="info.dark">
                  💡 Demo Access
                </Typography>
                <Typography variant="caption" color="info.dark">
                  Use your registered email and password to access your business dashboard with your active subscription.
                </Typography>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ textDecoration: 'none' }}
                  >
                    Start Free Trial
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Box sx={{ mt: 4, maxWidth: 450, textAlign: 'center' }}>
          <Typography variant="h6" color="white" gutterBottom fontWeight="bold">
            Everything You Need to Manage Your Business
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 2 }}>
            {[
              '📊 Sales Analytics',
              '📦 Inventory Management', 
              '👥 Customer CRM',
              '🧾 Invoice & Billing',
              '📱 Mobile App',
              '🔒 Secure & Compliant'
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {feature}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="white">
            Secure login with enterprise-grade security
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}