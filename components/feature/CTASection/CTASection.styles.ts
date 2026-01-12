import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

interface CTASectionStylesProps {
  gradient?: string
}

export const useCTASectionStyles = makeStyles<Theme, CTASectionStylesProps>((theme) => ({
  root: {
    padding: theme.spacing(8, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 0)
    }
  },
  paper: {
    padding: theme.spacing(6, 4),
    textAlign: 'center',
    background: ({ gradient }) => gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    borderRadius: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      zIndex: 1
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8)
    }
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: 'white',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'relative',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
      lineHeight: 1.2
    }
  },
  subtitle: {
    marginBottom: theme.spacing(4),
    color: 'white',
    opacity: 0.9,
    position: 'relative',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem'
    }
  },
  buttonContainer: {
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2
  },
  trialButton: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    },
    transition: 'all 0.3s ease'
  },
  pricingButton: {
    borderColor: 'white',
    color: 'white',
    fontWeight: 500,
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)'
    },
    transition: 'all 0.3s ease'
  },
  dashboardButton: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    },
    transition: 'all 0.3s ease'
  },
  trialMessage: {
    marginTop: theme.spacing(2),
    opacity: 0.9,
    color: 'white',
    position: 'relative',
    zIndex: 2,
    fontSize: theme.typography.pxToRem(14),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(12)
    }
  }
}))