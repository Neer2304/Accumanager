// components/googleadminsettings/components/SettingsHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SettingsHeaderProps {
  title?: string;
  subtitle?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = 'System Settings',
  subtitle = 'Configure application settings and preferences',
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        gutterBottom
        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
      >
        <SettingsIcon sx={{ 
          mr: 2, 
          verticalAlign: 'middle',
          color: darkMode ? '#8ab4f8' : '#1a73e8'
        }} />
        {title}
      </Typography>
      {subtitle && (
        <Typography 
          variant="body1" 
          sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};