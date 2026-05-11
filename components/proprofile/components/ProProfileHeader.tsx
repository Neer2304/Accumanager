// components/proprofile/components/ProProfileHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Avatar, Chip, Stack, Button, Fade } from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon, Refresh, Upgrade } from '@mui/icons-material';
import { UserProfile, SubscriptionStatus } from '../types';
import { getPlanColor, getStatusBackgroundColor } from '../utils';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface ProProfileHeaderProps {
  profile: UserProfile | null;
  businessName?: string;
  subscriptionStatus?: SubscriptionStatus | null;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onRefresh: () => void;
  onUpgradeClick: () => void;
}

export const ProProfileHeader: React.FC<ProProfileHeaderProps> = ({
  profile,
  businessName,
  subscriptionStatus,
  darkMode,
  isMobile,
  isTablet,
  onRefresh,
  onUpgradeClick,
}) => {
  if (!profile) return null;

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      background: darkMode
        ? 'linear-gradient(135deg, #1a1a1a 0%, #202124 100%)'
        : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
    }}>
      <Breadcrumbs sx={{ mb: { xs: 2, sm: 3 } }}>
        <MuiLink component={Link} href="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368', '&:hover': { color: darkMode ? '#8ab4f8' : '#1a73e8' } }}>
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Dashboard
        </MuiLink>
        <Typography color={darkMode ? '#e8eaed' : '#202124'}>Profile</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <GoogleAMLogo size={80} darkMode={darkMode} />
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
              {profile.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1.5 }}>
              {businessName || profile.businessName || 'Business Account'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={profile.role || 'User'} size="small" sx={{ backgroundColor: darkMode ? '#3c4043' : '#f1f3f4', color: darkMode ? '#e8eaed' : '#202124' }} />
              <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: profile.isActive ? (darkMode ? '#0d652d' : '#d9f0e1') : (darkMode ? '#3c4043' : '#f1f3f4'), color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368') }} />
              {subscriptionStatus && (
                <Chip label={subscriptionStatus.plan === 'trial' ? 'Free Trial' : subscriptionStatus.plan + ' Plan'} size="small" sx={{ backgroundColor: 'rgba(66, 133, 244, 0.1)', color: getPlanColor(subscriptionStatus.plan) }} />
              )}
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button startIcon={<Refresh />} onClick={onRefresh} variant="outlined" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', borderColor: darkMode ? '#3c4043' : '#dadce0', color: darkMode ? '#e8eaed' : '#202124', '&:hover': { borderColor: darkMode ? '#8ab4f8' : '#1a73e8', backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)' } }}>
            Refresh
          </Button>
          <Button startIcon={<Upgrade />} onClick={onUpgradeClick} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', backgroundColor: '#1a73e8', '&:hover': { backgroundColor: '#1557b0' } }}>
            Upgrade Plan
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};