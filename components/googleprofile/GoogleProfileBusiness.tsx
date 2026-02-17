// components/googleprofile/GoogleProfileBusiness.tsx
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
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { BusinessFormData } from './types'

interface GoogleProfileBusinessProps {
  formData: BusinessFormData
  onFormChange: (field: keyof BusinessFormData, value: string) => void
  onSave: (e: React.FormEvent) => void
  isSaving: boolean
  darkMode?: boolean
  isMobile?: boolean
}

export default function GoogleProfileBusiness({
  formData,
  onFormChange,
  onSave,
  isSaving,
  darkMode,
  isMobile,
}: GoogleProfileBusinessProps) {
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
            Business Information
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            }}
          >
            Manage your business details and registration information
          </Typography>
        </Box>
        
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        <TextField
          fullWidth
          label="Business Name"
          value={formData.businessName}
          onChange={(e) => onFormChange('businessName', e.target.value)}
          required
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon fontSize="small" />
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
          label="Business Address"
          multiline
          rows={2}
          value={formData.address}
          onChange={(e) => onFormChange('address', e.target.value)}
          required
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon fontSize="small" />
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => onFormChange('city', e.target.value)}
            required
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              },
            }}
          />
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => onFormChange('state', e.target.value)}
            required
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              },
            }}
          />
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => onFormChange('pincode', e.target.value)}
            required
            size={isMobile ? "small" : "medium"}
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
          label="Country"
          value={formData.country}
          onChange={(e) => onFormChange('country', e.target.value)}
          required
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            },
          }}
        />

        <TextField
          fullWidth
          label="GST Number"
          value={formData.gstNumber}
          onChange={(e) => onFormChange('gstNumber', e.target.value)}
          placeholder="e.g., 07AABCU9603R1ZM"
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Business Phone"
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
          <TextField
            fullWidth
            label="Business Email"
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
            {isSaving ? 'Saving...' : 'Save Business Details'}
          </Button>
        </Box>
      </Box>
    </form>
  )
}