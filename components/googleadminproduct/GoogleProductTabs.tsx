// components/googleadminproduct/GoogleProductTabs.tsx
'use client'

import React from 'react'
import {
  Paper,
  Stack,
  Button,
  Chip,
  alpha,
} from '@mui/material'
import {
  Visibility,
  LocalOffer,
  Inventory,
  Receipt,
} from '@mui/icons-material'
import { ProductTabsProps } from './types'

export default function GoogleProductTabs({
  activeTab,
  onTabChange,
  product,
  darkMode,
}: ProductTabsProps) {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Visibility /> },
    { key: 'variations', label: 'Variations', icon: <LocalOffer />, count: product?.variations?.length },
    { key: 'batches', label: 'Batches', icon: <Inventory />, count: product?.batches?.length },
    { key: 'gst', label: 'GST & Tax', icon: <Receipt /> },
  ]

  return (
    <Paper sx={{ 
      mb: 3, 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      overflow: 'hidden',
    }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            startIcon={tab.icon}
            onClick={() => onTabChange(tab.key)}
            sx={{
              flex: 1,
              py: 2,
              borderRadius: 0,
              color: activeTab === tab.key 
                ? (darkMode ? '#8ab4f8' : '#1a73e8')
                : (darkMode ? '#9aa0a6' : '#5f6368'),
              borderBottom: activeTab === tab.key 
                ? `3px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}` 
                : '3px solid transparent',
              backgroundColor: activeTab === tab.key
                ? (darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.05))
                : 'transparent',
              textTransform: 'none',
              fontWeight: activeTab === tab.key ? 600 : 400,
              '&:hover': {
                backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
              }
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Chip 
                label={tab.count}
                size="small"
                sx={{ 
                  ml: 1,
                  backgroundColor: activeTab === tab.key
                    ? (darkMode ? alpha('#8ab4f8', 0.2) : alpha('#1a73e8', 0.1))
                    : (darkMode ? alpha('#9aa0a6', 0.1) : alpha('#5f6368', 0.1)),
                  color: activeTab === tab.key
                    ? (darkMode ? '#8ab4f8' : '#1a73e8')
                    : (darkMode ? '#9aa0a6' : '#5f6368'),
                  fontSize: '0.65rem',
                  height: 20,
                  minWidth: 20,
                }}
              />
            )}
          </Button>
        ))}
      </Stack>
    </Paper>
  )
}