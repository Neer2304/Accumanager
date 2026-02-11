// app/verify-otp/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
  Snackbar,
} from '@mui/material'
import {
  Security,
  ArrowBack,
  Email,
  Phone,
  CheckCircle,
  Warning,
  Refresh,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Alert } from '@/components/ui/Alert'
import { Card, CardContent2 } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function VerifyOTPPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const router = useRouter()
  const darkMode = theme.palette.mode === 'dark'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  // Mock data
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
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('').slice(0, 6)
      setOtp(otpArray)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      const errorMsg = 'Please enter the complete 6-digit OTP'
      setError(errorMsg)
      showSnackbar(errorMsg, 'error')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      if (otpString === '123456') { // Demo OTP
        const successMsg = 'OTP verified successfully!'
        setSuccess(successMsg)
        showSnackbar(successMsg, 'success')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        const errorMsg = 'Invalid OTP. Please try again.'
        setError(errorMsg)
        showSnackbar(errorMsg, 'error')
      }
    }, 1500)
  }

  const handleResendOTP = () => {
    setCanResend(false)
    setTimer(60)
    setOtp(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    
    inputRefs.current[0]?.focus()
    
    setTimeout(() => {
      showSnackbar('New OTP sent successfully', 'success')
    }, 1000)
  }

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity })
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: { xs: 3, sm: 4 },
      px: { xs: 2, sm: 3 },
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: darkMode
          ? 'radial-gradient(circle at 20% 50%, #0d3064 0%, transparent 50%), radial-gradient(circle at 80% 20%, #202124 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, #e3f2fd 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f8f9fa 0%, transparent 50%)',
        zIndex: 0,
      }} />

      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          hover
          variant="elevation"
          sx={{
            borderRadius: '24px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            background: darkMode 
              ? 'linear-gradient(135deg, #303134 0%, #202124 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(66, 133, 244, 0.12)',
            overflow: 'hidden',
          }}
        >
          <CardContent2>
            {/* Header Section */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: 4,
              px: { xs: 2, sm: 3 },
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2, 
                mb: 2 
              }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#4285f420' : '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Security sx={{ 
                    fontSize: isMobile ? 28 : 32,
                    color: darkMode ? '#8ab4f8' : '#1a73e8'
                  }} />
                </Box>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight={500}
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                  }}
                >
                  Verify Your Identity
                </Typography>
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  mb: 1,
                }}
              >
                Enter the verification code sent to your {verificationMethod}
              </Typography>
            </Box>

            {/* Target Info Card */}
            <Card
              variant="outlined"
              hover={false}
              sx={{
                mb: 4,
                p: 2,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#4285f420' : '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {verificationMethod === 'email' ? (
                  <Email sx={{ 
                    fontSize: 24,
                    color: darkMode ? '#8ab4f8' : '#1a73e8'
                  }} />
                ) : (
                  <Phone sx={{ 
                    fontSize: 24,
                    color: darkMode ? '#8ab4f8' : '#1a73e8'
                  }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Verification code sent to
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight={500}
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  {target}
                </Typography>
              </Box>
            </Card>

            {/* Error/Success Alerts */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError('')}
                sx={{ mb: 3 }}
                icon={<Warning />}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                onClose={() => setSuccess('')}
                sx={{ mb: 3 }}
                icon={<CheckCircle />}
              >
                {success}
              </Alert>
            )}

            {/* OTP Inputs Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  textAlign: 'center',
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Enter 6-digit verification code
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 2 },
                  mb: 4,
                }}
              >
                {otp.map((digit, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: { xs: 44, sm: 52, md: 56 },
                      height: { xs: 44, sm: 52, md: 56 },
                    }}
                  >
                    <Box
                      component="input"
                      // ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      sx={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `2px solid ${
                          error 
                            ? '#ea4335'
                            : digit 
                              ? darkMode ? '#8ab4f8' : '#1a73e8'
                              : darkMode ? '#3c4043' : '#dadce0'
                        }`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        '&:focus': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? '#4285f440' : '#4285f420'}`,
                        },
                        '&:hover': {
                          borderColor: darkMode ? '#5f6368' : '#9aa0a6',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Timer/Resend Section */}
              <Box sx={{ 
                textAlign: 'center', 
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {canResend ? 'Didn\'t receive the code?' : 'Resend code in'}
                </Typography>
                
                {canResend ? (
                  <Button
                    onClick={handleResendOTP}
                    variant="text"
                    size="small"
                    iconLeft={<Refresh />}
                    sx={{
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? '#4285f420' : '#e3f2fd',
                      },
                    }}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    sx={{ 
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    00:{timer.toString().padStart(2, '0')}
                  </Typography>
                )}
              </Box>

              {/* Verify Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerify}
                disabled={isLoading || otp.join('').length !== 6}
                size="large"
                loading={isLoading}
                // loadingText="Verifying..."
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 500,
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  '&:hover': {
                    backgroundColor: darkMode ? '#669df6' : '#1669c1',
                    transform: 'translateY(-1px)',
                    boxShadow: darkMode 
                      ? '0 6px 20px rgba(138, 180, 248, 0.3)'
                      : '0 6px 20px rgba(26, 115, 232, 0.2)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#5f6368' : '#9aa0a6',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Verify & Continue
              </Button>
            </Box>

            {/* Footer Links */}
            <Box sx={{ 
              pt: 3,
              mt: 3,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}>
              <Button
                component={Link}
                href="/login"
                variant="text"
                size="small"
                iconLeft={<ArrowBack />}
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#e8eaed' : '#202124',
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                Back to Login
              </Button>

              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  textAlign: 'center',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Having trouble?{' '}
                <Box
                  component="span"
                  sx={{ 
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Contact support
                </Box>
              </Typography>
            </Box>
          </CardContent2>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}