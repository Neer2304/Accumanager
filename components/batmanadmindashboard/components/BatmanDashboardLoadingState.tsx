// components/batmanadmindashboard/components/BatmanDashboardLoadingState.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { batmanColors } from './types';

export const BatmanDashboardLoadingState: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh', 
      flexDirection: 'column', 
      gap: 2 
    }}>
      <CircularProgress size={60} sx={{ color: batmanColors.gold }} />
      <Typography 
        variant="body1" 
        sx={{ 
          color: batmanColors.inkSub, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        🦇 Initializing Batcomputer... 🦇
      </Typography>
    </Box>
  );
};