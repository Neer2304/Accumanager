import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

interface CategoryCardStylesProps {
  color?: string
}

export const useCategoryCardStyles = makeStyles<Theme, CategoryCardStylesProps>((theme) => ({
  cardRoot: {
    height: '100%',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-12px)',
      boxShadow: theme.shadows[10],
      '&::before': {
        transform: 'scaleX(1)'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: ({ color }) => color || theme.palette.primary.main,
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
      zIndex: 1
    }
  },
  cardContent: {
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3)
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },
  iconWrapper: {
    color: ({ color }) => color || theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem',
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontSize: '1.5rem'
  },
  description: {
    color: theme.palette.text.secondary,
    marginBottom: 0,
    fontSize: '0.95rem',
    lineHeight: 1.5
  },
  divider: {
    margin: theme.spacing(2, 0),
    backgroundColor: ({ color }) => `${color}20` || `${theme.palette.primary.main}20`
  },
  featureList: {
    flexGrow: 1
  },
  featureItem: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: theme.spacing(1.5),
    '&:last-child': {
      marginBottom: 0
    }
  },
  featureIcon: {
    color: ({ color }) => color || theme.palette.primary.main,
    minWidth: 36
  },
  featureTitle: {
    fontWeight: 600,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5)
  },
  featureDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    lineHeight: 1.4
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(3)
  },
  featureCount: {
    backgroundColor: ({ color }) => `${color}10` || `${theme.palette.primary.main}10`,
    color: ({ color }) => color || theme.palette.primary.main,
    fontWeight: 500,
    border: 'none'
  },
  viewButton: {
    color: ({ color }) => color || theme.palette.primary.main,
    fontWeight: 500,
    textTransform: 'none',
    fontSize: '0.85rem',
    '&:hover': {
      backgroundColor: ({ color }) => `${color}10` || `${theme.palette.primary.main}10`
    }
  }
}))