// app/register/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Link as MuiLink,
  Alert,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import { Visibility, VisibilityOff, Person, Email, Lock, Store, CheckCircle } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent2 } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  shopName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const darkMode = theme.palette.mode === 'dark'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const onSubmit = (data: RegisterFormData) => {
    clearError()
    const { confirmPassword, ...userData } = data
    registerUser(userData)
  }

  // Google Material Design Colors
  const googleColors = {
    primary: '#1a73e8',
    primaryLight: '#8ab4f8',
    primaryDark: '#1669c1',
    secondary: '#34a853',
    warning: '#fbbc04',
    error: '#ea4335',
    grey50: '#f8f9fa',
    grey100: '#f1f3f4',
    grey200: '#e8eaed',
    grey300: '#dadce0',
    grey400: '#bdc1c6',
    grey500: '#9aa0a6',
    grey600: '#80868b',
    grey700: '#5f6368',
    grey800: '#3c4043',
    grey900: '#202124',
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, md: 6 },
        }}
      >
        {/* Left Side - Branding & Features */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography 
              variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
              fontWeight={500}
              gutterBottom
              sx={{
                color: darkMode ? googleColors.grey200 : googleColors.grey900,
                fontSize: { 
                  xs: '1.75rem', 
                  sm: '2.25rem', 
                  md: '2.5rem',
                  lg: '2.75rem'
                },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              Join AccumaManage Today
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? googleColors.grey500 : googleColors.grey600,
                fontSize: { 
                  xs: '1rem',
                  md: '1.125rem',
                },
                lineHeight: 1.6,
                maxWidth: { xs: '100%', md: '90%' },
                mb: 3,
              }}
            >
              Start your 14-day free trial and transform your business with our all-in-one management platform.
            </Typography>

            {/* Features */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: { xs: '100%', md: '400px' },
              }}
            >
              {[
                '14-day free trial, no credit card required',
                'Unlimited products and customers',
                'Advanced analytics dashboard',
                'Mobile app access included',
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? googleColors.grey800 : 'white',
                    border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? googleColors.grey700 : googleColors.grey100,
                      borderColor: darkMode ? googleColors.grey600 : googleColors.grey300,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: googleColors.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 14, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontSize: { 
                        xs: '0.875rem',
                        md: '0.95rem',
                      },
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: '100%', md: '450px' },
            width: '100%',
          }}
        >
          <Card
            hover
            variant="elevation"
            sx={{
              borderRadius: '20px',
              backgroundColor: darkMode ? googleColors.grey900 : 'white',
              border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
              boxShadow: darkMode 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(66, 133, 244, 0.12)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${googleColors.primary} 0%, ${googleColors.secondary} 100%)`,
              },
            }}
          >
            <CardContent2>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={500}
                  sx={{ 
                    color: darkMode ? googleColors.grey200 : googleColors.grey900,
                    mb: 1,
                  }}
                >
                  Create Account
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  }}
                >
                  Start your free trial in less than 2 minutes
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  onClose={clearError}
                  sx={{ 
                    mb: 3,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                    border: `1px solid ${googleColors.error}`,
                    color: darkMode ? googleColors.grey200 : googleColors.grey900,
                    '& .MuiAlert-icon': { color: googleColors.error },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Name Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    Full Name
                  </Typography>
                  <Input
                    {...register('name')}
                    placeholder="Enter your full name"
                    startIcon={<Person />}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                      borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
                      '&:focus': {
                        borderColor: googleColors.primary,
                        boxShadow: `0 0 0 3px ${alpha(googleColors.primary, 0.2)}`,
                      },
                    }}
                  />
                </Box>

                {/* Email Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    Email Address
                  </Typography>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email"
                    startIcon={<Email />}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                      borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
                      '&:focus': {
                        borderColor: googleColors.primary,
                        boxShadow: `0 0 0 3px ${alpha(googleColors.primary, 0.2)}`,
                      },
                    }}
                  />
                </Box>

                {/* Business Name Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    Business Name (Optional)
                  </Typography>
                  <Input
                    {...register('shopName')}
                    placeholder="Enter your business name"
                    startIcon={<Store />}
                    error={!!errors.shopName}
                    helperText={errors.shopName?.message}
                    sx={{
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                      borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
                      '&:focus': {
                        borderColor: googleColors.primary,
                        boxShadow: `0 0 0 3px ${alpha(googleColors.primary, 0.2)}`,
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    Password
                  </Typography>
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    startIcon={<Lock />}
                    endIcon={
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          color: darkMode ? googleColors.grey500 : googleColors.grey600,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    }
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                      borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
                      '&:focus': {
                        borderColor: googleColors.primary,
                        boxShadow: `0 0 0 3px ${alpha(googleColors.primary, 0.2)}`,
                      },
                    }}
                  />
                </Box>

                {/* Confirm Password Field */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: darkMode ? googleColors.grey300 : googleColors.grey700,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    startIcon={<Lock />}
                    endIcon={
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          color: darkMode ? googleColors.grey500 : googleColors.grey600,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    }
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
                      borderColor: darkMode ? googleColors.grey700 : googleColors.grey300,
                      '&:focus': {
                        borderColor: googleColors.primary,
                        boxShadow: `0 0 0 3px ${alpha(googleColors.primary, 0.2)}`,
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  size="large"
                  loading={isLoading}
                  // loadingText="Creating Account..."
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 500,
                    backgroundColor: googleColors.primary,
                    '&:hover': {
                      backgroundColor: googleColors.primaryDark,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 20px ${alpha(googleColors.primary, 0.3)}`,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey300,
                      color: darkMode ? googleColors.grey600 : googleColors.grey500,
                    },
                    transition: 'all 0.2s ease',
                    mb: 2,
                  }}
                >
                  Start 14-Day Free Trial
                </Button>

                {/* Divider */}
                <Divider sx={{ my: 3, borderColor: darkMode ? googleColors.grey800 : googleColors.grey200 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      px: 2,
                    }}
                  >
                    OR
                  </Typography>
                </Divider>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? googleColors.grey500 : googleColors.grey600 }}>
                    Already have an account?{' '}
                    <MuiLink
                      component={Link}
                      href="/login"
                      sx={{ 
                        fontWeight: 500,
                        color: googleColors.primary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign In
                    </MuiLink>
                  </Typography>
                </Box>

                {/* Terms */}
                <Box sx={{ 
                  pt: 3,
                  borderTop: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      textAlign: 'center',
                      display: 'block',
                      lineHeight: 1.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    By signing up, you agree to our{' '}
                    <MuiLink
                      component={Link}
                      href="/terms-of-service"
                      sx={{ 
                        color: 'inherit',
                        textDecoration: 'underline',
                        fontWeight: 500,
                        '&:hover': {
                          color: googleColors.primary,
                        },
                      }}
                    >
                      Terms
                    </MuiLink>{' '}
                    and{' '}
                    <MuiLink
                      component={Link}
                      href="/privacy-policy"
                      sx={{ 
                        color: 'inherit',
                        textDecoration: 'underline',
                        fontWeight: 500,
                        '&:hover': {
                          color: googleColors.primary,
                        },
                      }}
                    >
                      Privacy Policy
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </CardContent2>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}