import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';

interface BusinessInfoSectionProps {
  formData: {
    businessName: string;
    gstNumber: string;
    businessAddress: string;
  };
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BusinessInfoSection = ({
  formData,
  saving,
  onFormChange,
  onSubmit,
}: BusinessInfoSectionProps) => {
  const { businessInfo } = PROFILE_CONTENT;

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {businessInfo.title}
        </Typography>

        <TextField
          fullWidth
          label={businessInfo.businessName}
          value={formData.businessName}
          onChange={(e) => onFormChange('businessName', e.target.value)}
          required
          InputProps={{
            startAdornment: <ProfileIcon name="Business" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        <TextField
          fullWidth
          label={businessInfo.gstNumber}
          value={formData.gstNumber}
          onChange={(e) => onFormChange('gstNumber', e.target.value)}
          placeholder={businessInfo.gstPlaceholder}
          InputProps={{
            startAdornment: <ProfileIcon name="Verified" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        <TextField
          fullWidth
          label={businessInfo.businessAddress}
          multiline
          rows={3}
          value={formData.businessAddress}
          onChange={(e) => onFormChange('businessAddress', e.target.value)}
          InputProps={{
            startAdornment: <ProfileIcon name="Location" size="small" sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1.5 }} />,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
          >
            {saving ? businessInfo.saving : businessInfo.saveChanges}
          </Button>
        </Box>
      </Box>
    </form>
  );
};