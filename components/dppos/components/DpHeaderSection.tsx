// components/dppos/components/DpHeaderSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Paper, Avatar, Stack } from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface DpHeaderSectionProps { isOnline: boolean; grandTotal: number; }

export const DpHeaderSection: React.FC<DpHeaderSectionProps> = ({ isOnline, grandTotal }) => {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: '20px', background: `linear-gradient(135deg, ${dpColors.surface} 0%, ${dpColors.bg} 100%)`, border: `2px solid ${dpColors.border}`, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${dpColors.red}, ${dpColors.gold}, ${dpColors.red})` } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, backgroundColor: dpColors.redSoft, color: dpColors.red }}><ReceiptIcon sx={{ fontSize: { xs: 24, sm: 28 } }} /></Avatar>
          <Box><Typography variant={isOnline ? "h4" : "h5"} component="h1" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em', mb: 0.5 }}>🧾 Deadpool's POS</Typography><Typography variant="body2" sx={{ color: dpColors.inkSub }}>{isOnline ? "Maximum effort invoicing with GST calculations!" : "Offline Mode - Bills saved locally"}</Typography></Box>
        </Stack>
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}><Typography variant="body2" sx={{ color: dpColors.inkSub, mb: 0.5 }}>Grand Total</Typography><Typography variant="h4" fontWeight={800} sx={{ color: dpColors.gold, fontSize: { xs: '1.75rem', sm: '2rem' } }}>₹{grandTotal.toLocaleString()}</Typography></Box>
      </Stack>
    </Paper>
  );
};