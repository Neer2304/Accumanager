'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Link,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
} from '@mui/material'
import { 
  ArrowBack, 
  Email, 
  Security, 
  CheckCircle,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/user-auth/AuthCard'
import { OTPInput } from '@/components/user-auth/OTPInput'
import { PasswordStrengthIndicator } from '@/components/user-auth/PasswordStrengthIndicator'
import { COMMON_WORDS } from '@/contexts/commonWords'

const { AUTH, UI, MESSAGES } = COMMON_WORDS

const steps = ['Enter Email', 'Verify OTP', 'Reset Password']

export default function ForgotPasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveStep(1)
        setSuccess(`${AUTH.OTP_SENT} ${email}`)
        setTimer(60)
        setCanResend(false)
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError(MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError(AUTH.INVALID_OTP)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveStep(2)
        setSuccess(AUTH.OTP_VERIFIED)
      } else {
        setError(data.message || AUTH.INVALID_OTP)
      }
    } catch (err) {
      setError(MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setError(AUTH.PASSWORD_MISMATCH)
      return
    }

    if (newPassword.length < 6) {
      setError(AUTH.WEAK_PASSWORD)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: 'mock-reset-token', // In real app, get from context
          newPassword 
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`${AUTH.PASSWORD_RESET_SUCCESS}! ${AUTH.REDIRECTING_TO_LOGIN}`)
        
        // Redirect after success
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError(MESSAGES.NETWORK_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setCanResend(false)
    setTimer(60)
    setOtp(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    
    await handleSendOTP()
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
              {AUTH.ENTER_REGISTERED_EMAIL}
            </Typography>

            <TextField
              fullWidth
              label={AUTH.EMAIL_ADDRESS}
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
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {UI.PROCESSING}
                </Box>
              ) : (
                AUTH.SEND_CODE
              )}
            </Button>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {AUTH.ENTER_OTP_SENT_TO}{' '}
              <Box component="span" fontWeight="bold" color="primary">
                {email}
              </Box>
            </Typography>

            <OTPInput
              otp={otp}
              setOtp={setOtp}
              error={activeStep === 1 ? error : undefined}
            />

            {/* Timer/Resend */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {canResend ? (
                <Button
                  onClick={handleResendOTP}
                  variant="text"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {AUTH.RESEND} OTP
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {AUTH.RESEND} OTP in{' '}
                  <Box component="span" fontWeight="bold" color="primary">
                    00:{timer.toString().padStart(2, '0')}
                  </Box>
                </Typography>
              )}
            </Box>

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
                {UI.BACK}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.join('').length !== 6}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 3,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    {UI.PROCESSING}
                  </Box>
                ) : (
                  AUTH.VERIFY
                )}
              </Button>
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {AUTH.ENTER_NEW_PASSWORD}
            </Typography>

            <TextField
              fullWidth
              label={AUTH.NEW_PASSWORD}
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!error && activeStep === 2}
              helperText={activeStep === 2 ? error : ''}
              sx={{ mb: 2 }}
              size={isMobile ? "small" : "medium"}
            />

            <PasswordStrengthIndicator password={newPassword} />

            <TextField
              fullWidth
              label={AUTH.CONFIRM_PASSWORD}
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
                {UI.BACK}
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
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    {UI.PROCESSING}
                  </Box>
                ) : (
                  AUTH.RESET_PASSWORD
                )}
              </Button>
            </Box>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <AuthCard
      title={AUTH.FORGOT_PASSWORD}
      subtitle="Follow the steps to reset your password"
    >
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
    </AuthCard>
  )
}