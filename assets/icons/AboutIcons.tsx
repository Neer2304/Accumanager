import {
  RocketLaunch,
  TrendingUp,
  Shield,
  Diversity3,
  CheckCircle,
  ArrowForward,
  Business,
  Star,
  Verified
} from '@mui/icons-material'
import { SxProps, Theme } from '@mui/material'

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge'
  color?: string
  sx?: SxProps<Theme>
}

// Company Values Icons
export const InnovationIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 24,
    medium: 32,
    large: 40,
    extraLarge: 48
  }[size]

  return (
    <RocketLaunch sx={{ fontSize, color, ...sx }} />
  )
}

export const SecurityIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 24,
    medium: 32,
    large: 40,
    extraLarge: 48
  }[size]

  return (
    <Shield sx={{ fontSize, color, ...sx }} />
  )
}

export const GrowthIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 24,
    medium: 32,
    large: 40,
    extraLarge: 48
  }[size]

  return (
    <TrendingUp sx={{ fontSize, color, ...sx }} />
  )
}

export const CommunityIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 24,
    medium: 32,
    large: 40,
    extraLarge: 48
  }[size]

  return (
    <Diversity3 sx={{ fontSize, color, ...sx }} />
  )
}

// General Purpose Icons
export const CheckCircleIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size]

  return (
    <CheckCircle sx={{ fontSize, color, ...sx }} />
  )
}

export const ArrowForwardIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 20,
    large: 24,
    extraLarge: 32
  }[size]

  return (
    <ArrowForward sx={{ fontSize, color, ...sx }} />
  )
}

export const BusinessIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 24,
    medium: 32,
    large: 40,
    extraLarge: 48
  }[size]

  return (
    <Business sx={{ fontSize, color, ...sx }} />
  )
}

export const StarIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size]

  return (
    <Star sx={{ fontSize, color, ...sx }} />
  )
}

export const VerifiedIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 20,
    large: 24,
    extraLarge: 32
  }[size]

  return (
    <Verified sx={{ fontSize, color, ...sx }} />
  )
}

// Export all icons as an object for easy access
export const AboutIcons = {
  Innovation: InnovationIcon,
  Security: SecurityIcon,
  Growth: GrowthIcon,
  Community: CommunityIcon,
  CheckCircle: CheckCircleIcon,
  ArrowForward: ArrowForwardIcon,
  Business: BusinessIcon,
  Star: StarIcon,
  Verified: VerifiedIcon
}