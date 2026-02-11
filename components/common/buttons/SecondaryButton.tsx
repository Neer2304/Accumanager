'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress, useTheme } from '@mui/material';

interface SecondaryButtonProps extends ButtonProps {
  loading?: boolean;
  outlined?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  loading = false,
  outlined = false,
  disabled,
  startIcon,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      variant={outlined ? 'outlined' : 'text'}
      color="primary"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
      sx={{
        px: 3,
        py: 1.25,
        borderRadius: '28px',
        borderColor: darkMode ? '#3c4043' : '#dadce0',
        color: darkMode ? '#e8eaed' : '#202124',
        textTransform: 'none',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
          backgroundColor: darkMode
            ? 'rgba(138, 180, 248, 0.05)'
            : 'rgba(26, 115, 232, 0.05)',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;