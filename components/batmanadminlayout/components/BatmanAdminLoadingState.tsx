// components/batmanadminlayout/components/BatmanAdminLoadingState.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { batmanColors } from './types';

export const BatmanAdminLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: batmanColors.bg }}>
      <CircularProgress size={48} sx={{ color: batmanColors.gold }} />
      <Typography variant="body2" sx={{ ml: 2, color: batmanColors.inkSub }}>🦇 Initializing Batcomputer... 🦇</Typography>
    </Box>
  );
};