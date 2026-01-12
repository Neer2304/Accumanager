import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

export const useCategoryTabsStyles = makeStyles((theme: Theme) => ({
  tabsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1),
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      '&:not(:first-of-type)': {
        borderRadius: theme.spacing(2)
      },
      '&:first-of-type': {
        borderRadius: theme.spacing(2)
      }
    }
  },
  tabButton: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.5, 3),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary
    }
  },
  activeTab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText
    }
  }
}))