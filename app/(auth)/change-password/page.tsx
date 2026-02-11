// app/change-password/page.tsx
'use client'

import React, { useState } from 'react'
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
  ArrowBack, 
  Lock, 
  Visibility, 
  VisibilityOff,
  CheckCircle,
  Security,
  Warning
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Alert } from '@/components/ui/Alert'
import { Card, CardContent2 } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ChangePasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const router = useRouter()
  const darkMode = theme.palette.mode === 'dark'
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    return (strength / 5) * 100
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return '#ea4335' // Google Red
    if (strength < 70) return '#fbbc04' // Google Yellow
    return '#34a853' // Google Green
  }

  const getStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak'
    if (strength < 70) return 'Medium'
    return 'Strong'
  }

  const handleSubmit = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      const errorMsg = 'Please fill in all fields'
      setError(errorMsg)
      showSnackbar(errorMsg, 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      const errorMsg = 'New passwords do not match'
      setError(errorMsg)
      showSnackbar(errorMsg, 'error')
      return
    }

    if (newPassword.length < 6) {
      const errorMsg = 'Password must be at least 6 characters'
      setError(errorMsg)
      showSnackbar(errorMsg, 'error')
      return
    }

    if (newPassword === currentPassword) {
      const errorMsg = 'New password must be different from current password'
      setError(errorMsg)
      showSnackbar(errorMsg, 'error')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      const successMsg = 'Password changed successfully!'
      setSuccess(successMsg)
      showSnackbar(successMsg, 'success')
      
      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStrength(0)
    }, 2000)
  }

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const passwordRequirements = [
    { label: 'At least 6 characters', met: (p: string) => p.length >= 6 },
    { label: 'Contains uppercase letter', met: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', met: (p: string) => /[a-z]/.test(p) },
    { label: 'Contains number', met: (p: string) => /[0-9]/.test(p) },
    { label: 'Contains special character', met: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]

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
                  Change Password
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
                Update your account password for enhanced security
              </Typography>
            </Box>

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

            {/* Current Password */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                }}
              >
                Current Password
              </Typography>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                startIcon={<Lock />}
                endIcon={
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    sx={{
                      minWidth: 'auto',
                      p: 0.5,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                }
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:focus': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? '#4285f440' : '#4285f420'}`,
                  },
                }}
              />
            </Box>

            {/* New Password */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                }}
              >
                New Password
              </Typography>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                placeholder="Enter new password"
                startIcon={<Lock />}
                endIcon={
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    sx={{
                      minWidth: 'auto',
                      p: 0.5,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                }
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:focus': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? '#4285f440' : '#4285f420'}`,
                  },
                }}
              />

              {/* Password Strength Indicator */}
              {newPassword && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Password Strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight={600}
                      sx={{ 
                        color: getStrengthColor(passwordStrength),
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {getStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      width: '100%',
                      backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor(passwordStrength),
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>

                  {/* Password Requirements */}
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        mb: 1,
                        display: 'block',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Password must contain:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {passwordRequirements.map((req, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: req.met(newPassword)
                                ? '#34a853'
                                : darkMode ? '#3c4043' : '#e0e0e0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              color: 'white',
                            }}
                          >
                            {req.met(newPassword) ? '✓' : ''}
                          </Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: req.met(newPassword) 
                                ? (darkMode ? '#e8eaed' : '#202124')
                                : (darkMode ? '#9aa0a6' : '#5f6368'),
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            }}
                          >
                            {req.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                }}
              >
                Confirm New Password
              </Typography>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                startIcon={<Lock />}
                error={confirmPassword !== '' && newPassword !== confirmPassword}
                helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
                endIcon={
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{
                      minWidth: 'auto',
                      p: 0.5,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                }
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: confirmPassword !== '' && newPassword !== confirmPassword
                    ? '#ea4335'
                    : darkMode ? '#3c4043' : '#dadce0',
                  '&:focus': {
                    borderColor: confirmPassword !== '' && newPassword !== confirmPassword
                      ? '#ea4335'
                      : darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: confirmPassword !== '' && newPassword !== confirmPassword
                      ? '0 0 0 3px rgba(234, 67, 53, 0.2)'
                      : `0 0 0 3px ${darkMode ? '#4285f440' : '#4285f420'}`,
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
              size="large"
              loading={isLoading}
              // loadingText="Updating Password..."
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
                mb: 2,
              }}
            >
              Change Password
            </Button>

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
                href="/dashboard"
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
                Back to Dashboard
              </Button>

              {/* Security Note */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                textAlign: { xs: 'center', sm: 'right' },
              }}>
                <Security sx={{ 
                  fontSize: 14,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    maxWidth: 300,
                  }}
                >
                  Choose a strong password that you haven't used before
                </Typography>
              </Box>
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