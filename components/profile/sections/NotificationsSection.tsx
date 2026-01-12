import React from 'react';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { PROFILE_CONTENT } from '../ProfileContent';
import { UserProfile } from '@/hooks/useProfileData';

interface NotificationsSectionProps {
  profile: UserProfile;
  onPreferenceChange: (preference: string, value: boolean) => void;
}

export const NotificationsSection = ({
  profile,
  onPreferenceChange,
}: NotificationsSectionProps) => {
  const { notifications } = PROFILE_CONTENT;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {notifications.title}
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={profile.preferences?.emailNotifications || false}
            onChange={(e) => onPreferenceChange('emailNotifications', e.target.checked)}
          />
        }
        label={notifications.emailNotifications}
      />

      <FormControlLabel
        control={
          <Switch
            checked={profile.preferences?.smsNotifications || false}
            onChange={(e) => onPreferenceChange('smsNotifications', e.target.checked)}
          />
        }
        label={notifications.smsNotifications}
      />

      <FormControlLabel
        control={
          <Switch
            checked={profile.preferences?.lowStockAlerts || false}
            onChange={(e) => onPreferenceChange('lowStockAlerts', e.target.checked)}
          />
        }
        label={notifications.lowStockAlerts}
      />

      <FormControlLabel
        control={
          <Switch
            checked={profile.preferences?.monthlyReports || false}
            onChange={(e) => onPreferenceChange('monthlyReports', e.target.checked)}
          />
        }
        label={notifications.monthlyReports}
      />
    </Box>
  );
};