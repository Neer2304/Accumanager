// components/googleadminvisitors/GoogleVisitorsHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  alpha,
} from '@mui/material'
import {
  Refresh,
  Download,
  Delete,
} from '@mui/icons-material'
import { HeaderProps } from './types'

export default function GoogleVisitorsHeader({
  autoRefresh,
  onAutoRefreshChange,
  onRefresh,
  onExport,
  onBulkDelete,
  selectedCount,
  loading,
  darkMode,
  isMobile,
}: HeaderProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'stretch', md: 'center' },
      justifyContent: 'space-between',
      mb: 4,
      gap: 2
    }}>
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight="500"
          gutterBottom
          sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
        >
          👥 Visitor Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Track and analyze your website visitors
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Switch
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            />
          }
          label="Auto-refresh"
          sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
        />
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            borderRadius: '8px',
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
            },
          }}
        >
          Refresh
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={onExport}
          disabled={loading}
          size="small"
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            borderRadius: '8px',
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
            },
          }}
        >
          Export
        </Button>
        
        {selectedCount > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={onBulkDelete}
            size="small"
            sx={{
              backgroundColor: '#ea4335',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
              borderRadius: '8px',
            }}
          >
            Delete ({selectedCount})
          </Button>
        )}
      </Box>
    </Box>
  )
}