import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

interface BenefitCardStylesProps {
  gradient?: string
}

export const useBenefitCardStyles = makeStyles<Theme, BenefitCardStylesProps>((theme) => ({
  benefitRoot: {
    padding: theme.spacing(4),
    height: '100%',
    borderRadius: theme.spacing(3),
    background: ({ gradient }) => gradient || `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: theme.shadows[10]
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      zIndex: 1
    }
  },
  benefitContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapper: {
    marginBottom: theme.spacing(3),
    fontSize: '3rem',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
    animation: '$float 3s ease-in-out infinite'
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    fontSize: '1.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  description: {
    opacity: 0.9,
    lineHeight: 1.6,
    fontSize: '1rem'
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)'
    },
    '50%': {
      transform: 'translateY(-10px)'
    }
  }
}))