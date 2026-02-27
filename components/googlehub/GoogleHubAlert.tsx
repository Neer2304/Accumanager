// components/googlehub/GoogleHubAlert.tsx
'use client'

import React from 'react'
import {
  Alert as MuiAlert,
  AlertTitle,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { AlertProps, googleColors } from './types'

export default function GoogleHubAlert({
  type,
  title,
  message,
  action,
  onClose,
  sx,
}: AlertProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  const getAlertColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: darkMode ? alpha(googleColors.green, 0.1) : alpha(googleColors.green, 0.05),
          border: alpha(googleColors.green, 0.2),
          color: darkMode ? '#81c995' : googleColors.green,
        }
      case 'error':
        return {
          bg: darkMode ? alpha(googleColors.red, 0.1) : alpha(googleColors.red, 0.05),
          border: alpha(googleColors.red, 0.2),
          color: darkMode ? '#f28b82' : googleColors.red,
        }
      case 'warning':
        return {
          bg: darkMode ? alpha(googleColors.yellow, 0.1) : alpha(googleColors.yellow, 0.05),
          border: alpha(googleColors.yellow, 0.2),
          color: darkMode ? '#fdd663' : googleColors.yellow,
        }
      case 'info':
        return {
          bg: darkMode ? alpha(googleColors.blue, 0.1) : alpha(googleColors.blue, 0.05),
          border: alpha(googleColors.blue, 0.2),
          color: darkMode ? '#8ab4f8' : googleColors.blue,
        }
    }
  }

  const colors = getAlertColors()

  return (
    <MuiAlert
      severity={type}
      sx={{
        borderRadius: 2,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: darkMode ? '#e8eaed' : googleColors.black,
        '& .MuiAlert-icon': {
          color: colors.color,
        },
        ...sx,
      }}
      action={
        onClose ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        ) : action
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MuiAlert>
  )
}