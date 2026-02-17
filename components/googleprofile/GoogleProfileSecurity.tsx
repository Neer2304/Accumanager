// components/googleprofile/GoogleProfileSecurity.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Divider,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material'
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from '@mui/icons-material'
import { PasswordData, UserProfile } from './types'

interface GoogleProfileSecurityProps {
  passwords: PasswordData
  onPasswordChange: (field: keyof PasswordData, value: string) => void
  onPasswordSave: () => void
  showPassword: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  onTogglePassword: (field: 'current' | 'new' | 'confirm') => void
  isSaving: boolean
  profile: UserProfile | null
  darkMode?: boolean
  isMobile?: boolean
}

export default function GoogleProfileSecurity({
  passwords,
  onPasswordChange,
  onPasswordSave,
  showPassword,
  onTogglePassword,
  isSaving,
  profile,
  darkMode,
  isMobile,
}: GoogleProfileSecurityProps) {
  if (!profile) return null

  return (
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
          Security Settings
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
          }}
        >
          Manage your account security and password
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

      {/* Change Password */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
          Change Password
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            type={showPassword.current ? 'text' : 'password'}
            label="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onTogglePassword('current')}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
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
            type={showPassword.new ? 'text' : 'password'}
            label="New Password"
            value={passwords.newPassword}
            onChange={(e) => onPasswordChange('newPassword', e.target.value)}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onTogglePassword('new')}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
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
            type={showPassword.confirm ? 'text' : 'password'}
            label="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onTogglePassword('confirm')}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
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
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={onPasswordSave}
              disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword || isSaving}
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
              {isSaving ? 'Changing...' : 'Change Password'}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

      {/* Session Information */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
          Account Information
        </Typography>
        <Paper
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Member since
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                {new Date(profile.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Last login
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                {new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Account status
              </Typography>
              <Chip 
                label={profile.isActive ? 'Active' : 'Inactive'} 
                size="small" 
                sx={{ 
                  backgroundColor: profile.isActive 
                    ? (darkMode ? '#0d652d' : '#d9f0e1')
                    : (darkMode ? '#3c4043' : '#f5f5f5'),
                  color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368'),
                  fontWeight: 500,
                }} 
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}