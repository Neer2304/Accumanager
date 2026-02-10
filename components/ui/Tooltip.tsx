import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'

interface TooltipProps {
  title: string
  children: React.ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  arrow?: boolean
  sx?: any
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  arrow = true,
  sx = {}
}) => {
  const [open, setOpen] = useState(false)

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  const placementStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', mb: 1 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', mt: 1 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', mr: 1 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', ml: 1 }
  }

  return (
    <Box
      sx={{ position: 'relative', display: 'inline-block', ...sx }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {open && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 9999,
            ...placementStyles[placement],
            px: 1.5,
            py: 0.75,
            bgcolor: 'grey.900',
            color: 'white',
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {arrow && (
            <Box
              sx={{
                position: 'absolute',
                ...(placement === 'top' && {
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid',
                  borderTopColor: 'grey.900'
                }),
                ...(placement === 'bottom' && {
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '4px solid',
                  borderBottomColor: 'grey.900'
                }),
                ...(placement === 'left' && {
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft: '4px solid',
                  borderLeftColor: 'grey.900'
                }),
                ...(placement === 'right' && {
                  right: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '4px solid',
                  borderRightColor: 'grey.900'
                })
              }}
            />
          )}
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  )
}