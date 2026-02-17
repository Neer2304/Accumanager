// components/googlesettings/GoogleSettingsBusiness.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Avatar,
  IconButton,
  alpha,
  InputAdornment,
} from '@mui/material'
import {
  Business,
  Percent,
  Receipt,
  CreditCard,
  LocationOn,
  Phone,
  Email,
  Language,
  CloudUpload,
} from '@mui/icons-material'
import { SettingsSectionProps } from './types'

interface GoogleSettingsBusinessProps extends SettingsSectionProps {
  logoPreview: string
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function GoogleSettingsBusiness({ 
  settings, 
  onSettingChange,
  logoPreview,
  onLogoUpload,
  darkMode,
  isMobile,
}: GoogleSettingsBusinessProps) {
  return (
    <Box>
      {/* Logo Upload Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Business Logo
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            src={logoPreview}
            sx={{
              width: 80,
              height: 80,
              bgcolor: darkMode ? '#303134' : '#f1f3f4',
              border: `2px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
            }}
          >
            <Business sx={{ fontSize: 40, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          </Avatar>
          
          <Box>
            <input
              accept="image/*"
              id="logo-upload"
              type="file"
              hidden
              onChange={onLogoUpload}
            />
            <label htmlFor="logo-upload">
              <IconButton
                component="span"
                sx={{
                  bgcolor: darkMode ? '#303134' : '#f1f3f4',
                  borderRadius: '12px',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: darkMode ? '#3c4043' : '#e8eaed',
                  },
                }}
              >
                <CloudUpload sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
              </IconButton>
            </label>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Click to upload logo
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Business Details */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Business Information
        </Typography>

        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Business Name */}
          <TextField
            fullWidth
            label="Business Name"
            value={settings.name || ''}
            onChange={(e) => onSettingChange('name', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          />

          {/* Tax Rate & Invoice Prefix */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Tax Rate (%)"
              type="number"
              value={settings.taxRate || ''}
              onChange={(e) => onSettingChange('taxRate', Number(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Percent sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
              }}
            />
            <TextField
              fullWidth
              label="Invoice Prefix"
              value={settings.invoicePrefix || ''}
              onChange={(e) => onSettingChange('invoicePrefix', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
              }}
            />
          </Box>

          {/* GST Number */}
          <TextField
            fullWidth
            label="GST Number"
            value={settings.gstNumber || ''}
            onChange={(e) => onSettingChange('gstNumber', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCard sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              },
            }}
          />

          {/* Business Address */}
          <TextField
            fullWidth
            label="Business Address"
            multiline
            rows={3}
            value={settings.businessAddress || ''}
            onChange={(e) => onSettingChange('businessAddress', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <LocationOn sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              },
            }}
          />

          {/* Contact Information */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.phone || ''}
              onChange={(e) => onSettingChange('phone', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={settings.email || ''}
              onChange={(e) => onSettingChange('email', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
              }}
            />
          </Box>

          {/* Website */}
          <TextField
            fullWidth
            label="Website"
            value={settings.website || ''}
            onChange={(e) => onSettingChange('website', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Language sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              },
            }}
          />
        </Stack>
      </Paper>
    </Box>
  )
}