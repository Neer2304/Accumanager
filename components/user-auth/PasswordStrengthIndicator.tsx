'use client'

import React from 'react'
import {
  Box,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { COMMON_WORDS } from '@/contexts/commonWords'

const { AUTH } = COMMON_WORDS

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
}

export function PasswordStrengthIndicator({ 
  password,
  showRequirements = true
}: PasswordStrengthIndicatorProps) {
  const theme = useTheme()

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
    if (strength < 40) return AUTH.WEAK
    if (strength < 70) return AUTH.MEDIUM
    return AUTH.STRONG
  }

  const strength = calculatePasswordStrength(password)
  const strengthColor = getStrengthColor(strength)
  const strengthText = getStrengthText(strength)

  const passwordRequirements = [
    { label: AUTH.AT_LEAST_6_CHARS, met: (p: string) => p.length >= 6 },
    { label: AUTH.CONTAINS_UPPERCASE, met: (p: string) => /[A-Z]/.test(p) },
    { label: AUTH.CONTAINS_LOWERCASE, met: (p: string) => /[a-z]/.test(p) },
    { label: AUTH.CONTAINS_NUMBER, met: (p: string) => /[0-9]/.test(p) },
    { label: AUTH.CONTAINS_SPECIAL_CHAR, met: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {AUTH.PASSWORD_STRENGTH}
        </Typography>
        <Typography 
          variant="caption" 
          fontWeight="bold"
          color={strengthColor}
        >
          {strengthText}
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
            width: `${strength}%`,
            backgroundColor: strengthColor,
            transition: 'all 0.3s ease',
          }}
        />
      </Box>

      {/* Password Requirements */}
      {showRequirements && password && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {AUTH.PASSWORD_REQUIREMENTS}
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
                    backgroundColor: req.met(password)
                      ? theme.palette.success.main
                      : alpha(theme.palette.text.secondary, 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: 'white',
                  }}
                >
                  {req.met(password) ? '✓' : ''}
                </Box>
                <Typography 
                  variant="caption" 
                  color={req.met(password) ? 'text.primary' : 'text.secondary'}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {req.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}