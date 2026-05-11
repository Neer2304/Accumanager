// components/batmanprofile/components/BatmanProfileStats.tsx
'use client';

import React from 'react';
import { Box, Paper, Typography, Stack, alpha } from '@mui/material';
import { BusinessCenter, Group, Receipt, Storage } from '@mui/icons-material';
import { UserProfile, SubscriptionStatus, batmanColors } from '../types';
import { getProgressColor } from '../utils';

interface BatmanProfileStatsProps {
  profile: UserProfile | null;
  subscriptionStatus?: SubscriptionStatus | null;
  darkMode?: boolean;
  getUsagePercentage: (resource: string) => number;
}

export const BatmanProfileStats: React.FC<BatmanProfileStatsProps> = ({
  profile,
  subscriptionStatus,
  darkMode,
  getUsagePercentage,
}) => {
  if (!profile?.usage || !subscriptionStatus) return null;

  const stats = [
    { title: 'Products', value: profile.usage?.products || 0, limit: subscriptionStatus.limits?.products || 0, icon: <BusinessCenter />, color: batmanColors.gold, unit: '' },
    { title: 'Customers', value: profile.usage?.customers || 0, limit: subscriptionStatus.limits?.customers || 0, icon: <Group />, color: batmanColors.gold, unit: '' },
    { title: 'Invoices', value: profile.usage?.invoices || 0, limit: subscriptionStatus.limits?.invoices || 0, icon: <Receipt />, color: batmanColors.gold, unit: '' },
    { title: 'Storage', value: profile.usage?.storageMB || 0, limit: subscriptionStatus.limits?.storageMB || 0, icon: <Storage />, color: batmanColors.gold, unit: 'MB' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {stats.map((stat, index) => {
        const percentage = getUsagePercentage(stat.title.toLowerCase());
        return (
          <Paper key={index} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200, p: 2.5, borderRadius: '16px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, boxShadow: `0 0 10px ${batmanColors.goldGlow}`, '&:hover': { transform: 'translateY(-2px)', borderColor: batmanColors.gold, transition: 'all 0.2s' } }}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha(batmanColors.gold, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 24, color: batmanColors.gold } })}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: batmanColors.inkSub, fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>{stat.title}</Typography>
                  <Typography variant="h6" sx={{ color: batmanColors.gold, fontWeight: 800 }}>{stat.value.toLocaleString()}{stat.unit} / {stat.limit.toLocaleString()}{stat.unit}</Typography>
                </Box>
              </Stack>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: batmanColors.inkSub, letterSpacing: '0.05em' }}>Usage</Typography>
                  <Typography variant="caption" sx={{ color: getProgressColor(percentage), fontWeight: 700 }}>{Math.round(percentage)}%</Typography>
                </Stack>
                <Box sx={{ height: 6, backgroundColor: batmanColors.border, borderRadius: 3, overflow: 'hidden' }}>
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