// components/googleprofile/GoogleProfilePersonal.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { ProfileFormData } from './types'

interface GoogleProfilePersonalProps {
  formData: ProfileFormData
  onFormChange: (field: keyof ProfileFormData, value: string) => void
  onSave: (e: React.FormEvent) => void
  isSaving: boolean
  darkMode?: boolean
  isMobile?: boolean
}

export default function GoogleProfilePersonal({
  formData,
  onFormChange,
  onSave,
  isSaving,
  darkMode,
  isMobile,
}: GoogleProfilePersonalProps) {
  return (
    <form onSubmit={onSave}>
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
            Personal Information
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            }}
          >
            Update your personal details and contact information
          </Typography>
        </Box>
        
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            required
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              },
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            required
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              },
            }}
          />
        </Box>

        <TextField
          fullWidth
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => onFormChange('phone', e.target.value)}
          required
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? null : <SaveIcon />}
            sx={{ 
              borderRadius: '12px',
              backgroundColor: '#4285f4',
              color: 'white',
              fontWeight: 500,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
              "&:hover": {
                backgroundColor: '#3367d6',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </form>
  )
}