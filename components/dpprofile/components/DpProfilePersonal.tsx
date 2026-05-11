// components/dpprofile/components/DpProfilePersonal.tsx
'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Divider, InputAdornment } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Save as SaveIcon } from '@mui/icons-material';
import { ProfileFormData, dpColors } from '../types';

interface DpProfilePersonalProps {
  formData: ProfileFormData;
  onFormChange: (field: keyof ProfileFormData, value: string) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
  darkMode?: boolean;
  isMobile?: boolean;
}

export const DpProfilePersonal: React.FC<DpProfilePersonalProps> = ({ formData, onFormChange, onSave, isSaving, isMobile }) => {
  return (
    <form onSubmit={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em', mb: 1 }}>Personal Information</Typography>
          <Typography variant="body2" sx={{ color: dpColors.inkSub }}>Update your personal details - Maximum effort required! 🦸</Typography>
        </Box>
        <Divider sx={{ borderColor: dpColors.border }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border }, '&:hover fieldset': { borderColor: dpColors.red } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={(e) => onFormChange('email', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        </Box>
        <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => onFormChange('phone', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving ? null : <SaveIcon />} sx={{ borderRadius: '12px', backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov }, px: 4, py: 1, fontWeight: 700 }}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </Box>
      </Box>
    </form>
  );
};