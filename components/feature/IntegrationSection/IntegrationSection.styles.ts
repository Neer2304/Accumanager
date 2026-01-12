import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

export const useIntegrationSectionStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(8, 0),
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 0)
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(6),
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(4)
    }
  },
  leftContent: {
    flex: 1
  },
  rightContent: {
    flex: 1,
    width: '100%'
  },
  integrationChip: {
    marginBottom: theme.spacing(2),
    fontWeight: 600
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.dark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem'
    }
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    fontWeight: 500
  },
  description: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    lineHeight: 1.7
  },
  chipsContainer: {
    flexWrap: 'wrap',
    gap: theme.spacing(1)
  },
  chip: {
    fontWeight: 500,
    '&.MuiChip-filledPrimary': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    '&.MuiChip-filledSecondary': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText
    }
  },
  apiPaper: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[4]
  },
  apiTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
  },
  apiDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    lineHeight: 1.6
  },
  apiList: {
    marginTop: theme.spacing(2)
  },
  apiListItem: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0
    }
  },
  apiListIcon: {
    color: theme.palette.primary.main,
    minWidth: 40
  },
  apiFeatureTitle: {
    fontWeight: 600,
    fontSize: '1rem'
  },
  apiFeatureDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem'
  }
}))