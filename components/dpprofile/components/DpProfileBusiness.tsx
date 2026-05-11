// components/dpprofile/components/DpProfileBusiness.tsx
'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Divider, InputAdornment } from '@mui/material';
import { Business as BusinessIcon, LocationOn as LocationIcon, Phone as PhoneIcon, Email as EmailIcon, Save as SaveIcon } from '@mui/icons-material';
import { dpColors } from '../types';

export const DpProfileBusiness: React.FC<DpProfileBusinessProps> = ({ formData, onFormChange, onSave, isSaving, darkMode, isMobile }) => {
  return (
    <form onSubmit={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em', mb: 1 }}>Business Information</Typography>
          <Typography variant="body2" sx={{ color: dpColors.inkSub }}>Manage your business details - Chimichanga style! 🌯</Typography>
        </Box>
        <Divider sx={{ borderColor: dpColors.border }} />
        <TextField fullWidth label="Business Name" value={formData.businessName} onChange={(e) => onFormChange('businessName', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        <TextField fullWidth label="Business Address" multiline rows={2} value={formData.address} onChange={(e) => onFormChange('address', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField fullWidth label="City" value={formData.city} onChange={(e) => onFormChange('city', e.target.value)} required size={isMobile ? "small" : "medium"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <TextField fullWidth label="State" value={formData.state} onChange={(e) => onFormChange('state', e.target.value)} required size={isMobile ? "small" : "medium"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <TextField fullWidth label="Pincode" value={formData.pincode} onChange={(e) => onFormChange('pincode', e.target.value)} required size={isMobile ? "small" : "medium"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        </Box>
        <TextField fullWidth label="Country" value={formData.country} onChange={(e) => onFormChange('country', e.target.value)} required size={isMobile ? "small" : "medium"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        <TextField fullWidth label="GST Number" value={formData.gstNumber} onChange={(e) => onFormChange('gstNumber', e.target.value)} placeholder="e.g., 07AABCU9603R1ZM" size={isMobile ? "small" : "medium"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField fullWidth label="Business Phone" value={formData.phone} onChange={(e) => onFormChange('phone', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <TextField fullWidth label="Business Email" type="email" value={formData.email} onChange={(e) => onFormChange('email', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving ? null : <SaveIcon />} sx={{ borderRadius: '12px', backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov }, px: 4, py: 1, fontWeight: 700 }}>{isSaving ? 'Saving...' : 'Save Business Details'}</Button>
        </Box>
      </Box>
    </form>
  );
};