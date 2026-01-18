// app/change-password/page.tsx
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
  IconButton,
} from '@mui/material'
import { 
  ArrowBack, 
  Lock, 
  Visibility, 
  VisibilityOff,
  CheckCircle,
  Security
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  
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
    if (strength < 40) return theme.palette.error.main
    if (strength < 70) return theme.palette.warning.main
    return theme.palette.success.main
  }

  const getStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak'
    if (strength < 70) return 'Medium'
    return 'Strong'
  }

  const handleSubmit = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess('Password changed successfully!')
      
      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStrength(0)
      
      // Auto-clear success message
      setTimeout(() => {
        setSuccess('')
      }, 3000)
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
                  Change Password
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Update your account password
              </Typography>
            </Box>

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
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

              {/* Current Password */}
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
              />

              {/* New Password */}
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                variant="outlined"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
              />

              {/* Password Strength */}
              {newPassword && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="bold"
                      color={getStrengthColor(passwordStrength)}
                    >
                      {getStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      width: '100%',
                      backgroundColor: alpha(theme.palette.divider, 0.3),
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
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
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
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: req.met(newPassword)
                                ? theme.palette.success.main
                                : alpha(theme.palette.text.secondary, 0.2),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              color: 'white',
                            }}
                          >
                            {req.met(newPassword) ? '✓' : ''}
                          </Box>
                          <Typography 
                            variant="caption" 
                            color={req.met(newPassword) ? 'text.primary' : 'text.secondary'}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {req.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== '' && newPassword !== confirmPassword}
                helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
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
                {isLoading ? 'Updating Password...' : 'Change Password'}
              </Button>

              {/* Back Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link 
                  href="/dashboard" 
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
                  Back to Dashboard
                </Link>
              </Box>

              {/* Security Note */}
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  align="center"
                  sx={{ display: 'block', lineHeight: 1.5 }}
                >
                  <Security fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  For security reasons, please choose a strong password that you haven't used before.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}