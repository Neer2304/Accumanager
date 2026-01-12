import React from 'react'
import { iconMap, IconName } from '@/data/featuresContent'
import { SxProps } from '@mui/material'

interface IconProps {
  name: IconName
  fontSize?: number
  color?: string
  sx?: SxProps
  className?: string
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  fontSize = 24, 
  color, 
  sx,
  className 
}) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return (
    <IconComponent
      sx={{ 
        fontSize, 
        color,
        ...sx
      }}
      className={className}
    />
  )
}