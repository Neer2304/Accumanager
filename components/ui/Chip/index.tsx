// components/ui/Chip/index.tsx
"use client";

import React from 'react';
import { 
  Chip as MuiChip, 
  ChipProps as MuiChipProps,
  alpha,
  useTheme,
} from '@mui/material';

interface ChipProps extends MuiChipProps {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  clickable?: boolean;
  deletable?: boolean;
  onDelete?: () => void;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'filled',
  color = 'default',
  size = 'medium',
  clickable = false,
  deletable = false,
  onDelete,
  avatar,
  icon,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getColorValue = () => {
    const colors = {
      primary: '#4285f4',
      secondary: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: '#8ab4f8',
      success: '#34a853',
      default: darkMode ? '#5f6368' : '#9aa0a6',
    };
    return colors[color];
  };

  const colorValue = getColorValue();

  const getStyles = () => {
    if (variant === 'filled') {
      return {
        backgroundColor: alpha(colorValue, 0.1),
        color: colorValue,
        '&:hover': {
          backgroundColor: alpha(colorValue, 0.2),
        },
        '& .MuiChip-deleteIcon': {
          color: colorValue,
          '&:hover': {
            color: alpha(colorValue, 0.8),
          },
        },
      };
    }

    // outlined variant
    return {
      backgroundColor: 'transparent',
      border: `1px solid ${alpha(colorValue, 0.5)}`,
      color: colorValue,
      '&:hover': {
        backgroundColor: alpha(colorValue, 0.08),
        borderColor: colorValue,
      },
      '& .MuiChip-deleteIcon': {
        color: alpha(colorValue, 0.7),
        '&:hover': {
          color: colorValue,
        },
      },
    };
  };

  return (
    <MuiChip
      variant={variant}
      size={size}
      clickable={clickable}
      onDelete={deletable ? onDelete : undefined}
      avatar={avatar}
      icon={icon}
      sx={{
        borderRadius: '16px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        ...getStyles(),
        ...sx,
      }}
      {...props}
    />
  );
};