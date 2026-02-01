"use client";

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Input2 } from '../ui/input2';
import { Card2 } from '../ui/card2';
import { AppearanceSettings as AppearanceSettingsType } from '@/types/settings';

interface AppearanceSettingsProps {
  settings: AppearanceSettingsType;
  onSettingChange: (key: string, value: any) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'bn', label: 'Bengali' },
    { value: 'pa', label: 'Punjabi' },
  ];

  const dateFormats = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
    { value: 'dd MMM yyyy', label: 'DD MMM YYYY' },
  ];

  const colors = [
    { value: '#667eea', name: 'Blue' },
    { value: '#764ba2', name: 'Purple' },
    { value: '#f56565', name: 'Red' },
    { value: '#48bb78', name: 'Green' },
    { value: '#ed8936', name: 'Orange' },
  ];

  const layouts = [
    { value: 'standard', label: 'Standard' },
    { value: 'compact', label: 'Compact' },
    { value: 'detailed', label: 'Detailed' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Language & Region */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Language & Region
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Input2
            fullWidth
            select
            label="Language"
            value={settings.language}
            onChange={(e) => onSettingChange('language', e.target.value)}
            sx={{ mb: 2 }}
            startIcon={<CombinedIcon name="Language" size={16} />}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </Input2>
          
          <Input2
            fullWidth
            select
            label="Date Format"
            value={settings.dateFormat}
            onChange={(e) => onSettingChange('dateFormat', e.target.value)}
            sx={{ mb: 2 }}
            startIcon={<CombinedIcon name="AccessTime" size={16} />}
          >
            {dateFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </Input2>

          <FormControlLabel
            control={
              <Radio
                checked={settings.compactMode}
                onChange={() => onSettingChange('compactMode', !settings.compactMode)}
                color="primary"
                size="small"
              />
            }
            label="Compact Layout"
            sx={{ mb: 2, display: 'block' }}
          />
        </Card2>
      </Box>

      {/* Color Picker */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Color & Layout
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={500}>
            Primary Color
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {colors.map((color) => (
              <Box
                key={color.value}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: color.value,
                  cursor: 'pointer',
                  border: settings.primaryColor === color.value ? '3px solid' : '2px solid',
                  borderColor: settings.primaryColor === color.value ? 'primary.main' : 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  position: 'relative',
                  '&::after': {
                    content: settings.primaryColor === color.value ? '"✓"' : '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }
                }}
                onClick={() => onSettingChange('primaryColor', color.value)}
                title={color.name}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom fontWeight={500}>
            Dashboard Layout
          </Typography>
          <RadioGroup
            value={settings.dashboardLayout}
            onChange={(e) => onSettingChange('dashboardLayout', e.target.value)}
            sx={{ mb: 2 }}
          >
            {layouts.map((layout) => (
              <FormControlLabel 
                key={layout.value}
                value={layout.value} 
                control={<Radio size="small" />} 
                label={layout.label} 
                sx={{ mb: 0.5 }}
              />
            ))}
          </RadioGroup>

          <Typography variant="caption" color="text.secondary">
            Note: Light/Dark mode can be toggled from the header
          </Typography>
        </Card2>
      </Box>
    </Box>
  );
};