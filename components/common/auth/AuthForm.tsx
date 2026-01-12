import React, { ReactNode, FormEvent } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
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
  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ mb: 3.5 }}>
        {children}
      </Box>

      {showSubmitButton && (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={22} color="inherit" /> : submitIcon}
          disabled={loading}
          sx={{
            mt: 1,
            mb: 3,
            py: 1.75,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: '200% 100%',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            fontSize: '1.05rem',
            fontWeight: '600',
            textTransform: 'none',
            letterSpacing: '0.5px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-3px) scale(1.02)',
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
              backgroundPosition: '100% 0',
            },
            '&:active': {
              transform: 'translateY(0) scale(0.98)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.7s ease',
            },
            '&:hover::before': {
              left: '100%',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
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