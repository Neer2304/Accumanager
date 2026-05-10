// components/proadminlayout/components/ProAdminLoadingState.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { proColors } from './types';

export const ProAdminLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: proColors.grey50 }}>
      <CircularProgress size={48} sx={{ color: proColors.primary }} />
      <Typography variant="body2" sx={{ ml: 2, color: proColors.grey600 }}>Loading admin panel...</Typography>
    </Box>
  );
};