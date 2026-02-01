"use client";

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Button2 } from '../ui/button2';
import { Card2 } from '../ui/card2';
import { SubscriptionStatus } from '@/types/settings';

interface SubscriptionSettingsProps {
  subscription: SubscriptionStatus | null;
  onUpgradeClick: () => void;
}

export const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({
  subscription,
  onUpgradeClick,
}) => {
  if (!subscription) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CombinedIcon name="Payment" size={64} sx={{ mb: 2, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          No active subscription
        </Typography>
        <Button2
          variant="contained"
          iconLeft={<CombinedIcon name="Upgrade" size={16} />}
          onClick={onUpgradeClick}
          sx={{ mt: 2 }}
        >
          View Plans
        </Button2>
      </Box>
    );
  }

  const getUsagePercentage = (resource: string) => {
    const usage = subscription.usage[resource as keyof typeof subscription.usage] || 0
    const limit = subscription.limits[resource as keyof typeof subscription.limits] || 1
    return Math.min((usage / limit) * 100, 100)
  };

  const resources = [
    { key: 'products', label: 'Products', icon: 'Inventory' },
    { key: 'customers', label: 'Customers', icon: 'People' },
    { key: 'employees', label: 'Employees', icon: 'AccountCircle' },
    { key: 'storageMB', label: 'Storage', icon: 'Storage' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Current Plan */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Current Plan
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3, border: 2, borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
              </Typography>
              <Chip 
                label={subscription.isActive ? 'Active' : 'Inactive'} 
                color={subscription.isActive ? "success" : "error"}
                sx={{ mt: 1 }}
                size="small"
              />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" color="primary.main">
                {subscription.plan === 'trial' ? 'FREE' : `₹${subscription.nextBillingAmount}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {subscription.plan === 'trial' ? 'Trial Period' : 
                 subscription.plan === 'monthly' ? 'per month' :
                 subscription.plan === 'quarterly' ? 'per quarter' : 'per year'}
              </Typography>
            </Box>
          </Box>
        </Card2>

        {/* Resource Usage */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Resource Usage
        </Typography>
        <Card2 sx={{ p: 3, borderRadius: 2 }}>
          {resources.map((resource) => (
            <Box key={resource.key} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CombinedIcon name={resource.icon as any} size={16} />
                  <Typography variant="body2" fontWeight={500}>
                    {resource.label}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {subscription.usage[resource.key as keyof typeof subscription.usage]} / {subscription.limits[resource.key as keyof typeof subscription.limits]}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getUsagePercentage(resource.key)} 
                sx={{ height: 6, borderRadius: 3 }}
                color={getUsagePercentage(resource.key) > 90 ? 'error' : 'primary'}
              />
            </Box>
          ))}
        </Card2>
      </Box>
    </Box>
  );
};