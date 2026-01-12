import React from 'react';
import { Box, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';

interface SettingsHeaderProps {
  title?: string;
  subtitle?: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = 'System Settings',
  subtitle = 'Configure application settings and preferences',
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        <Settings sx={{ mr: 2, verticalAlign: 'middle' }} />
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SettingsHeader;