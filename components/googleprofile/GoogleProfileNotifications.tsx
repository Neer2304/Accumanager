// components/googleprofile/GoogleProfileNotifications.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  PhoneAndroid as SmsIcon,
  Inventory as InventoryIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material'
import { UserProfile } from './types'

interface GoogleProfileNotificationsProps {
  profile: UserProfile | null
  onPreferenceChange: (preference: keyof UserProfile['preferences'], value: boolean) => void
  darkMode?: boolean
}

export default function GoogleProfileNotifications({
  profile,
  onPreferenceChange,
  darkMode,
}: GoogleProfileNotificationsProps) {
  if (!profile) return null

  const notificationItems = [
    {
      key: 'emailNotifications' as const,
      label: 'Email Notifications',
      description: 'Receive important updates and reports via email',
      icon: <EmailIcon />,
    },
    {
      key: 'smsNotifications' as const,
      label: 'SMS Notifications',
      description: 'Get instant alerts via SMS',
      icon: <SmsIcon />,
    },
    {
      key: 'lowStockAlerts' as const,
      label: 'Low Stock Alerts',
      description: 'Get notified when inventory is running low',
      icon: <InventoryIcon />,
    },
    {
      key: 'monthlyReports' as const,
      label: 'Monthly Reports',
      description: 'Receive comprehensive monthly business reports',
      icon: <ReportIcon />,
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: darkMode ? '#e8eaed' : '#202124',
            mb: 1,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
          }}
        >
          Notification Preferences
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
          }}
        >
          Control how and when you receive notifications
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

      <Stack spacing={2}>
        {notificationItems.map((item) => (
          <Paper
            key={item.key}
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={profile.preferences?.[item.key] || false}
                  onChange={(e) => onPreferenceChange(item.key, e.target.checked)}
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
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}