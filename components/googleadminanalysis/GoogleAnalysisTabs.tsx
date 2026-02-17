// components/googleadminanalysis/GoogleAnalysisTabs.tsx
'use client'

import React from 'react'
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material'
import {
  People,
  Notes,
  Inventory,
  Timeline,
} from '@mui/icons-material'

interface GoogleAnalysisTabsProps {
  activeTab: number
  onTabChange: (value: number) => void
  darkMode?: boolean
}

export default function GoogleAnalysisTabs({
  activeTab,
  onTabChange,
  darkMode,
}: GoogleAnalysisTabsProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue)
  }

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: darkMode ? '#3c4043' : '#dadce0',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <Tabs 
        value={activeTab} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minHeight: { xs: 48, sm: 56 },
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 500,
            textTransform: 'none',
            px: { xs: 1, sm: 2 },
            minWidth: 'auto',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&.Mui-selected': {
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            height: 3,
            borderRadius: '3px 3px 0 0',
          }
        }}
      >
        <Tab 
          icon={<People sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Users" 
        />
        <Tab 
          icon={<Notes sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Notes" 
        />
        <Tab 
          icon={<Inventory sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Materials" 
        />
        <Tab 
          icon={<Timeline sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Engagement" 
        />
      </Tabs>
    </Box>
  )
}