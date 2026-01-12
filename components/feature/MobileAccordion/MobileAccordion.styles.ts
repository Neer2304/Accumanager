import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

export const useMobileAccordionStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main
  },
  accordion: {
    marginBottom: theme.spacing(2),
    borderRadius: `${theme.spacing(2)} !important`,
    overflow: 'hidden',
    '&:before': {
      display: 'none'
    },
    '&.Mui-expanded': {
      margin: theme.spacing(0, 0, 2, 0)
    }
  },
  accordionSummary: {
    backgroundColor: theme.palette.primary.light + '10',
    borderRadius: theme.spacing(2),
    '&.Mui-expanded': {
      minHeight: 48,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  summaryContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%'
  },
  categoryIcon: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem'
  },
  categoryTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  categoryDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem'
  },
  accordionDetails: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default
  },
  featureList: {
    padding: 0
  },
  featureItem: {
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  featureIcon: {
    color: theme.palette.primary.main,
    minWidth: 40
  },
  featureTitle: {
    fontWeight: 600,
    fontSize: '0.95rem'
  },
  featureDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.85rem'
  }
}))