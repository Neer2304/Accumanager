// components/advance/QuickActions.tsx
'use client'

import { Box, Button, IconButton, Typography, Chip } from '@mui/material'
import {
  Add,
  TrendingUp,
  Settings,
  Download,
  Refresh,
  Notifications,
  BarChart,
  Email,
  Schedule,
  People,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

export default function QuickActions() {
  const { currentScheme } = useAdvanceThemeContext()

  const actions = [
    {
      icon: <Add />,
      label: 'New Order',
      color: currentScheme.colors.primary,
      onClick: () => console.log('Create new order')
    },
    {
      icon: <TrendingUp />,
      label: 'Generate Report',
      color: currentScheme.colors.secondary,
      onClick: () => console.log('Generate report')
    },
    {
      icon: <Email />,
      label: 'Send Campaign',
      color: currentScheme.colors.buttons.text,
      onClick: () => console.log('Send campaign')
    },
    {
      icon: <Schedule />,
      label: 'Schedule Job',
      color: currentScheme.colors.buttons.warning,
      onClick: () => console.log('Schedule job')
    },
    {
      icon: <People />,
      label: 'Add Customer',
      color: currentScheme.colors.buttons.success,
      onClick: () => console.log('Add customer')
    },
    {
      icon: <BarChart />,
      label: 'View Analytics',
      color: currentScheme.colors.buttons.error,
      onClick: () => console.log('View analytics')
    }
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outlined"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{
              flex: '1 0 calc(50% - 12px)',
              minWidth: 140,
              borderColor: `${action.color}40`,
              color: currentScheme.colors.text.primary,
              '&:hover': {
                borderColor: action.color,
                backgroundColor: `${action.color}10`,
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>

      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
        Quick Tools
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[
          { icon: <Download />, tooltip: 'Export Data' },
          { icon: <Refresh />, tooltip: 'Refresh' },
          { icon: <Settings />, tooltip: 'Settings' },
          { icon: <Notifications />, tooltip: 'Notifications' },
        ].map((tool, index) => (
          <IconButton
            key={index}
            sx={{
              bgcolor: `${currentScheme.colors.components.border}20`,
              color: currentScheme.colors.text.primary,
              '&:hover': {
                bgcolor: `${currentScheme.colors.primary}20`,
              },
            }}
            title={tool.tooltip}
          >
            {tool.icon}
          </IconButton>
        ))}
      </Box>
    </Box>
  )
}