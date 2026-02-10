import React from 'react'
import { Box } from '@mui/material'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'fullWidth' | 'inset' | 'middle'
  sx?: any
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  sx = {}
}) => {
  return (
    <Box
      sx={{
        ...(orientation === 'horizontal' && {
          width: variant === 'fullWidth' ? '100%' : variant === 'inset' ? 'calc(100% - 16px)' : 'calc(100% - 32px)',
          height: '1px',
          bgcolor: 'divider',
          mx: variant === 'fullWidth' ? 0 : variant === 'inset' ? 2 : 4
        }),
        ...(orientation === 'vertical' && {
          width: '1px',
          height: '100%',
          bgcolor: 'divider',
          my: variant === 'fullWidth' ? 0 : 1
        }),
        ...sx
      }}
    />
  )
}