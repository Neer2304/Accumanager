// components/dpadminlegal/components/DpLegalLoadingState.tsx
'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { dpColors } from './types';

export const DpLegalLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column", gap: 2 }}>
      <CircularProgress size={60} sx={{ color: dpColors.red }} />
      <Typography variant="body1" sx={{ color: dpColors.inkSub }}>Loading legal documents... Maximum effort! 🦸</Typography>
    </Box>
  );
};