// components/dpprofile/components/DpProfileHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Chip, Stack, Button } from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon, Refresh, Upgrade } from '@mui/icons-material';
import { UserProfile, SubscriptionStatus, dpColors } from '../types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface DpProfileHeaderProps {
  profile: UserProfile | null;
  businessName?: string;
  subscriptionStatus?: SubscriptionStatus | null;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onRefresh: () => void;
  onUpgradeClick: () => void;
}

export const DpProfileHeader: React.FC<DpProfileHeaderProps> = ({
  profile,
  businessName,
  subscriptionStatus,
  darkMode,
  isMobile,
//   isTablet,
  onRefresh,
  onUpgradeClick,
}) => {
  if (!profile) return null;

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      borderBottom: `2px solid ${dpColors.border}`,
      background: darkMode
        ? `linear-gradient(135deg, ${dpColors.surface} 0%, ${dpColors.bg} 100%)`
        : `linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)`,
    }}>
      <Breadcrumbs sx={{ mb: { xs: 2, sm: 3 } }}>
        <MuiLink component={Link} href="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: dpColors.inkSub, '&:hover': { color: dpColors.red } }}>
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Dashboard
        </MuiLink>
        <Typography color={dpColors.ink}>Profile</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <GoogleAMLogo size={80} darkMode={darkMode} />
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em', mb: 1 }}>
              {profile.name || 'Deadpool User'} 🦸
            </Typography>
            <Typography variant="body2" sx={{ color: dpColors.inkSub, mb: 1.5 }}>
              {businessName || profile.businessName || 'Maximum Effort Business'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={profile.role || 'Merc with a Mouth'} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.red, fontWeight: 700 }} />
              <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: profile.isActive ? 'rgba(52, 168, 83, 0.15)' : dpColors.redSoft, color: profile.isActive ? '#34a853' : dpColors.red, fontWeight: 700 }} />
              {subscriptionStatus && (
                <Chip label={subscriptionStatus.plan === 'trial' ? 'Free Trial' : subscriptionStatus.plan + ' Plan'} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.red, fontWeight: 700 }} />
              )}
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button startIcon={<Refresh />} onClick={onRefresh} variant="outlined" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', borderColor: dpColors.border, color: dpColors.ink, '&:hover': { borderColor: dpColors.red, backgroundColor: dpColors.redSoft, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
            Refresh
          </Button>
          <Button startIcon={<Upgrade />} onClick={onUpgradeClick} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
            Upgrade Plan
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};