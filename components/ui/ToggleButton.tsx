import React from 'react'
import { Box, Typography } from '@mui/material'

interface ToggleButtonProps {
  value: any
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  sx?: any
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  selected = false,
  onClick,
  children,
  size = 'medium',
  disabled = false,
  sx = {}
}) => {
  const padding = {
    small: '4px 8px',
    medium: '6px 12px',
    large: '8px 16px'
  }

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: size === 'small' ? 1.5 : size === 'medium' ? 2 : 2.5,
        py: size === 'small' ? 0.5 : size === 'medium' ? 1 : 1.5,
        borderRadius: 0.75,
        bgcolor: selected ? 'primary.main' : 'transparent',
        color: selected ? 'primary.contrastText' : 'text.primary',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1,
        '&:hover': !disabled && {
          bgcolor: selected ? 'primary.dark' : 'action.hover'
        },
        ...sx
      }}
    >
      <Typography
        variant={size === 'small' ? 'caption' : 'body2'}
        sx={{
          fontWeight: selected ? 600 : 400,
          fontSize: size === 'small' ? '0.75rem' : size === 'medium' ? '0.875rem' : '1rem'
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}