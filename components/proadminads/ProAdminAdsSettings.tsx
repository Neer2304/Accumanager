// components/proadminads/ProAdminAdsSettings.tsx
'use client'

import React from 'react'
import { Card, CardContent, Typography, Box, Switch, Slider, FormControlLabel, Select, MenuItem, alpha } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { AdSettings } from './types'

export default function ProAdminAdsSettings({ settings, onSettingsChange, darkMode }: { settings: AdSettings; onSettingsChange: (key: keyof AdSettings, value: any) => void; darkMode?: boolean }) {
  return (
    <Card sx={{ mb: 4, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, boxShadow: darkMode ? '0 4px 24px rgba(0, 0, 0, 0.2)' : '0 4px 24px rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}><Settings sx={{ fontSize: 24, color: darkMode ? '#8ab4f8' : '#1a73e8' }} /><Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>Ad Settings</Typography></Box>
        <Box sx={{ px: { xs: 1, sm: 2 } }}>
          <FormControlLabel control={<Switch checked={settings.enabled} onChange={(e) => onSettingsChange('enabled', e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a73e8' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a73e8' } }} />} label={<Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>Enable advertisements</Typography>} sx={{ mb: 3, display: 'block' }} />
          <Typography variant="body2" gutterBottom sx={{ mt: 2, color: darkMode ? '#e8eaed' : '#202124' }}>Ad Density: {settings.density}%</Typography>
          <Slider value={settings.density} onChange={(_, value) => onSettingsChange('density', value as number)} min={10} max={100} sx={{ color: '#1a73e8', '& .MuiSlider-mark': { backgroundColor: darkMode ? '#9aa0a6' : '#5f6368' }, '& .MuiSlider-markLabel': { color: darkMode ? '#9aa0a6' : '#5f6368' }, '& .MuiSlider-thumb': { '&:hover': { boxShadow: `0 0 0 8px ${alpha('#1a73e8', 0.1)}` } } }} marks={[{ value: 25, label: 'Low' }, { value: 50, label: 'Medium' }, { value: 75, label: 'High' }]} />
          <Typography variant="body2" gutterBottom sx={{ mt: 3, color: darkMode ? '#e8eaed' : '#202124' }}>Ad Categories</Typography>
          <Select fullWidth size="small" value={settings.category} onChange={(e) => onSettingsChange('category', e.target.value)} sx={{ mb: 2, borderRadius: '12px', '& .MuiOutlinedInput-root': { backgroundColor: darkMode ? '#202124' : '#f8f9fa' }, '& .MuiSelect-select': { color: darkMode ? '#e8eaed' : '#202124' } }}>
            <MenuItem value="all">All Categories</MenuItem><MenuItem value="tech">Technology</MenuItem><MenuItem value="business">Business</MenuItem><MenuItem value="saas">SaaS</MenuItem><MenuItem value="marketing">Marketing</MenuItem>
          </Select>
        </Box>
      </CardContent>
    </Card>
  )
}