import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

interface FeatureItemStylesProps {
  color?: string
  highlight?: boolean
}

export const useFeatureItemStyles = makeStyles<Theme, FeatureItemStylesProps>((theme) => ({
  featureRoot: {
    padding: theme.spacing(3),
    height: '100%',
    border: ({ highlight }) => 
      highlight 
        ? `2px solid ${theme.palette.warning.main}` 
        : `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
      borderColor: ({ color }) => color || theme.palette.primary.main
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 4,
      height: '100%',
      background: ({ color }) => color || theme.palette.primary.main,
      opacity: 0.1
    }
  },
  featureContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  iconContainer: {
    color: ({ color }) => color || theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    fontSize: '2rem',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  highlightChip: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
    fontWeight: 600,
    fontSize: '0.7rem',
    height: 24
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontSize: '1.2rem'
  },
  description: {
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    fontSize: '0.95rem'
  }
}))