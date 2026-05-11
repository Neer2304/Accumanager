// components/batmanpos/components/BatmanHeaderSection.tsx
'use client';

import React from 'react';
import { Box, Typography, Paper, Avatar, Stack } from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface BatmanHeaderSectionProps { isOnline: boolean; grandTotal: number; }

export const BatmanHeaderSection: React.FC<BatmanHeaderSectionProps> = ({ isOnline, grandTotal }) => {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: '20px', background: `linear-gradient(135deg, ${batmanColors.surface} 0%, ${batmanColors.bg} 100%)`, border: `2px solid ${batmanColors.gold}`, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${batmanColors.gold}, ${batmanColors.goldHov}, ${batmanColors.gold})` } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><ReceiptIcon sx={{ fontSize: { xs: 24, sm: 28 } }} /></Avatar>
          <Box><Typography variant={isOnline ? "h4" : "h5"} component="h1" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 0.5 }}>🦇 Batcomputer POS</Typography><Typography variant="body2" sx={{ color: batmanColors.inkSub }}>{isOnline ? "Generate invoices with Gotham's finest GST calculations!" : "Offline Mode - Bills saved locally"}</Typography></Box>
        </Stack>
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}><Typography variant="body2" sx={{ color: batmanColors.inkSub, mb: 0.5 }}>Grand Total</Typography><Typography variant="h4" fontWeight={800} sx={{ color: batmanColors.gold, fontSize: { xs: '1.75rem', sm: '2rem' } }}>₹{grandTotal.toLocaleString()}</Typography></Box>
      </Stack>
    </Paper>
  );
};