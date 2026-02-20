// components/ui/Badge/index.tsx
"use client";

import React from 'react';
import { 
  Badge as MuiBadge, 
  BadgeProps as MuiBadgeProps,
  alpha,
  useTheme,
} from '@mui/material';

interface BadgeProps extends MuiBadgeProps {
  count?: number;
  maxCount?: number;
  variant?: 'standard' | 'dot';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  showZero?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  count = 0,
  maxCount = 99,
  variant = 'standard',
  color = 'primary',
  showZero = false,
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
    };
    return colors[color];
  };

  const colorValue = getColorValue();

  if (!showZero && count === 0 && variant === 'standard') {
    return <>{children}</>;
  }

  return (
    <MuiBadge
      badgeContent={variant === 'standard' ? (count > maxCount ? `${maxCount}+` : count) : undefined}
      variant={variant}
      color={color as any}
      invisible={!showZero && count === 0}
      sx={{
        '& .MuiBadge-badge': {
          borderRadius: variant === 'dot' ? '50%' : '12px',
          minWidth: variant === 'dot' ? 8 : 20,
          height: variant === 'dot' ? 8 : 20,
          fontSize: '0.7rem',
          fontWeight: 600,
          backgroundColor: colorValue,
          color: darkMode ? '#202124' : '#ffffff',
          border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
          ...(variant === 'dot' && {
            width: 8,
            height: 8,
          }),
          ...(count === 0 && {
            backgroundColor: darkMode ? '#5f6368' : '#9aa0a6',
          }),
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBadge>
  );
};