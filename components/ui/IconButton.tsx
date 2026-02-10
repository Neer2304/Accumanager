import React from 'react'
import { Box } from '@mui/material'

interface IconButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  size?: 'small' | 'medium' | 'large'
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  disabled?: boolean
  sx?: any
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  size = 'medium',
  color = 'default',
  disabled = false,
  sx = {}
}) => {
  const sizeMap = {
    small: { padding: 0.5, iconSize: 20 },
    medium: { padding: 1, iconSize: 24 },
    large: { padding: 1.5, iconSize: 28 }
  }

  const colorMap = {
    default: { color: 'text.secondary', hover: 'action.hover' },
    primary: { color: 'primary.main', hover: 'primary.50' },
    secondary: { color: 'secondary.main', hover: 'secondary.50' },
    error: { color: 'error.main', hover: 'error.50' },
    info: { color: 'info.main', hover: 'info.50' },
    success: { color: 'success.main', hover: 'success.50' },
    warning: { color: 'warning.main', hover: 'warning.50' }
  }

  const { padding, iconSize } = sizeMap[size]
  const colorSet = colorMap[color]

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: iconSize + padding * 8,
        height: iconSize + padding * 8,
        borderRadius: '50%',
        color: colorSet.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        '&:hover': !disabled && {
          bgcolor: colorSet.hover
        },
        '& svg': {
          fontSize: iconSize
        },
        ...sx
      }}
    >
      {children}
    </Box>
  )
}