// components/dpadminlayout/components/DpAdminLoadingState.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { dpColors } from './types';

export const DpAdminLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: dpColors.bg }}>
      <CircularProgress size={48} sx={{ color: dpColors.red }} />
      <Typography variant="body2" sx={{ ml: 2, color: dpColors.inkSub }}>Loading Deadpool&apos;s Admin Panel... Maximum effort! 🦸</Typography>
    </Box>
  );
};