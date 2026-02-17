// components/googleprofile/GoogleProfileTabs.tsx
'use client'

import React from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material'
import { TabPanelProps } from './types'

export function TabPanel({ children, value, index, darkMode }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

interface GoogleProfileTabsProps {
  activeTab: number
  onTabChange: (newValue: number) => void
  isMobile?: boolean
  darkMode?: boolean
  children?: React.ReactNode
}

export default function GoogleProfileTabs({
  activeTab,
  onTabChange,
  isMobile,
  darkMode,
  children,
}: GoogleProfileTabsProps) {
  const tabs = [
    { icon: <PersonIcon />, label: isMobile ? "" : "Personal Info" },
    { icon: <BusinessIcon />, label: isMobile ? "" : "Business Details" },
    { icon: <NotificationsIcon />, label: isMobile ? "" : "Notifications" },
    { icon: <SecurityIcon />, label: isMobile ? "" : "Security" },
    { icon: <PaymentIcon />, label: isMobile ? "" : "Subscription" },
  ]

  return (
    <Paper
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={isMobile ? "auto" : false}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          '& .MuiTab-root': {
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab 
            key={index}
            icon={tab.icon}
            label={tab.label}
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        ))}
      </Tabs>
      {children}
    </Paper>
  )
}