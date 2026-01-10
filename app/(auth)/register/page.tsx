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
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
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
                Create Account
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Start your 14-day free trial. No credit card required.
              </Typography>
            </Box>

            {/* Free Trial Badge */}
            <Box 
              sx={{ 
                bgcolor: 'success.light', 
                color: 'success.contrastText',
                py: 1,
                px: 2,
                borderRadius: 2,
                textAlign: 'center',
                mb: 3
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                🎉 14-Day Free Trial Included
              </Typography>
              <Typography variant="caption">
                Access all features during your trial period
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
                {...register('name')}
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('email')}
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('shopName')}
                margin="normal"
                fullWidth
                label="Shop/Business Name (Optional)"
                error={!!errors.shopName}
                helperText={errors.shopName?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('password')}
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
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
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('confirmPassword')}
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ 
                  mt: 2, 
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
                      Creating Your Account...
                    </Box>
                  </>
                ) : (
                  'Start Free Trial'
                )}
              </Button>
              
              {/* Features included in trial */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  🚀 Included in your free trial:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, fontSize: '0.875rem' }}>
                  <li>Full access to all features</li>
                  <li>Up to 100 products</li>
                  <li>Up to 500 customers</li>
                  <li>Basic analytics & reports</li>
                  <li>Mobile app access</li>
                </Box>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ textDecoration: 'none' }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="white">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}