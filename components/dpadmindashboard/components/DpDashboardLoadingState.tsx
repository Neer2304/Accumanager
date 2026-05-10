// components/dpadmindashboard/components/DpDashboardLoadingState.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { dpColors } from './types';

export const DpDashboardLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress size={60} sx={{ color: dpColors.red }} />
      <Typography variant="body1" sx={{ color: dpColors.inkSub }}>Loading Maximum Effort Dashboard... 🦸</Typography>
    </Box>
  );
};