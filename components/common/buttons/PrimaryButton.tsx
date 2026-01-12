import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface PrimaryButtonProps extends ButtonProps {
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;