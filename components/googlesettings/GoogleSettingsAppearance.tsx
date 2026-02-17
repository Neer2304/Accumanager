// components/googlesettings/GoogleSettingsAppearance.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material'
import {
  Palette,
  DarkMode,
  LightMode,
  Language,
  DateRange,
  ViewCompact,
} from '@mui/icons-material'
import { SettingsSectionProps } from './types'

export default function GoogleSettingsAppearance({ 
  settings, 
  onSettingChange,
  darkMode,
  isMobile,
}: SettingsSectionProps) {
  
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'hi', label: 'Hindi' },
    { value: 'zh', label: 'Chinese' },
  ]

  const dateFormats = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
  ]

  const handleThemeChange = (themeMode: 'light' | 'dark') => {
    onSettingChange('themeMode', themeMode)
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', themeMode)
    // You might want to update your theme context here
    // This would be handled by your ThemeContext
  }

  return (
    <Box>
      {/* Theme Section */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Palette sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="h6" fontWeight={500}>
            Theme Preference
          </Typography>
        </Box>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ justifyContent: 'center' }}
        >
          {/* Light Mode Option */}
          <Paper
            elevation={0}
            onClick={() => handleThemeChange('light')}
            sx={{
              flex: 1,
              p: 2,
              cursor: 'pointer',
              borderRadius: '12px',
              border: '2px solid',
              borderColor: !darkMode && settings.themeMode === 'light'
                ? '#1a73e8'
                : darkMode ? '#3c4043' : '#dadce0',
              backgroundColor: settings.themeMode === 'light'
                ? darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.05)
                : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode 
                  ? alpha('#8ab4f8', 0.1) 
                  : alpha('#1a73e8', 0.05),
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <LightMode 
              sx={{ 
                fontSize: 32, 
                color: settings.themeMode === 'light'
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#9aa0a6' : '#5f6368',
              }} 
            />
            <Typography 
              variant="subtitle1" 
              fontWeight={500}
              color={settings.themeMode === 'light'
                ? darkMode ? '#8ab4f8' : '#1a73e8'
                : darkMode ? '#e8eaed' : '#202124'
              }
            >
              Light Mode
            </Typography>
            <Typography 
              variant="caption" 
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ textAlign: 'center' }}
            >
              Bright and clean interface for daytime use
            </Typography>
          </Paper>

          {/* Dark Mode Option */}
          <Paper
            elevation={0}
            onClick={() => handleThemeChange('dark')}
            sx={{
              flex: 1,
              p: 2,
              cursor: 'pointer',
              borderRadius: '12px',
              border: '2px solid',
              borderColor: darkMode && settings.themeMode === 'dark'
                ? '#8ab4f8'
                : darkMode ? '#3c4043' : '#dadce0',
              backgroundColor: settings.themeMode === 'dark'
                ? darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.05)
                : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode 
                  ? alpha('#8ab4f8', 0.1) 
                  : alpha('#1a73e8', 0.05),
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <DarkMode 
              sx={{ 
                fontSize: 32, 
                color: settings.themeMode === 'dark'
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#9aa0a6' : '#5f6368',
              }} 
            />
            <Typography 
              variant="subtitle1" 
              fontWeight={500}
              color={settings.themeMode === 'dark'
                ? darkMode ? '#8ab4f8' : '#1a73e8'
                : darkMode ? '#e8eaed' : '#202124'
              }
            >
              Dark Mode
            </Typography>
            <Typography 
              variant="caption" 
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ textAlign: 'center' }}
            >
              Easy on the eyes for nighttime work
            </Typography>
          </Paper>
        </Stack>

        <Typography 
          variant="caption" 
          color={darkMode ? '#9aa0a6' : '#5f6368'}
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Current theme: {settings.themeMode === 'light' ? 'Light' : 'Dark'} Mode
        </Typography>
      </Paper>

      {/* Other Appearance Settings */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Palette sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="h6" fontWeight={500}>
            Display Settings
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Language Select */}
          <FormControl fullWidth variant="outlined">
            <InputLabel 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-focused': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
              }}
            >
              Language
            </InputLabel>
            <Select
              value={settings.language || 'en'}
              onChange={(e) => onSettingChange('language', e.target.value)}
              label="Language"
              startAdornment={<Language sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />}
              sx={{
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  borderWidth: 2,
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Format Select */}
          <FormControl fullWidth variant="outlined">
            <InputLabel
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-focused': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
              }}
            >
              Date Format
            </InputLabel>
            <Select
              value={settings.dateFormat || 'dd/MM/yyyy'}
              onChange={(e) => onSettingChange('dateFormat', e.target.value)}
              label="Date Format"
              startAdornment={<DateRange sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />}
              sx={{
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  borderWidth: 2,
                },
              }}
            >
              {dateFormats.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Compact Mode Switch */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.compactMode || false}
                onChange={(e) => onSettingChange('compactMode', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewCompact sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Box>
                  <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                    Compact Mode
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Display more content with reduced spacing
                  </Typography>
                </Box>
              </Box>
            }
            sx={{
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />
        </Stack>
      </Paper>
    </Box>
  )
}