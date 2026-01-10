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
import { 
  Visibility, 
  VisibilityOff,
  PersonAdd,
  Email,
  Lock,
  Store,
  CheckCircle,
  ArrowForward,
  RocketLaunch
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase, one lowercase, and one number'),
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
  const [animationStep, setAnimationStep] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const onSubmit = (data: RegisterFormData) => {
    clearError()
    const { confirmPassword, ...userData } = data
    registerUser(userData)
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  // Responsive padding values
  const containerPadding = isMobile ? 2 : isTablet ? 4 : 6
  const cardPadding = isMobile ? 2 : 3
  const inputMargin = isMobile ? 1.5 : 2

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        p: containerPadding,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: isMobile ? 100 : 150,
              height: isMobile ? 100 : 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, 
                ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                ${alpha(theme.palette.primary.main, 0)} 70%)`,
              top: `${20 + i * 30}%`,
              left: `${10 + i * 40}%`,
              animation: `float ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
              },
            }}
          />
        ))}
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 3 : 6,
          alignItems: 'center',
        }}
      >
        {/* Left Side - Hero Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            color: theme.palette.primary.main,
            maxWidth: isMobile ? '100%' : '50%',
            mb: isMobile ? 2 : 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              p: 1.5,
              borderRadius: 3,
            }}
          >
            <RocketLaunch sx={{ fontSize: isMobile ? 24 : 32 }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="bold"
              sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Start Your Journey
            </Typography>
          </Box>

          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            fontWeight="800"
            gutterBottom
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
              },
              lineHeight: 1.2,
            }}
          >
            Join Thousands of Successful{' '}
            <Box
              component="span"
              sx={{
                color: theme.palette.secondary.main,
                display: 'inline-block',
                animation: animationStep === 0 ? 'pulse 1.5s ease-in-out' : 'none',
              }}
            >
              Businesses
            </Box>
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: 4,
              fontSize: {
                xs: '0.95rem',
                sm: '1rem',
                md: '1.1rem',
              },
              lineHeight: 1.6,
            }}
          >
            Get started with AccumaManage and transform your business operations. 
            No credit card required for the 14-day free trial.
          </Typography>

          {/* Features List */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 4,
              width: '100%',
            }}
          >
            {[
              'Unlimited products during trial',
              'Advanced analytics dashboard',
            //   '24/7 customer support',s
              'Secure cloud storage',
              'Mobile app access',
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: index === animationStep 
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <CheckCircle 
                  sx={{ 
                    color: theme.palette.success.main,
                    fontSize: isMobile ? 18 : 20,
                  }} 
                />
                <Typography 
                  variant="body2" 
                  fontWeight="500"
                  sx={{ fontSize: isMobile ? '0.85rem' : '0.95rem' }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Trust Badges */}
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
            {['SSL Secure', 'GDPR Compliant', '99.9% Uptime'].map((badge) => (
              <Paper
                key={badge}
                elevation={0}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 20,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="caption" fontWeight="500">
                  {badge}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 500,
            width: '100%',
          }}
        >
          <Card 
            elevation={6}
            sx={{ 
              borderRadius: 4,
              overflow: 'visible',
              position: 'relative',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            }}
          >
            {/* Floating Badge */}
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                px: 3,
                py: 1,
                borderRadius: 20,
                bgcolor: theme.palette.success.main,
                color: 'white',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <RocketLaunch sx={{ fontSize: isMobile ? 16 : 18 }} />
              14-Day Free Trial
            </Paper>

            <CardContent sx={{ p: cardPadding, pt: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="700"
                  gutterBottom
                >
                  Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in your details to get started
                </Typography>
              </Box>

              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3 }} 
                    onClose={clearError}
                    icon={false}
                    variant="outlined"
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  {...register('name')}
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: inputMargin }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAdd color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                />

                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: inputMargin }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                />

                <TextField
                  {...register('shopName')}
                  fullWidth
                  label="Business/Shop Name (Optional)"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.shopName}
                  helperText={errors.shopName?.message}
                  sx={{ mb: inputMargin }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Store color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? "small" : "medium"}
                />

                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: inputMargin }}
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
                          onClick={toggleConfirmPasswordVisibility}
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || !isValid}
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
                      Creating Account...
                    </Box>
                  ) : (
                    'Start Free Trial'
                  )}
                </Button>

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
                      Sign In Here
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    align="center"
                    sx={{ display: 'block' }}
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
                      Terms of Service
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
        </Box>
      </Container>
    </Box>
  )
}