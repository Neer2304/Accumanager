// components/batmanprofile/components/BatmanProfileSubscription.tsx
'use client';

import React from 'react';
import { Box, Typography, Paper, Button, Divider, Chip, Stack } from '@mui/material';
import { Check as CheckIcon, Upgrade as UpgradeIcon } from '@mui/icons-material';
import { SubscriptionStatus, batmanColors } from '../types';
import { PRICING_PLANS, getPlanColor } from '../utils';

interface BatmanProfileSubscriptionProps {
  subscriptionStatus: SubscriptionStatus | null;
  onUpgradeClick: () => void;
  darkMode?: boolean;
}

export const BatmanProfileSubscription: React.FC<BatmanProfileSubscriptionProps> = ({ subscriptionStatus, onUpgradeClick, darkMode }) => {
  if (!subscriptionStatus) return null;

  const planKey = subscriptionStatus.plan as keyof typeof PRICING_PLANS;
  const plan = PRICING_PLANS[planKey] || PRICING_PLANS.trial;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 1 }}>Subscription Protocol</Typography>
        <Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}>Manage your Wayne Enterprises membership 🦇</Typography>
      </Box>
      <Divider sx={{ borderColor: batmanColors.gold }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: batmanColors.gold, letterSpacing: '0.05em', mb: 2 }}>Current Membership</Typography>
        <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `2px solid ${batmanColors.gold}`, background: `linear-gradient(135deg, ${batmanColors.surface} 0%, ${batmanColors.surface2} 100%)` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: getPlanColor(subscriptionStatus.plan) }}>{plan.name}</Typography>
                <Chip label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: subscriptionStatus.isActive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 68, 68, 0.15)', color: subscriptionStatus.isActive ? '#00ff88' : '#ff4444', fontWeight: 700 }} />
              </Box>
              {subscriptionStatus.currentPeriodEnd && <Typography variant="body2" sx={{ color: batmanColors.inkSub }}>{subscriptionStatus.isActive ? 'Renews on' : 'Expired on'}: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>}
              {subscriptionStatus.daysRemaining !== undefined && <Typography variant="body2" sx={{ color: subscriptionStatus.daysRemaining > 7 ? '#00ff88' : batmanColors.gold, fontWeight: 700 }}>{subscriptionStatus.daysRemaining} days remaining</Typography>}
            </Box>
            <Button variant="contained" startIcon={<UpgradeIcon />} onClick={onUpgradeClick} sx={{ borderRadius: '12px', backgroundColor: batmanColors.gold, color: '#0a0a0a', fontWeight: 700, '&:hover': { backgroundColor: batmanColors.goldHov }, px: 3, py: 1 }}>Upgrade Membership</Button>
          </Box>
        </Paper>
      </Box>
      {subscriptionStatus && (
        <>
          <Divider sx={{ borderColor: batmanColors.gold }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: batmanColors.gold, letterSpacing: '0.05em', mb: 2 }}>Membership Features</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {plan.features.map((feature: string, index: number) => (
                <Paper key={index} sx={{ p: 2, borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `1px solid ${batmanColors.border}`, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckIcon fontSize="small" sx={{ color: '#00ff88', mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: batmanColors.ink }}>{feature}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};