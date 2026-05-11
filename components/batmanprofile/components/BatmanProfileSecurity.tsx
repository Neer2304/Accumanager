// components/batmanprofile/components/BatmanProfileSecurity.tsx
'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Divider, InputAdornment, IconButton, Chip } from '@mui/material';
import { Lock as LockIcon, Visibility, VisibilityOff, Save as SaveIcon } from '@mui/icons-material';
import { PasswordData, UserProfile, batmanColors } from '../types';

interface BatmanProfileSecurityProps {
  passwords: PasswordData;
  onPasswordChange: (field: keyof PasswordData, value: string) => void;
  onPasswordSave: () => void;
  showPassword: { current: boolean; new: boolean; confirm: boolean };
  onTogglePassword: (field: 'current' | 'new' | 'confirm') => void;
  isSaving: boolean;
  profile: UserProfile | null;
  darkMode?: boolean;
  isMobile?: boolean;
}

export const BatmanProfileSecurity: React.FC<BatmanProfileSecurityProps> = ({ passwords, onPasswordChange, onPasswordSave, showPassword, onTogglePassword, isSaving, profile, darkMode, isMobile }) => {
  if (!profile) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em', mb: 1 }}>Security Settings</Typography>
        <Typography variant="body2" sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}>Protect your secret identity 🔒</Typography>
      </Box>
      <Divider sx={{ borderColor: batmanColors.gold }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: batmanColors.gold, letterSpacing: '0.05em', mb: 2 }}>Change Access Code</Typography>
        <Stack spacing={2}>
          <TextField fullWidth type={showPassword.current ? 'text' : 'password'} label="Current Password" value={passwords.currentPassword} onChange={(e) => onPasswordChange('currentPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('current')}>{showPassword.current ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
          <TextField fullWidth type={showPassword.new ? 'text' : 'password'} label="New Password" value={passwords.newPassword} onChange={(e) => onPasswordChange('newPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('new')}>{showPassword.new ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2 } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
          <TextField fullWidth type={showPassword.confirm ? 'text' : 'password'} label="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => onPasswordChange('confirmPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('confirm')}>{showPassword.confirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2 } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="contained" onClick={onPasswordSave} disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword || isSaving} startIcon={isSaving ? null : <SaveIcon />} sx={{ borderRadius: '12px', backgroundColor: batmanColors.gold, color: '#0a0a0a', fontWeight: 700, '&:hover': { backgroundColor: batmanColors.goldHov }, px: 4, py: 1 }}>{isSaving ? 'Changing...' : 'Change Password'}</Button></Box>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: batmanColors.gold }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: batmanColors.gold, letterSpacing: '0.05em', mb: 2 }}>Account Intelligence</Typography>
        <Paper sx={{ p: 2.5, borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `1px solid ${batmanColors.border}` }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: batmanColors.inkSub }}>Member since</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: batmanColors.ink }}>{new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: batmanColors.inkSub }}>Last login</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: batmanColors.ink }}>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: batmanColors.inkSub }}>Status</Typography><Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: profile.isActive ? 'rgba(0, 255, 136, 0.15)' : batmanColors.goldSoft, color: profile.isActive ? '#00ff88' : batmanColors.gold, fontWeight: 700 }} /></Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};