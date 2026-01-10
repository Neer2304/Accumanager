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
  IconButton,
  Fade,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  Security,
  Smartphone,
  Analytics,
  People,
  Inventory
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [featureIndex, setFeatureIndex] = useState(0)

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

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const onSubmit = (data: LoginFormData) => {
    clearError()
    login(data)
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const features = [
    { icon: <Analytics />, title: 'Advanced Analytics', desc: 'Real-time business insights' },
    { icon: <Inventory />, title: 'Inventory Management', desc: 'Track products effortlessly' },
    { icon: <People />, title: 'Customer CRM', desc: 'Manage customer relationships' },
    { icon: <Smartphone />, title: 'Mobile App', desc: 'Access anywhere, anytime' },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.08)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        p: isMobile ? 2 : 0,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.15)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 4 : 8,
        }}
      >
        {/* Left Side - Branding & Features */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            color: theme.palette.primary.main,
          }}
        >
          <Box sx={{ mb: isMobile ? 3 : 4 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="800"
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                  md: '3rem',
                },
                lineHeight: 1.2,
              }}
            >
              Welcome Back to AccumaManage
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: {
                  xs: '1rem',
                  md: '1.1rem',
                },
                lineHeight: 1.6,
                maxWidth: isMobile ? '100%' : '90%',
              }}
            >
              Sign in to access your business dashboard and continue growing with our powerful management tools.
            </Typography>
          </Box>

          {/* Feature Highlight */}
          <Fade in key={featureIndex} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 3,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                width: '100%',
                maxWidth: isMobile ? '100%' : '400px',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.primary.main,
                  fontSize: '1.5rem',
                }}
              >
                {features[featureIndex].icon}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {features[featureIndex].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {features[featureIndex].desc}
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Trust Indicators */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              mt: 'auto',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 20,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Security sx={{ fontSize: 16, color: theme.palette.success.main }} />
              <Typography variant="caption" fontWeight="500">
                Enterprise Security
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 20,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Typography variant="caption" fontWeight="500">
                99.9% Uptime
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 450,
            width: '100%',
          }}
        >
          <Card 
            elevation={8}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
            }}
          >
            {/* Card Header */}
            <Box
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                textAlign: 'center',
                py: isMobile ? 2.5 : 3,
                px: 2,
              }}
            >
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="700"
                gutterBottom
              >
                Sign In
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Access your business dashboard
              </Typography>
            </Box>

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }} 
                  onClose={clearError}
                  variant="outlined"
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Field */}
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                />

                {/* Password Field */}
                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size={isMobile ? "small" : "medium"}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                />

                {/* Forgot Password Link */}
                <Box textAlign="right" mb={3}>
                  <Link 
                    href="/forgot-password" 
                    sx={{ 
                      fontSize: isMobile ? '0.875rem' : '0.95rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    py: isMobile ? 1.2 : 1.5,
                    borderRadius: 3,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    '&:disabled': {
                      background: theme.palette.action.disabledBackground,
                    },
                    transition: 'all 0.3s ease',
                    mb: 2,
                  }}
                  endIcon={<ArrowForward />}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${theme.palette.common.white}`,
                          borderTopColor: 'transparent',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            to: { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      Signing In...
                    </Box>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>

                {/* Demo Info */}
                <Alert 
                  severity="info" 
                  variant="outlined"
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                  }}
                >
                  <Typography variant="body2" fontWeight="500">
                    Use your registered credentials to access your active subscription dashboard.
                  </Typography>
                </Alert>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                      href="/register" 
                      sx={{ 
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Start Free Trial
                    </Link>
                  </Typography>
                </Box>

                {/* Security Note */}
                <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    align="center"
                    sx={{ display: 'block', lineHeight: 1.5 }}
                  >
                    Your login is secured with 256-bit SSL encryption. Read our{' '}
                    <Link 
                      href="/privacy-policy" 
                      sx={{ 
                        color: 'inherit',
                        textDecoration: 'underline',
                        fontWeight: 500,
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}