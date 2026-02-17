// components/googlesettings/GoogleSettingsBackup.tsx
'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Alert,
  LinearProgress,
  alpha,
} from '@mui/material'
import {
  Backup,
  Download,
  CloudDownload,
  Storage,
  Warning,
} from '@mui/icons-material'

interface GoogleSettingsBackupProps {
  onBackup: (type: string) => void
  darkMode?: boolean
  isMobile?: boolean
}

export default function GoogleSettingsBackup({ 
  onBackup,
  darkMode,
}: GoogleSettingsBackupProps) {
  
  const [exporting, setExporting] = useState<string | null>(null)

  const handleBackup = async (type: string) => {
    setExporting(type)
    try {
      await onBackup(type)
    } finally {
      setTimeout(() => setExporting(null), 1000)
    }
  }

  const backupOptions = [
    {
      type: 'json',
      title: 'JSON Backup',
      description: 'Complete data backup in JSON format',
      icon: <Storage sx={{ fontSize: 32 }} />,
      color: '#4285f4',
    },
    {
      type: 'csv',
      title: 'CSV Export',
      description: 'Export data as CSV for spreadsheet use',
      icon: <CloudDownload sx={{ fontSize: 32 }} />,
      color: '#34a853',
    },
    {
      type: 'database',
      title: 'Database Dump',
      description: 'Full database SQL dump (Admin only)',
      icon: <Backup sx={{ fontSize: 32 }} />,
      color: '#ea4335',
    },
  ]

  return (
    <Box>
      {/* Info Alert */}
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{
          mb: 3,
          borderRadius: '12px',
          backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
          border: `1px solid ${darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1)}`,
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Backup your data regularly to prevent loss
        </Typography>
        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Backups include all your business data, settings, and configurations
        </Typography>
      </Alert>

      {/* Backup Options */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexDirection: { xs: 'column', md: 'row' },
        mb: 4,
      }}>
        {backupOptions.map((option) => (
          <Paper
            key={option.type}
            elevation={0}
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              borderRadius: '16px',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: darkMode 
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ color: option.color, mb: 2 }}>
              {option.icon}
            </Box>
            
            <Typography variant="h6" fontWeight={500} gutterBottom>
              {option.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ mb: 2, minHeight: 40 }}
            >
              {option.description}
            </Typography>

            {exporting === option.type ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#303134' : '#e8eaed',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: option.color,
                    },
                  }} 
                />
                <Typography variant="caption" color={option.color} sx={{ mt: 1, display: 'block' }}>
                  Exporting...
                </Typography>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleBackup(option.type)}
                startIcon={<Download />}
                sx={{
                  borderRadius: '12px',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: option.color,
                    backgroundColor: alpha(option.color, 0.05),
                  },
                }}
              >
                Download
              </Button>
            )}
          </Paper>
        ))}
      </Box>

      {/* Auto Backup Settings */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Auto Backup Settings
        </Typography>
        
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} paragraph>
          Configure automatic backups to run on a schedule
        </Typography>

        <Alert
          severity="warning"
          sx={{
            borderRadius: '12px',
            backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
            border: `1px solid ${darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1)}`,
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Auto-backup feature coming soon!
          </Typography>
          <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            We're working on automated backup schedules. For now, please use manual backups.
          </Typography>
        </Alert>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            sx={{
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            Learn More
          </Button>
          <Button
            variant="contained"
            disabled
            sx={{
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#f1f3f4',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            Configure
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}