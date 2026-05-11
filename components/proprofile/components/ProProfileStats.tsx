// components/proprofile/components/ProProfileStats.tsx
'use client';

import React from 'react';
import { Box, Paper, Typography, Stack, alpha } from '@mui/material';
import { BusinessCenter, Group, Receipt, Storage } from '@mui/icons-material';
import { UserProfile, SubscriptionStatus } from '../types';
import { getProgressColor } from '../utils';

interface ProProfileStatsProps {
  profile: UserProfile | null;
  subscriptionStatus?: SubscriptionStatus | null;
  darkMode?: boolean;
  getUsagePercentage: (resource: string) => number;
}

export const ProProfileStats: React.FC<ProProfileStatsProps> = ({
  profile,
  subscriptionStatus,
  darkMode,
  getUsagePercentage,
}) => {
  if (!profile?.usage || !subscriptionStatus) return null;

  const stats = [
    { title: 'Products', value: profile.usage?.products || 0, limit: subscriptionStatus.limits?.products || 0, icon: <BusinessCenter />, color: '#1a73e8', unit: '' },
    { title: 'Customers', value: profile.usage?.customers || 0, limit: subscriptionStatus.limits?.customers || 0, icon: <Group />, color: '#34a853', unit: '' },
    { title: 'Invoices', value: profile.usage?.invoices || 0, limit: subscriptionStatus.limits?.invoices || 0, icon: <Receipt />, color: '#fbbc04', unit: '' },
    { title: 'Storage', value: profile.usage?.storageMB || 0, limit: subscriptionStatus.limits?.storageMB || 0, icon: <Storage />, color: '#ea4335', unit: 'MB' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {stats.map((stat, index) => {
        const percentage = getUsagePercentage(stat.title.toLowerCase());
        return (
          <Paper key={index} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200, p: 2.5, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${alpha(stat.color, 0.2)}` }}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha(stat.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 24, color: stat.color } })}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>{stat.title}</Typography>
                  <Typography variant="h6" sx={{ color: stat.color, fontWeight: 600 }}>{stat.value.toLocaleString()}{stat.unit} / {stat.limit.toLocaleString()}{stat.unit}</Typography>
                </Box>
              </Stack>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Usage</Typography>
                  <Typography variant="caption" sx={{ color: getProgressColor(percentage), fontWeight: 500 }}>{Math.round(percentage)}%</Typography>
                </Stack>
                <Box sx={{ height: 6, backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ width: `${percentage}%`, height: '100%', backgroundColor: getProgressColor(percentage), borderRadius: 3 }} />
                </Box>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};