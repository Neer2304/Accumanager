// components/googlesettings/GoogleSettingsNotifications.tsx
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
  alpha,
} from '@mui/material'
import {
  Notifications,
  Email,
  PhoneAndroid,
  TrendingUp,
  Inventory,
  PersonAdd,
  Receipt,
  Assessment,
} from '@mui/icons-material'
import { SettingsSectionProps } from './types'

export default function GoogleSettingsNotifications({ 
  settings, 
  onSettingChange,
  darkMode,
}: SettingsSectionProps) {
  
  const notificationSections = [
    {
      title: 'General Notifications',
      icon: <Notifications />,
      items: [
        { key: 'email', label: 'Email Notifications', icon: <Email />, description: 'Receive notifications via email' },
        { key: 'push', label: 'Push Notifications', icon: <PhoneAndroid />, description: 'Receive push notifications on your device' },
      ]
    },
    {
      title: 'Business Alerts',
      icon: <TrendingUp />,
      items: [
        { key: 'salesAlerts', label: 'Sales Alerts', icon: <TrendingUp />, description: 'Get notified about new sales' },
        { key: 'lowStockAlerts', label: 'Low Stock Alerts', icon: <Inventory />, description: 'Alert when inventory is low' },
        { key: 'newCustomerAlerts', label: 'New Customer Alerts', icon: <PersonAdd />, description: 'Get notified about new customer registrations' },
      ]
    },
    {
      title: 'Billing & Reports',
      icon: <Receipt />,
      items: [
        { key: 'billingReminders', label: 'Billing Reminders', icon: <Receipt />, description: 'Receive reminders for upcoming bills' },
        { key: 'monthlyReports', label: 'Monthly Reports', icon: <Assessment />, description: 'Get monthly performance reports' },
      ]
    }
  ]

  return (
    <Box>
      {notificationSections.map((section, sectionIndex) => (
        <Paper
          key={sectionIndex}
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: sectionIndex < notificationSections.length - 1 ? 3 : 0,
            borderRadius: '16px',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
              {section.icon}
            </Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {section.title}
            </Typography>
          </Box>

          <Stack spacing={2}>
            {section.items.map((item, itemIndex) => (
              <Box key={item.key}>
                {itemIndex > 0 && (
                  <Divider sx={{ mb: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                )}
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings[item.key] || false}
                      onChange={(e) => onSettingChange(item.key, e.target.checked)}
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
                          <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  }
                  sx={{
                    width: '100%',
                    mx: 0,
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}