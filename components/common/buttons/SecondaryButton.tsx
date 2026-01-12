import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

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
  return (
    <Button
      variant={outlined ? "outlined" : "text"}
      color="primary"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;