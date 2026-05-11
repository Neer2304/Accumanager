// components/batmanprofile/components/BatmanProfileNotifications.tsx
'use client';

import React from 'react';
import { Box, Typography, Paper, Stack, Switch, FormControlLabel, Divider } from '@mui/material';
import { Email as EmailIcon, PhoneAndroid as SmsIcon, Inventory as InventoryIcon, Assessment as ReportIcon } from '@mui/icons-material';
import { UserProfile, batmanColors } from '../types';

interface BatmanProfileNotificationsProps {
  profile: UserProfile | null;
  onPreferenceChange: (preference: keyof UserProfile['preferences'], value: boolean) => void;
  darkMode?: boolean;
}

export const BatmanProfileNotifications: React.FC<BatmanProfileNotificationsProps> = ({ profile, onPreferenceChange, darkMode }) => {
  if (!profile) return null;

  const notificationItems = [
    { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive important updates via secure channel', icon: <EmailIcon /> },
    { key: 'smsNotifications' as const, label: 'SMS Notifications', description: 'Get instant alerts on your Bat-phone', icon: <SmsIcon /> },
    { key: 'lowStockAlerts' as const, label: 'Low Stock Alerts', description: 'Monitor Wayne Enterprises inventory', icon: <InventoryIcon /> },
    { key: 'monthlyReports' as const, label: 'Monthly Reports', description: 'Receive Batcomputer analytics reports', icon: <ReportIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 1 }}>Notification Preferences</Typography>
        <Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}>Configure your Bat-signal alerts 🦇</Typography>
      </Box>
      <Divider sx={{ borderColor: batmanColors.gold }} />
      <Stack spacing={2}>
        {notificationItems.map((item) => (
          <Paper key={item.key} sx={{ p: 2, borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `1px solid ${batmanColors.border}` }}>
            <FormControlLabel
              control={<Switch checked={profile.preferences?.[item.key] || false} onChange={(e) => onPreferenceChange(item.key, e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: batmanColors.gold }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: batmanColors.gold } }} />}
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ color: batmanColors.inkSub }}>{item.icon}</Box><Box><Typography variant="body2" sx={{ fontWeight: 600, color: batmanColors.ink }}>{item.label}</Typography><Typography variant="caption" sx={{ color: batmanColors.inkSub }}>{item.description}</Typography></Box></Box>}
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};