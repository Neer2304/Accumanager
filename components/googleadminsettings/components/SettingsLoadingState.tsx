// components/googleadminsettings/components/SettingsLoadingState.tsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';

export const SettingsLoadingState: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh',
      flexDirection: 'column',
      gap: 2
    }}>
      <CircularProgress size={60} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
      <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
        Loading settings...
      </Typography>
    </Box>
  );
};