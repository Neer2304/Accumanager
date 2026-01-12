import React from 'react';
import { Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { PROFILE_CONTENT } from '../ProfileContent';
import { UserProfile } from '@/hooks/useProfileData';
import { SubscriptionStatus } from '@/hooks/useProfileData';

interface UsageStatsSectionProps {
  profile: UserProfile;
  subscriptionStatus: SubscriptionStatus | null;
  getUsagePercentage: (resource: keyof SubscriptionStatus['limits']) => number;
}

export const UsageStatsSection = ({ 
  profile, 
  subscriptionStatus, 
  getUsagePercentage 
}: UsageStatsSectionProps) => {
  const { usage } = PROFILE_CONTENT;

  if (!subscriptionStatus || !profile.usage) return null;

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {usage.title}
        </Typography>
        <Grid container spacing={3}>
          {(['products', 'customers', 'invoices', 'storageMB'] as const).map((resource) => (
            <Grid item xs={12} sm={6} md={3} key={resource}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {usage.resources[resource]}
                  {resource === 'storageMB' && ' (Storage)'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {profile.usage![resource] || 0} / {subscriptionStatus.limits[resource]}
                  {resource === 'storageMB' && ' MB'}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getUsagePercentage(resource)}
                  color={
                    getUsagePercentage(resource) > 90 ? 'error' :
                    getUsagePercentage(resource) > 75 ? 'warning' : 'primary'
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {Math.round(getUsagePercentage(resource))}% {usage.used}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};