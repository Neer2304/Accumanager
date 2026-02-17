// components/googleadminvisitors/GoogleVisitorsTabs.tsx
'use client'

import React from 'react'
import {
  Paper,
  Tabs,
  Tab,
  alpha,
} from '@mui/material'
import {
  Dashboard,
  Timeline,
  Map,
  Devices,
  Apps,
} from '@mui/icons-material'
import { TabsProps } from './types'

const tabs = [
  { label: 'Overview', icon: <Dashboard /> },
  { label: 'Real-time', icon: <Timeline /> },
  { label: 'Geography', icon: <Map /> },
  { label: 'Devices', icon: <Devices /> },
  { label: 'Pages', icon: <Apps /> },
]

export default function GoogleVisitorsTabs({ selectedTab, onTabChange, darkMode }: TabsProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden',
        mb: 4
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(_, v) => onTabChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? alpha('#303134', 0.5) : alpha('#f8f9fa', 0.8),
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
        {tabs.map((tab, i) => (
          <Tab key={i} label={tab.label} icon={tab.icon} iconPosition="start" />
        ))}
      </Tabs>
    </Paper>
  )
}