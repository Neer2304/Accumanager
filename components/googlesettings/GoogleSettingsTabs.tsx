// components/googlesettings/GoogleSettingsTabs.tsx
'use client'

import React from 'react'
import {
  Box,
  Tab,
  Tabs as MuiTabs,
  alpha,
} from '@mui/material'
import {
  Business,
  Notifications,
  Security,
  Palette,
  Payment,
  Backup,
} from '@mui/icons-material'

interface GoogleSettingsTabsProps {
  activeTab: number
  onChange: (value: number) => void
  isMobile?: boolean
  darkMode?: boolean
}

const tabs = [
  { label: 'Business', icon: <Business /> },
  { label: 'Notifications', icon: <Notifications /> },
  { label: 'Security', icon: <Security /> },
  { label: 'Appearance', icon: <Palette /> },
  { label: 'Subscription', icon: <Payment /> },
  { label: 'Backup', icon: <Backup /> },
]

export default function GoogleSettingsTabs({ 
  activeTab, 
  onChange, 
  isMobile,
  darkMode 
}: GoogleSettingsTabsProps) {
  return (
    <Box sx={{ 
      borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      bgcolor: darkMode ? alpha('#202124', 0.95) : '#ffffff',
    }}>
      <MuiTabs
        value={activeTab}
        onChange={(_, v) => onChange(v)}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons={isMobile ? 'auto' : false}
        sx={{
          '& .MuiTab-root': {
            color: darkMode ? '#9aa0a6' : '#5f6368',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              backgroundColor: darkMode 
                ? alpha('#8ab4f8', 0.05) 
                : alpha('#1a73e8', 0.05),
            },
            '&.Mui-selected': {
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              fontWeight: 500,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            height: 3,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            label={isMobile ? undefined : tab.label}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        ))}
      </MuiTabs>
    </Box>
  )
}