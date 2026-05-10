// components/batmanadminlegal/components/BatmanLegalHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon, Gavel as GavelIcon } from '@mui/icons-material';
import { batmanColors } from './types';

export const BatmanLegalHeader: React.FC<{ title: string; onRefresh: () => void; loading: boolean; }> = ({ title, onRefresh, loading }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: batmanColors.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: batmanColors.gold, border: `2px solid ${batmanColors.gold}` }}><GavelIcon /></Box>
        <Box><Typography variant="h5" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em' }}>{title}</Typography><Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}>🦇 Secure document management for Gotham's legal framework</Typography></Box>
      </Box>
      <Button startIcon={<RefreshIcon />} onClick={onRefresh} disabled={loading} variant="outlined" sx={{ borderRadius: '8px', borderColor: batmanColors.gold, color: batmanColors.gold, '&:hover': { borderColor: batmanColors.gold, backgroundColor: batmanColors.goldSoft, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>Refresh Vault</Button>
    </Box>
  );
};