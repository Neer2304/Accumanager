// components/advance/InsightCard.tsx
'use client'

import { Paper, Typography, Box, Button } from '@mui/material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface InsightCardProps {
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  action?: {
    label: string
    onClick: () => void
  }
}

export default function InsightCard({ title, message, type, action }: InsightCardProps) {
  const { currentScheme } = useAdvanceThemeContext()

  const getColor = () => {
    switch (type) {
      case 'success':
        return currentScheme.colors.buttons.success
      case 'warning':
        return currentScheme.colors.buttons.warning
      case 'error':
        return currentScheme.colors.buttons.error
      default:
        return currentScheme.colors.buttons.text
    }
  }

  return (
    <Paper
      sx={{
        p: 2,
        borderLeft: `4px solid ${getColor()}`,
        background: `${getColor()}10`,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 2 : 0 }}>
        {message}
      </Typography>
      {action && (
        <Button
          variant="outlined"
          size="small"
          onClick={action.onClick}
          sx={{
            borderColor: getColor(),
            color: getColor(),
            '&:hover': {
              borderColor: getColor(),
              backgroundColor: `${getColor()}15`,
            },
          }}
        >
          {action.label}
        </Button>
      )}
    </Paper>
  )
}