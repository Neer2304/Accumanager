// components/batmanprofile/components/BatmanProfilePersonal.tsx
'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Divider, InputAdornment } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Save as SaveIcon } from '@mui/icons-material';
import { ProfileFormData, batmanColors } from '../types';

interface BatmanProfilePersonalProps {
  formData: ProfileFormData;
  onFormChange: (field: keyof ProfileFormData, value: string) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
  darkMode?: boolean;
  isMobile?: boolean;
}

export const BatmanProfilePersonal: React.FC<BatmanProfilePersonalProps> = ({ formData, onFormChange, onSave, isSaving, darkMode, isMobile }) => {
  return (
    <form onSubmit={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 1 }}>Personal Information</Typography>
          <Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}>Update your secret identity details 🦇</Typography>
        </Box>
        <Divider sx={{ borderColor: batmanColors.gold }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border }, '&:hover fieldset': { borderColor: batmanColors.gold } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
          <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={(e) => onFormChange('email', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
        </Box>
        <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => onFormChange('phone', e.target.value)} required size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving ? null : <SaveIcon />} sx={{ borderRadius: '12px', backgroundColor: batmanColors.gold, color: '#0a0a0a', fontWeight: 700, '&:hover': { backgroundColor: batmanColors.goldHov }, px: 4, py: 1 }}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </Box>
      </Box>
    </form>
  );
};