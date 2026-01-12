import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PersonalInfoSection = ({
  formData,
  saving,
  onFormChange,
  onSubmit,
}: PersonalInfoSectionProps) => {
  const { personalInfo } = PROFILE_CONTENT;

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {personalInfo.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label={personalInfo.fullName}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            required
            InputProps={{
              startAdornment: <ProfileIcon name="Person" size="small" sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <TextField
            fullWidth
            label={personalInfo.emailAddress}
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            required
            InputProps={{
              startAdornment: <ProfileIcon name="Email" size="small" sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Box>

        <TextField
          fullWidth
          label={personalInfo.phoneNumber}
          value={formData.phone}
          onChange={(e) => onFormChange('phone', e.target.value)}
          required
          InputProps={{
            startAdornment: <ProfileIcon name="Phone" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
          >
            {saving ? personalInfo.saving : personalInfo.saveChanges}
          </Button>
        </Box>
      </Box>
    </form>
  );
};