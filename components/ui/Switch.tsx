import React from 'react'
import { Box, Typography } from '@mui/material'

interface SwitchProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  sx?: any
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  sx = {}
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Box
        sx={{
          position: 'relative',
          width: 36,
          height: 20,
          borderRadius: 20,
          bgcolor: checked ? 'primary.main' : 'grey.400',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background-color 0.2s'
        }}
        onClick={() => {
          if (!disabled) {
            const event = { target: { checked: !checked } } as React.ChangeEvent<HTMLInputElement>
            onChange(event)
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: 'white',
            boxShadow: 1,
            transition: 'left 0.2s'
          }}
        />
      </Box>
      {label && (
        <Typography
          variant="body2"
          sx={{
            color: disabled ? 'text.disabled' : 'text.primary',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          onClick={() => {
            if (!disabled) {
              const event = { target: { checked: !checked } } as React.ChangeEvent<HTMLInputElement>
              onChange(event)
            }
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  )
}