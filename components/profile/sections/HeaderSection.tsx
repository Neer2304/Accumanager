import React from 'react';
import { Paper, Typography, Box, Avatar, Button, Chip } from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';
import { UserProfile } from '@/hooks/useProfileData';
import { SubscriptionStatus } from '@/hooks/useProfileData';

interface HeaderSectionProps {
  profile: UserProfile;
  subscriptionStatus: SubscriptionStatus | null;
  getPlanColor: (plan: string) => string;
  onUpgradeClick: () => void;
}

export const HeaderSection = ({ 
  profile, 
  subscriptionStatus, 
  getPlanColor,
  onUpgradeClick 
}: HeaderSectionProps) => {
  const { header, pricingPlans } = PROFILE_CONTENT;

  return (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        background: header.gradient,
        color: 'white',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'white',
            color: '#667eea',
            fontSize: '2rem',
          }}
        >
          {profile.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {profile.name || 'User'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {profile.businessName || 'Business'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label={profile.role || 'User'} size="small" sx={{ bgcolor: 'white', color: '#667eea' }} />
            <Chip 
              label={profile.isActive ? 'Active' : 'Inactive'} 
              size="small" 
              color={profile.isActive ? 'success' : 'default'}
              sx={{ bgcolor: 'white' }}
            />
            {subscriptionStatus && (
              <>
                <Chip 
                  label={pricingPlans[subscriptionStatus.plan as keyof typeof pricingPlans]?.name || 'Free Trial'} 
                  size="small" 
                  color={getPlanColor(subscriptionStatus.plan) as any}
                  sx={{ bgcolor: 'white', color: '#667eea' }} 
                />
                <Chip 
                  label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={subscriptionStatus.isActive ? 'success' : 'error'}
                  sx={{ bgcolor: 'white' }}
                />
                {subscriptionStatus.daysRemaining !== undefined && (
                  <Chip 
                    label={`${subscriptionStatus.daysRemaining} days remaining`}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<ProfileIcon name="Upgrade" />}
          onClick={onUpgradeClick}
          sx={{
            bgcolor: 'white',
            color: '#667eea',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Upgrade Plan
        </Button>
      </Box>
    </Paper>
  );
};