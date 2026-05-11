// components/propos/ProNetworkStatus.tsx
'use client';

import React from 'react';
import { Box, Typography, IconButton, Tooltip, Badge, Paper, Chip, Avatar, Stack, useTheme } from "@mui/material";
import { CloudQueue as CloudQueueIcon, CloudOff as CloudOffIcon, Sync as SyncIcon } from "@mui/icons-material";

interface ProNetworkStatusProps {
  isOnline: boolean; offlineBillsCount: number; onSyncClick: () => void; subscription?: any; usage?: any;
}

export const ProNetworkStatus: React.FC<ProNetworkStatusProps> = ({ isOnline, offlineBillsCount, onSyncClick, subscription, usage }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const invoiceLimit = subscription?.limits?.invoices || subscription?.features?.invoices || 0;
  const invoiceCount = usage?.invoices || usage?.invoiceCount || 0;

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, boxShadow: 'none' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: isOnline ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)') : (darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'), color: isOnline ? (darkMode ? '#81c995' : '#34a853') : (darkMode ? '#fdd663' : '#fbbc04') }}>{isOnline ? <CloudQueueIcon sx={{ fontSize: 18 }} /> : <CloudOffIcon sx={{ fontSize: 18 }} />}</Avatar>
          <Box><Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{isOnline ? 'Online - Real-time billing' : 'Offline - Bills saved locally'}</Typography>{!isOnline && <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>You're working offline</Typography>}</Box>
          {offlineBillsCount > 0 && (<Tooltip title={`${offlineBillsCount} bills waiting to sync`}><Badge badgeContent={offlineBillsCount} sx={{ '& .MuiBadge-badge': { backgroundColor: darkMode ? '#fdd663' : '#fbbc04', color: darkMode ? '#202124' : '#ffffff' } }}><IconButton size="small" onClick={onSyncClick} disabled={!isOnline}><SyncIcon sx={{ fontSize: 18, color: darkMode ? '#fdd663' : '#fbbc04' }} /></IconButton></Badge></Tooltip>)}
        </Stack>
        {subscription?.plan && (<Stack direction="row" alignItems="center" spacing={1.5}><Chip label={typeof subscription.plan === 'string' ? subscription.plan.toUpperCase() : 'PLAN'} size="small" sx={{ backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)', color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 600 }} /><Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>{invoiceCount} / {invoiceLimit} invoices</Typography></Stack>)}
      </Stack>
    </Paper>
  );
};