'use client'

import { AboutIcons } from '@/assets/icons/AboutIcons'
import { SxProps, Theme } from '@mui/material'

export interface AboutIconProps {
  name: keyof typeof AboutIcons
  size?: 'small' | 'medium' | 'large' | 'extraLarge'
  color?: string
  sx?: SxProps<Theme>
}

export const AboutIcon = ({ name, size = 'medium', color, sx }: AboutIconProps) => {
  const IconComponent = AboutIcons[name]
  return <IconComponent size={size} color={color} sx={sx} />
}

// Specific icon components for About page
export const ValuesIcon = ({ 
  valueName, 
  size = 'medium',
  color,
  sx 
}: { 
  valueName: string
  size?: 'small' | 'medium' | 'large' | 'extraLarge'
  color?: string
  sx?: SxProps<Theme>
}) => {
  const iconMap: Record<string, keyof typeof AboutIcons> = {
    'Innovation': 'Innovation',
    'Security': 'Security',
    'Growth': 'Growth',
    'Community': 'Community'
  }

  const iconName = iconMap[valueName] || 'Innovation'
  return <AboutIcon name={iconName} size={size} color={color} sx={sx} />
}