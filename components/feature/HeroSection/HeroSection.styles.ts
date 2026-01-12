import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

interface HeroSectionStylesProps {
  gradient?: string
  overlay?: string
}

export const useHeroSectionStyles = makeStyles<Theme, HeroSectionStylesProps>((theme) => ({
  heroRoot: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(10),
    background: ({ gradient }) => gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: ({ overlay }) => overlay || 'rgba(0, 0, 0, 0.2)',
      zIndex: 1
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(6)
    }
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: 800,
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  },
  heroChip: {
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& .MuiChip-label': {
      padding: 0
    }
  },
  heroTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    color: 'white',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
      lineHeight: 1.2
    }
  },
  heroSubtitle: {
    opacity: 0.95,
    marginBottom: theme.spacing(4),
    color: 'white',
    fontWeight: 400,
    lineHeight: 1.6,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
      padding: theme.spacing(0, 2)
    }
  }
}))