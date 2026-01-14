import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import Link from 'next/link'
import { ActionsCategory } from './types'
import {
  Help as HelpIcon,
  ContactSupport as SupportIcon
} from '@mui/icons-material'

interface ActionStatsProps {
  categories: ActionsCategory[]
}

const ActionStats: React.FC<ActionStatsProps> = ({ categories }) => {
  const totalActions = categories.reduce((total, cat) => total + cat.actions.length, 0)
  const totalCategories = categories.length

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 2,
        border: `1px solid ${alpha('#1976d2', 0.2)}`,
        backgroundColor: alpha('#1976d2', 0.05)
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Can't find what you're looking for? Check our documentation or contact support.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              component={Link}
              href="/help"
              startIcon={<HelpIcon />}
            >
              Help Center
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="/help/support"
              startIcon={<SupportIcon />}
            >
              Contact Support
            </Button>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color="primary.main">
              {totalActions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Actions
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color="success.main">
              {totalCategories}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Categories
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default ActionStats