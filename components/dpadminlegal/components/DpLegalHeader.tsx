// components/dpadminlegal/components/DpLegalHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon, Gavel as GavelIcon } from '@mui/icons-material';
import { dpColors } from './types';

export const DpLegalHeader: React.FC<{ title: string; onRefresh: () => void; loading: boolean; }> = ({ title, onRefresh, loading }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: dpColors.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dpColors.red, border: `2px solid ${dpColors.red}` }}><GavelIcon /></Box>
        <Box><Typography variant="h5" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em' }}>{title}</Typography><Typography variant="body2" sx={{ color: dpColors.inkSub }}>Maximum effort legal management! 🦸</Typography></Box>
      </Box>
      <Button startIcon={<RefreshIcon />} onClick={onRefresh} disabled={loading} variant="outlined" sx={{ borderRadius: '8px', borderColor: dpColors.border, color: dpColors.ink, '&:hover': { borderColor: dpColors.red, backgroundColor: dpColors.redSoft, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>Refresh</Button>
    </Box>
  );
};