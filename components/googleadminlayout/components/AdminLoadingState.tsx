// components/googleadminlayout/components/AdminLoadingState.tsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';
import { googleColors } from './types';

export const AdminLoadingState: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
    }}>
      <CircularProgress size={48} />
      <Typography 
        variant="body2" 
        sx={{ 
          ml: 2, 
          color: darkMode ? googleColors.grey500 : googleColors.grey600 
        }}
      >
        Loading admin panel...
      </Typography>
    </Box>
  );
};