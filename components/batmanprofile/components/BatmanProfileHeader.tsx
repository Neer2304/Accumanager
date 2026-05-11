// components/batmanprofile/components/BatmanProfileHeader.tsx
'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Chip, Stack, Button } from '@mui/material';
import Link from 'next/link';
import { Home as HomeIcon, Refresh, Upgrade } from '@mui/icons-material';
import { UserProfile, SubscriptionStatus, batmanColors } from '../types';
import { getPlanColor } from '../utils';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface BatmanProfileHeaderProps {
  profile: UserProfile | null;
  businessName?: string;
  subscriptionStatus?: SubscriptionStatus | null;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onRefresh: () => void;
  onUpgradeClick: () => void;
}

export const BatmanProfileHeader: React.FC<BatmanProfileHeaderProps> = ({
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
      borderBottom: `2px solid ${batmanColors.gold}`,
      background: darkMode
        ? `linear-gradient(135deg, ${batmanColors.surface} 0%, ${batmanColors.bg} 100%)`
        : `linear-gradient(135deg, #e8e8e8 0%, #ffffff 100%)`,
    }}>
      <Breadcrumbs sx={{ mb: { xs: 2, sm: 3 } }}>
        <MuiLink component={Link} href="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: batmanColors.inkSub, '&:hover': { color: batmanColors.gold } }}>
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Batcomputer
        </MuiLink>
        <Typography color={batmanColors.gold} sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>Identity Profile</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <GoogleAMLogo size={80} darkMode={darkMode} />
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 1 }}>
              {profile.name || 'Bruce Wayne'} 🦇
            </Typography>
            <Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em', mb: 1.5 }}>
              {businessName || profile.businessName || 'Wayne Enterprises'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Chip label={profile.role || 'Dark Knight'} size="small" sx={{ backgroundColor: batmanColors.goldSoft, color: batmanColors.gold, fontWeight: 700, letterSpacing: '0.05em' }} />
              <Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: profile.isActive ? 'rgba(0, 255, 136, 0.15)' : batmanColors.goldSoft, color: profile.isActive ? '#00ff88' : batmanColors.gold, fontWeight: 700 }} />
              {subscriptionStatus && (
                <Chip label={subscriptionStatus.plan === 'trial' ? 'Free Trial' : subscriptionStatus.plan + ' Plan'} size="small" sx={{ backgroundColor: batmanColors.goldSoft, color: batmanColors.gold, fontWeight: 700 }} />
              )}
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button startIcon={<Refresh />} onClick={onRefresh} variant="outlined" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', borderColor: batmanColors.gold, color: batmanColors.gold, '&:hover': { backgroundColor: batmanColors.goldSoft, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
            Refresh
          </Button>
          <Button startIcon={<Upgrade />} onClick={onUpgradeClick} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '8px', backgroundColor: batmanColors.gold, color: '#0a0a0a', fontWeight: 700, '&:hover': { backgroundColor: batmanColors.goldHov, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
            Upgrade Plan
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};