import React from 'react'
import { Paper, Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { ActionItem } from './types'

interface ActionCardProps {
  action: ActionItem
  categoryColor: string
}

const ActionCard: React.FC<ActionCardProps> = ({ action, categoryColor }) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      component={Link}
      href={action.href}
      sx={{
        p: 2,
        height: '100%',
        minHeight: 140,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: categoryColor,
          backgroundColor: alpha(categoryColor, 0.05)
        }
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: alpha(categoryColor, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        <Box sx={{ color: categoryColor, fontSize: 24 }}>
          {action.icon}
        </Box>
      </Box>
      <Typography 
        variant="h6" 
        fontWeight={600}
        sx={{ mb: 1, fontSize: '1rem' }}
      >
        {action.label}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize: '0.875rem' }}
      >
        {action.description}
      </Typography>
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Typography 
          variant="caption" 
          color="primary.main"
          fontWeight={600}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '0.75rem'
          }}
        >
          Click to open →
        </Typography>
      </Box>
    </Paper>
  )
}

export default ActionCard