'use client'

import React, { useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { COMMON_WORDS } from '@/contexts/commonWords'

const { AUTH } = COMMON_WORDS

interface OTPInputProps {
  otp: string[]
  setOtp: (otp: string[]) => void
  error?: string
  length?: number
  autoFocus?: boolean
}

export function OTPInput({
  otp,
  setOtp,
  error,
  length = 6,
  autoFocus = true
}: OTPInputProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  if (inputRefs.current.length !== length) {
    inputRefs.current = Array(length).fill(null)
  }

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow numbers
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
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
      const otpArray = pastedData.split('').slice(0, length)
      setOtp(otpArray)
      
      // Focus last input
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="body1" 
        align="center" 
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        {AUTH.ENTER_OTP_SENT_TO.split('6-digit')[0]}6-digit verification code
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
              ref={el => {
                if (el) {
                  inputRefs.current[index] = el
                }
              }}
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
    </Box>
  )
}