import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { PROFILE_CONTENT } from '../ProfileContent';
import { UserProfile } from '@/hooks/useProfileData';
import { PasswordChangeForm } from './PasswordChangeForm';

interface SecuritySectionProps {
  profile: UserProfile;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const SecuritySection = ({
  profile,
  onChangePassword,
}: SecuritySectionProps) => {
  const { security, header } = PROFILE_CONTENT;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {security.title}
      </Typography>

      <PasswordChangeForm onChangePassword={onChangePassword} />

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          {security.sessionInfo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {header.memberSince}: {new Date(profile.createdAt).toLocaleDateString('en-IN')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {header.lastLogin}: {new Date().toLocaleDateString('en-IN')}
        </Typography>
      </Box>
    </Box>
  );
};