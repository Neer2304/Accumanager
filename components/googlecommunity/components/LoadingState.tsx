// components/googlecommunity/components/LoadingState.tsx
import React from 'react';
import {
  Box,
  CircularProgress,
  useTheme
} from '@mui/material';

export const LoadingState: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: 400 
    }}>
      <CircularProgress sx={{ color: '#4285f4' }} />
    </Box>
  );
};