// app/verify-otp/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  CircularProgress,
} from '@mui/material'
import { Security, ArrowBack, Email, Phone } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function VerifyOTPPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Mock data - in real app, get from state/context
  const verificationMethod = 'email' // or 'sms'
  const target = verificationMethod === 'email' ? 'user@example.com' : '+91 98765 43210'

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer, canResend])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow numbers
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('').slice(0, 6)
      setOtp(otpArray)
      
      // Focus last input
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      // Mock verification - always success for demo
      if (otpString === '123456') { // Demo OTP
        setSuccess('OTP verified successfully!')
        
        // Redirect after success
        setTimeout(() => {
          router.push('/dashboard') // Change to your success route
        }, 1500)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    }, 1500)
  }

  const handleResendOTP = () => {
    setCanResend(false)
    setTimer(60)
    setOtp(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    
    // Focus first input
    inputRefs.current[0]?.focus()
    
    // Simulate resend API call
    setTimeout(() => {
      // In real app, show success message from API
      console.log('OTP resent successfully')
    }, 1000)
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                <Security sx={{ fontSize: isMobile ? 28 : 32 }} />
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight="700"
                >
                  Verify Identity
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Enter the verification code sent to your {verificationMethod}
              </Typography>
            </Box>

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {/* Target Info */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.light, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.light, 0.2)}`,
                }}
              >
                {verificationMethod === 'email' ? (
                  <Email color="primary" />
                ) : (
                  <Phone color="primary" />
                )}
                <Typography 
                  variant="body1" 
                  fontWeight="600"
                  color="primary"
                >
                  {target}
                </Typography>
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
                >
                  {success}
                </Alert>
              )}

              {/* OTP Inputs */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ mb: 3, color: 'text.secondary' }}
                >
                  Enter 6-digit verification code
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? 1 : 2,
                    mb: 3,
                  }}
                >
                  {otp.map((digit, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: isMobile ? 44 : 52,
                        height: isMobile ? 44 : 52,
                      }}
                    >
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        style={{
                          width: '100%',
                          height: '100%',
                          textAlign: 'center',
                          fontSize: isMobile ? '1.5rem' : '1.75rem',
                          fontWeight: 'bold',
                          borderRadius: 12,
                          border: `2px solid ${
                            error 
                              ? theme.palette.error.main 
                              : digit 
                                ? theme.palette.primary.main 
                                : theme.palette.divider
                          }`,
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = theme.palette.primary.main
                          e.target.style.boxShadow = `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = digit 
                            ? theme.palette.primary.main 
                            : theme.palette.divider
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </Box>
                  ))}
                </Box>

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
                      Resend OTP
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Resend OTP in{' '}
                      <Box component="span" fontWeight="bold" color="primary">
                        00:{timer.toString().padStart(2, '0')}
                      </Box>
                    </Typography>
                  )}
                </Box>

                {/* Verify Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerify}
                  disabled={isLoading || otp.join('').length !== 6}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Verifying...
                    </Box>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>
              </Box>

              {/* Back Link */}
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
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  align="center"
                  sx={{ display: 'block', lineHeight: 1.5 }}
                >
                  Didn't receive the code? Check your spam folder or{' '}
                  <Button
                    onClick={handleResendOTP}
                    variant="text"
                    sx={{
                      fontSize: 'inherit',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      color: 'inherit',
                      textDecoration: 'underline',
                      p: 0,
                      minWidth: 'auto',
                      verticalAlign: 'baseline',
                    }}
                  >
                    resend
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}