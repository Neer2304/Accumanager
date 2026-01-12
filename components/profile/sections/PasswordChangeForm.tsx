import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';

interface PasswordChangeFormProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const PasswordChangeForm = ({ onChangePassword }: PasswordChangeFormProps) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChanging, setIsChanging] = useState(false);
  
  const { security } = PROFILE_CONTENT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert(security.passwordMismatch);
      return;
    }

    if (passwords.newPassword.length < 6) {
      alert(security.passwordLength);
      return;
    }

    setIsChanging(true);
    await onChangePassword(passwords.currentPassword, passwords.newPassword);
    setIsChanging(false);
    
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          type="password"
          label={security.currentPassword}
          value={passwords.currentPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
          required
          InputProps={{
            startAdornment: <ProfileIcon name="Lock" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
        <TextField
          fullWidth
          type="password"
          label={security.newPassword}
          value={passwords.newPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
          required
          InputProps={{
            startAdornment: <ProfileIcon name="Fingerprint" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
        <TextField
          fullWidth
          type="password"
          label={security.confirmPassword}
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
          InputProps={{
            startAdornment: <ProfileIcon name="Security" size="small" sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isChanging}
          sx={{ alignSelf: 'flex-start' }}
          startIcon={<ProfileIcon name="Lock" size="small" />}
        >
          {isChanging ? security.changing : security.changePassword}
        </Button>
      </Box>
    </form>
  );
};