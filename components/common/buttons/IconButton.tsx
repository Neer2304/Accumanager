import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps, Tooltip } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomIconButtonProps extends IconButtonProps {
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
}

const IconButton: React.FC<CustomIconButtonProps> = ({
  tooltip,
  size = 'medium',
  variant = 'text',
  color = 'primary',
  sx,
  children,
  ...props
}) => {
  const getVariantStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'contained':
        return {
          bgcolor: `${color}.main`,
          color: `${color}.contrastText`,
          '&:hover': { bgcolor: `${color}.dark` },
        };
      case 'outlined':
        return {
          border: 1,
          borderColor: `${color}.main`,
          color: `${color}.main`,
          '&:hover': { bgcolor: `${color}.light`, borderColor: `${color}.dark` },
        };
      default:
        return { color: `${color}.main` };
    }
  };

  const getSizeStyles = (): SxProps<Theme> => {
    switch (size) {
      case 'small': return { width: 32, height: 32 };
      case 'large': return { width: 48, height: 48 };
      default: return { width: 40, height: 40 };
    }
  };

  const button = (
    <MuiIconButton
      size={size}
    //   sx={{
    //     ...getSizeStyles(),
    //     ...getVariantStyles(),
    //     ...sx,
    //   }}
      {...props}
    >
      {children}
    </MuiIconButton>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      {button}
    </Tooltip>
  ) : button;
};

export default IconButton;