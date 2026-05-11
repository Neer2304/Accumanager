// components/batmanpos/components/BatmanNetworkStatus.tsx
'use client';

import React from 'react';
import { Box, Typography, IconButton, Tooltip, Badge, Paper, Chip, Avatar, Stack } from "@mui/material";
import { CloudQueue as CloudQueueIcon, CloudOff as CloudOffIcon, Sync as SyncIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface BatmanNetworkStatusProps { isOnline: boolean; offlineBillsCount: number; onSyncClick: () => void; subscription?: any; usage?: any; }

export const BatmanNetworkStatus: React.FC<BatmanNetworkStatusProps> = ({ isOnline, offlineBillsCount, onSyncClick, subscription, usage }) => {
  const invoiceLimit = subscription?.limits?.invoices || subscription?.features?.invoices || 0;
  const invoiceCount = usage?.invoices || usage?.invoiceCount || 0;

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, boxShadow: 'none' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: isOnline ? 'rgba(0, 255, 136, 0.15)' : batmanColors.goldSoft, color: isOnline ? '#00ff88' : batmanColors.gold }}>{isOnline ? <CloudQueueIcon sx={{ fontSize: 18 }} /> : <CloudOffIcon sx={{ fontSize: 18 }} />}</Avatar>
          <Box><Typography variant="body2" fontWeight={700} sx={{ color: batmanColors.gold }}>{isOnline ? 'Online - Batcomputer connected' : 'Offline - Bills saved locally'}</Typography>{!isOnline && <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>You're working offline - The Batcomputer awaits!</Typography>}</Box>
          {offlineBillsCount > 0 && (<Tooltip title={`${offlineBillsCount} bills waiting to sync`}><Badge badgeContent={offlineBillsCount} sx={{ '& .MuiBadge-badge': { backgroundColor: batmanColors.gold, color: '#0a0a0a' } }}><IconButton size="small" onClick={onSyncClick} disabled={!isOnline}><SyncIcon sx={{ fontSize: 18, color: batmanColors.gold }} /></IconButton></Badge></Tooltip>)}
        </Stack>
        {subscription?.plan && (<Stack direction="row" alignItems="center" spacing={1.5}><Chip label={typeof subscription.plan === 'string' ? subscription.plan.toUpperCase() : 'PLAN'} size="small" sx={{ backgroundColor: batmanColors.goldSoft, color: batmanColors.gold, fontWeight: 700 }} /><Typography variant="caption" sx={{ color: batmanColors.inkSub }}>{invoiceCount} / {invoiceLimit} invoices - Justice never rests!</Typography></Stack>)}
      </Stack>
    </Paper>
  );
};