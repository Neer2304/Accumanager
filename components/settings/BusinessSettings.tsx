"use client";

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Divider,
  InputAdornment,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Button2 } from '../ui/button2';
import { Input2 } from '../ui/input2';
import { Card2 } from '../ui/card2';
import { BusinessSettings as BusinessSettingsType } from '@/types/settings';

interface BusinessSettingsProps {
  settings: BusinessSettingsType;
  logoPreview: string;
  onSettingChange: (key: string, value: any) => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BusinessSettings: React.FC<BusinessSettingsProps> = ({
  settings,
  logoPreview,
  onSettingChange,
  onLogoUpload,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Logo Section */}
      <Box sx={{ flex: '0 0 auto', maxWidth: 200 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Business Logo
        </Typography>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            src={logoPreview}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '3px solid',
              borderColor: 'primary.main',
              backgroundColor: logoPreview ? 'transparent' : 'primary.light',
              mx: 'auto',
            }}
          >
            <CombinedIcon name="Business" size={48} />
          </Avatar>
          <Button2
            component="label"
            variant="outlined"
            iconLeft={<CombinedIcon name="CloudUpload" size={16} />}
            sx={{ mb: 1, width: '100%' }}
          >
            Upload Logo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onLogoUpload}
            />
          </Button2>
          <Typography variant="caption" color="text.secondary" display="block">
            Recommended: 500x500px PNG or JPG
          </Typography>
        </Box>
      </Box>

      {/* Business Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Business Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <Input2
            fullWidth
            label="Business Name"
            value={settings.name}
            onChange={(e) => onSettingChange('name', e.target.value)}
            startIcon={<CombinedIcon name="Business" size={16} />}
          />
          <Input2
            fullWidth
            label="GST Number"
            value={settings.gstNumber}
            onChange={(e) => onSettingChange('gstNumber', e.target.value)}
            startIcon={<CombinedIcon name="Shield" size={16} />}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <Input2
            fullWidth
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => onSettingChange('email', e.target.value)}
            startIcon={<CombinedIcon name="Email" size={16} />}
          />
          <Input2
            fullWidth
            label="Phone"
            value={settings.phone}
            onChange={(e) => onSettingChange('phone', e.target.value)}
            startIcon={<CombinedIcon name="Phone" size={16} />}
          />
        </Box>

        <Input2
          fullWidth
          label="Business Address"
          multiline
          rows={2}
          value={settings.businessAddress}
          onChange={(e) => onSettingChange('businessAddress', e.target.value)}
          sx={{ mb: 2 }}
          startIcon={<CombinedIcon name="LocationOn" size={16} />}
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold">
          Regional Settings
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Input2
            fullWidth
            label="Invoice Prefix"
            value={settings.invoicePrefix}
            onChange={(e) => onSettingChange('invoicePrefix', e.target.value)}
            sx={{ flex: 1 }}
          />
          
          <Input2
            fullWidth
            type="number"
            label="Tax Rate"
            value={settings.taxRate}
            onChange={(e) => onSettingChange('taxRate', parseFloat(e.target.value) || 0)}
            sx={{ flex: 1 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};