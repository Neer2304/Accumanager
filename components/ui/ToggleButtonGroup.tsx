import React from 'react'
import { Box } from '@mui/material'

interface ToggleButtonGroupProps {
  value: any
  exclusive?: boolean
  onChange: (event: React.MouseEvent<HTMLElement>, newValue: any) => void
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  sx?: any
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  value,
  exclusive = true,
  onChange,
  children,
  size = 'medium',
  fullWidth = false,
  sx = {}
}) => {
  const handleChange = (newValue: any) => {
    onChange(null, newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        p: 0.5,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        width: fullWidth ? '100%' : 'auto',
        ...sx
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            selected: exclusive ? value === child.props.value : value.includes(child.props.value),
            onClick: () => handleChange(child.props.value),
            size,
            sx: { flex: fullWidth ? 1 : undefined }
          })
        }
        return child
      })}
    </Box>
  )
}