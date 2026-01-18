// app/forgot-password/page.tsx
'use client'

import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Container,
  Fade,
  alpha,
  useTheme,
  useMediaQuery,
  Link,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from '@mui/material'
import { 
  ArrowBack, 
  Email, 
  Phone, 
  Security, 
  CheckCircle,
  ArrowForward 
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const steps = ['Enter Email', 'Verify OTP', 'Reset Password']

export default function ForgotPasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [method, setMethod] = useState<'email' | 'sms'>('email')

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setActiveStep(1)
      setSuccess(`Verification code sent to ${email}`)
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setActiveStep(2)
      setSuccess('OTP verified successfully')
    }, 1500)
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess('Password reset successfully! Redirecting to login...')
      
      // Redirect after success
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }, 2000)
  }

  const handleStepBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      setError('')
      setSuccess('')
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Enter your registered email address to receive a password reset OTP
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && activeStep === 0}
              helperText={activeStep === 0 ? error : ''}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSendOTP}
              disabled={isLoading || !email}
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
              }}
            >
              Send Verification Code
            </Button>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Enter the 6-digit verification code sent to{' '}
              <Box component="span" fontWeight="bold" color="primary">
                {email}
              </Box>
            </Typography>

            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              error={!!error && activeStep === 1}
              helperText={activeStep === 1 ? error : ''}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleStepBack}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                size={isMobile ? "medium" : "large"}
                sx={{
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
                }}
              >
                Verify OTP
              </Button>
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Enter your new password below
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!error && activeStep === 2}
              helperText="Must be at least 6 characters"
              sx={{ mb: 2 }}
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!error && activeStep === 2}
              helperText={activeStep === 2 ? error : ''}
              sx={{ mb: 3 }}
              size={isMobile ? "small" : "medium"}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleStepBack}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleResetPassword}
                disabled={isLoading || !newPassword || !confirmPassword}
                size={isMobile ? "medium" : "large"}
                sx={{
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
                }}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        )

      default:
        return null
    }
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
      {/* Decorative Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Fade in={true} timeout={600}>
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
            {/* Header */}
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
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Follow the steps to reset your password
              </Typography>
            </Box>

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {/* Stepper */}
              <Box sx={{ mb: 4 }}>
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel
                  connector={
                    <StepConnector 
                      sx={{ 
                        '& .MuiStepConnector-line': {
                          borderColor: theme.palette.divider,
                        },
                      }} 
                    />
                  }
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel 
                        StepIconProps={{
                          sx: {
                            '& .MuiStepIcon-root': {
                              color: theme.palette.divider,
                              '&.Mui-active': {
                                color: theme.palette.primary.main,
                              },
                              '&.Mui-completed': {
                                color: theme.palette.success.main,
                              },
                            },
                          },
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: activeStep === steps.indexOf(label) ? 600 : 400,
                            color: activeStep >= steps.indexOf(label) 
                              ? theme.palette.text.primary 
                              : theme.palette.text.secondary,
                          }}
                        >
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Messages */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }} 
                  onClose={() => setError('')}
                  variant="outlined"
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }} 
                  onClose={() => setSuccess('')}
                  variant="outlined"
                  icon={<CheckCircle />}
                >
                  {success}
                </Alert>
              )}

              {/* Step Content */}
              {renderStepContent(activeStep)}

              {/* Back to Login */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Link 
                  href="/login" 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <ArrowBack fontSize="small" />
                  Back to Login
                </Link>
              </Box>

              {/* Help Text */}
              {activeStep === 0 && (
                <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    align="center"
                    sx={{ display: 'block', lineHeight: 1.5 }}
                  >
                    Remember your password?{' '}
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
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}