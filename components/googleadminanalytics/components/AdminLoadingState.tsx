// components/googleadminanalytics/components/AdminLoadingState.tsx
import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';

interface AdminLoadingStateProps {
  message?: string;
}

export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({ 
  message = 'Loading analytics dashboard...' 
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <CircularProgress size={60} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
      <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
        {message}
      </Typography>
    </Box>
  );
};