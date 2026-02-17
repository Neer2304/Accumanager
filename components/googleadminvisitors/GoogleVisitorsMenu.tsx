// components/googleadminvisitors/GoogleVisitorsMenu.tsx
'use client'

import React from 'react'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
} from '@mui/material'
import {
  Visibility,
  Delete,
} from '@mui/icons-material'
import { MenuProps } from './types'

export default function GoogleVisitorsMenu({
  anchorEl,
  selectedVisitor,
  onClose,
  onViewDetails,
  onDelete,
  darkMode,
}: MenuProps) {
  if (!selectedVisitor) return null

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(0, 0, 0, 0.1)',
          minWidth: 160,
        }
      }}
    >
      <MenuItem 
        onClick={() => {
          onViewDetails(selectedVisitor)
          onClose()
        }}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.05),
          },
        }}
      >
        <ListItemIcon>
          <Visibility fontSize="small" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
        </ListItemIcon>
        <ListItemText 
          primary="View Details" 
          primaryTypographyProps={{ 
            sx: { color: darkMode ? '#e8eaed' : '#202124' }
          }}
        />
      </MenuItem>
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      <MenuItem 
        onClick={() => {
          onDelete(selectedVisitor)
          onClose()
        }}
        sx={{
          py: 1.5,
          px: 2,
          color: '#EA4335',
          '&:hover': {
            backgroundColor: alpha('#EA4335', 0.1),
          },
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small" sx={{ color: '#EA4335' }} />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MenuItem>
    </Menu>
  )
}