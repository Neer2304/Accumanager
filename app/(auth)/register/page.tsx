// app/register/page.tsx
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
import { Visibility, VisibilityOff, Person, Email, Lock, Store } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

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

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        py: isMobile ? 3 : 0,
        px: isMobile ? 2 : 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Elements */}
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
              Join AccumaManage Today
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
              Start your 14-day free trial and transform your business with our all-in-one management platform.
            </Typography>
          </Box>

          {/* Features */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: isMobile ? '100%' : '400px',
            }}
          >
            {[
              { icon: '✓', text: '14-day free trial, no credit card required' },
              { icon: '✓', text: 'Unlimited products and customers' },
              { icon: '✓', text: 'Advanced analytics dashboard' },
              { icon: '✓', text: 'Mobile app access included' },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.success.contrastText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: {
                      xs: '0.875rem',
                      md: '0.95rem',
                    },
                    fontWeight: 500,
                  }}
                >
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : '450px',
            width: '100%',
          }}
        >
          <Fade in={true} timeout={800}>
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
                  marginTop: 2
                }}
              >
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="700"
                  gutterBottom
                >
                  Create Account
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Start your free trial in less than 2 minutes
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
                  {/* Name Field */}
                  <TextField
                    {...register('name')}
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    size={isMobile ? "small" : "medium"}
                  />

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

                  {/* Shop Name Field */}
                  <TextField
                    {...register('shopName')}
                    fullWidth
                    label="Business Name (Optional)"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.shopName}
                    helperText={errors.shopName?.message}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Store color="action" />
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
                            onClick={handleClickShowPassword}
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

                  {/* Confirm Password Field */}
                  <TextField
                    {...register('confirmPassword')}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size={isMobile ? "small" : "medium"}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    size={isMobile ? "small" : "medium"}
                  />

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
                        Creating Account...
                      </Box>
                    ) : (
                      'Start 14-Day Free Trial'
                    )}
                  </Button>

                  {/* Login Link */}
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link 
                        href="/login" 
                        sx={{ 
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          color: theme.palette.primary.main,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Box>

                  {/* Terms */}
                  <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      align="center"
                      sx={{ display: 'block', lineHeight: 1.5 }}
                    >
                      By signing up, you agree to our{' '}
                      <Link 
                        href="/terms-of-service" 
                        sx={{ 
                          color: 'inherit',
                          textDecoration: 'underline',
                          fontWeight: 500,
                        }}
                      >
                        Terms
                      </Link>{' '}
                      and{' '}
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
          </Fade>
        </Box>
      </Container>
    </Box>
  )
}