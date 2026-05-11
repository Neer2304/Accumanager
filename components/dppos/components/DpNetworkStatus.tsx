// components/dppos/components/DpNetworkStatus.tsx
'use client';

import React from 'react';
import { Box, Typography, IconButton, Tooltip, Badge, Paper, Chip, Avatar, Stack } from "@mui/material";
import { CloudQueue as CloudQueueIcon, CloudOff as CloudOffIcon, Sync as SyncIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface DpNetworkStatusProps { isOnline: boolean; offlineBillsCount: number; onSyncClick: () => void; subscription?: any; usage?: any; }

export const DpNetworkStatus: React.FC<DpNetworkStatusProps> = ({ isOnline, offlineBillsCount, onSyncClick, subscription, usage }) => {
  const invoiceLimit = subscription?.limits?.invoices || subscription?.features?.invoices || 0;
  const invoiceCount = usage?.invoices || usage?.invoiceCount || 0;

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: 'none' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: isOnline ? 'rgba(52, 168, 83, 0.15)' : dpColors.redSoft, color: isOnline ? '#34a853' : dpColors.red }}>{isOnline ? <CloudQueueIcon sx={{ fontSize: 18 }} /> : <CloudOffIcon sx={{ fontSize: 18 }} />}</Avatar>
          <Box><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.ink }}>{isOnline ? 'Online - Maximum effort billing!' : 'Offline - Bills saved locally'}</Typography>{!isOnline && <Typography variant="caption" sx={{ color: dpColors.inkSub }}>You're working offline - Don't worry!</Typography>}</Box>
          {offlineBillsCount > 0 && (<Tooltip title={`${offlineBillsCount} bills waiting to sync`}><Badge badgeContent={offlineBillsCount} sx={{ '& .MuiBadge-badge': { backgroundColor: dpColors.gold, color: '#0a0a0a' } }}><IconButton size="small" onClick={onSyncClick} disabled={!isOnline}><SyncIcon sx={{ fontSize: 18, color: dpColors.gold }} /></IconButton></Badge></Tooltip>)}
        </Stack>
        {subscription?.plan && (<Stack direction="row" alignItems="center" spacing={1.5}><Chip label={typeof subscription.plan === 'string' ? subscription.plan.toUpperCase() : 'PLAN'} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.red, fontWeight: 700 }} /><Typography variant="caption" sx={{ color: dpColors.inkSub }}>{invoiceCount} / {invoiceLimit} invoices - Maximum effort!</Typography></Stack>)}
      </Stack>
    </Paper>
  );
};