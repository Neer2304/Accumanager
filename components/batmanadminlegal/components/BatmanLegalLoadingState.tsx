// components/batmanadminlegal/components/BatmanLegalLoadingState.tsx
'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { batmanColors } from './types';

export const BatmanLegalLoadingState: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column", gap: 2 }}>
      <CircularProgress size={60} sx={{ color: batmanColors.gold }} />
      <Typography variant="body1" sx={{ color: batmanColors.inkSub, letterSpacing: '0.05em' }}>🦇 Initializing Batcomputer legal vault... 🦇</Typography>
    </Box>
  );
};