import React from 'react';
import { Box, Typography, Card, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';
import { SubscriptionStatus } from '@/hooks/useProfileData';

interface SubscriptionSectionProps {
  subscriptionStatus: SubscriptionStatus | null;
  onUpgradeClick: () => void;
}

export const SubscriptionSection = ({
  subscriptionStatus,
  onUpgradeClick,
}: SubscriptionSectionProps) => {
  const { subscription, pricingPlans } = PROFILE_CONTENT;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {subscription.title}
        </Typography>
        {subscriptionStatus ? (
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6">
                  {pricingPlans[subscriptionStatus.plan as keyof typeof pricingPlans]?.name || 'Free Trial'}
                </Typography>
                <Typography color="text.secondary">
                  {subscription.status}: {subscriptionStatus.isActive ? subscription.active : subscription.inactive}
                </Typography>
                {subscriptionStatus.currentPeriodEnd && (
                  <Typography color="text.secondary">
                    {subscriptionStatus.isActive ? subscription.renewsOn : subscription.expiredOn}: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-IN')}
                  </Typography>
                )}
                {subscriptionStatus.daysRemaining !== undefined && (
                  <Typography color="text.secondary">
                    {subscriptionStatus.daysRemaining} {subscription.daysRemaining}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<ProfileIcon name="Upgrade" />}
                onClick={onUpgradeClick}
              >
                {subscription.upgradePlan}
              </Button>
            </Box>
          </Card>
        ) : (
          <Typography color="text.secondary">{subscription.loading}</Typography>
        )}
      </Box>

      {subscriptionStatus && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {subscription.currentPlanFeatures}
          </Typography>
          <List>
            {pricingPlans[subscriptionStatus.plan as keyof typeof pricingPlans]?.features.map((feature: string, index: number) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ProfileIcon name="Check" size="small" color="success" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};