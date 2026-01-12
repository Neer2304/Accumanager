import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';
import { ProfileIcons } from '@/assets/icons/ProfileIcons';

interface BusinessInfoSectionProps {
  formData: {
    businessName: string;
    gstNumber: string;
    businessAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone: string;
    email: string;
    logo?: string;
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
        {/* Header */}
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          {businessInfo.title}
        </Typography>

        {/* Business Basic Info */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label={businessInfo.businessName}
            value={formData.businessName}
            onChange={(e) => onFormChange('businessName', e.target.value)}
            required
            InputProps={{
              startAdornment: <ProfileIcon name="Business" size="small" sx={{ mr: 1, color: 'primary.main' }} />,
            }}
          />
          
          <TextField
            fullWidth
            label={businessInfo.gstNumber}
            value={formData.gstNumber}
            onChange={(e) => onFormChange('gstNumber', e.target.value.toUpperCase())}
            placeholder={businessInfo.gstPlaceholder}
            helperText="15-character GSTIN"
            InputProps={{
              startAdornment: <ProfileIcon name="Verified" size="small" sx={{ mr: 1, color: 'primary.main' }} />,
            }}
          />
        </Box>

        {/* Address Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          Business Address
        </Typography>

        <TextField
          fullWidth
          label={businessInfo.businessAddress || "Full Address"}
          multiline
          rows={3}
          value={formData.businessAddress}
          onChange={(e) => onFormChange('businessAddress', e.target.value)}
          InputProps={{
            startAdornment: <ProfileIcon name="Location" size="small" sx={{ mr: 1, color: 'primary.main', alignSelf: 'flex-start', mt: 1.5 }} />,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => onFormChange('city', e.target.value)}
            placeholder="Enter city"
          />
          
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => onFormChange('state', e.target.value)}
            placeholder="Enter state"
          />
          
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => onFormChange('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit pincode"
            inputProps={{ maxLength: 6 }}
          />
        </Box>

        {/* Contact Information */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          Contact Information
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit phone number"
            inputProps={{ maxLength: 10 }}
            InputProps={{
              startAdornment: <ProfileIcon name="Phone" size="small" sx={{ mr: 1, color: 'primary.main' }} />,
            }}
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            placeholder="business@example.com"
            InputProps={{
              startAdornment: <ProfileIcon name="Email" size="small" sx={{ mr: 1, color: 'primary.main' }} />,
            }}
          />
        </Box>

        {/* Logo URL (Optional) */}
        <TextField
          fullWidth
          label="Business Logo URL (Optional)"
          value={formData.logo || ''}
          onChange={(e) => onFormChange('logo', e.target.value)}
          placeholder="https://example.com/logo.png"
          helperText="Enter URL of your business logo"
          InputProps={{
            startAdornment: <ProfileIcons.Person/>,
          }}
        />

        {/* Preview Logo if exists */}
        {formData.logo && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Logo Preview:
            </Typography>
            <Box
              component="img"
              src={formData.logo}
              alt="Business logo"
              sx={{
                maxWidth: 100,
                maxHeight: 100,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                objectFit: 'contain'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </Box>
        )}

        {/* Save Button */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'flex-end',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 120 }}
          >
            {saving ? businessInfo.saving : businessInfo.saveChanges || 'Save Business'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};