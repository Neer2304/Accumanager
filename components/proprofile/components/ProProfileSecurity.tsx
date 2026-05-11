// components/proprofile/components/ProProfileSecurity.tsx
'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Divider, InputAdornment, IconButton, Chip } from '@mui/material';
import { Lock as LockIcon, Visibility, VisibilityOff, Save as SaveIcon } from '@mui/icons-material';
import { PasswordData, UserProfile } from '../types';

interface ProProfileSecurityProps {
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

export const ProProfileSecurity: React.FC<ProProfileSecurityProps> = ({ passwords, onPasswordChange, onPasswordSave, showPassword, onTogglePassword, isSaving, profile, darkMode, isMobile }) => {
  if (!profile) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>Security Settings</Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Manage your account security and password</Typography>
      </Box>
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>Change Password</Typography>
        <Stack spacing={2}>
          <TextField fullWidth type={showPassword.current ? 'text' : 'password'} label="Current Password" value={passwords.currentPassword} onChange={(e) => onPasswordChange('currentPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('current')}>{showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: darkMode ? '#202124' : '#f8f9fa' } }} />
          <TextField fullWidth type={showPassword.new ? 'text' : 'password'} label="New Password" value={passwords.newPassword} onChange={(e) => onPasswordChange('newPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('new')}>{showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: darkMode ? '#202124' : '#f8f9fa' } }} />
          <TextField fullWidth type={showPassword.confirm ? 'text' : 'password'} label="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => onPasswordChange('confirmPassword', e.target.value)} size={isMobile ? "small" : "medium"} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => onTogglePassword('confirm')}>{showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: darkMode ? '#202124' : '#f8f9fa' } }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="contained" onClick={onPasswordSave} disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword || isSaving} startIcon={isSaving ? null : <SaveIcon />} sx={{ borderRadius: '12px', backgroundColor: '#1a73e8', '&:hover': { backgroundColor: '#1557b0' }, px: 4, py: 1 }}>{isSaving ? 'Changing...' : 'Change Password'}</Button></Box>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>Account Information</Typography>
        <Paper sx={{ p: 2.5, borderRadius: '12px', backgroundColor: darkMode ? '#202124' : '#f8f9fa', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Member since</Typography><Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>{new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Last login</Typography><Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Account status</Typography><Chip label={profile.isActive ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: profile.isActive ? (darkMode ? '#0d652d' : '#d9f0e1') : (darkMode ? '#3c4043' : '#f1f3f4'), color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368') }} /></Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};