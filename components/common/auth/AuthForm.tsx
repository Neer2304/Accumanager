'use client';

import React, { ReactNode, FormEvent } from 'react';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent) => Promise<void> | void;
  submitText?: string;
  loading?: boolean;
  loadingText?: string;
  submitIcon?: ReactNode;
  showSubmitButton?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  children,
  onSubmit,
  submitText = 'Sign In',
  loading = false,
  loadingText = 'Authenticating...',
  submitIcon = <LoginIcon />,
  showSubmitButton = true,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ mb: 3.5 }}>{children}</Box>

      {showSubmitButton && (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : submitIcon}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: '28px',
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            color: darkMode ? '#202124' : '#ffffff',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              boxShadow: darkMode
                ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                : '0 4px 12px rgba(26, 115, 232, 0.3)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              boxShadow: 'none',
              transform: 'none',
            },
          }}
        >
          {loading ? loadingText : submitText}
        </Button>
      )}
    </form>
  );
};

export default AuthForm;