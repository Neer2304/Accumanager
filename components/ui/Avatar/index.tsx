// components/ui/Avatar/index.tsx
"use client";

import React from 'react';
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Badge as MuiBadge,
  Box,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface AvatarProps extends Omit<MuiAvatarProps, 'size'> {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  badgeContent?: React.ReactNode;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  online?: boolean;
  borderColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  children,
  size = 'medium',
  badgeContent,
  badgeColor = 'default',
  online = false,
  borderColor,
  sx = {},
  ...props
}) => {
  const sizes = {
    small: { width: 32, height: 32, fontSize: '0.875rem' },
    medium: { width: 40, height: 40, fontSize: '1rem' },
    large: { width: 56, height: 56, fontSize: '1.25rem' },
    xlarge: { width: 80, height: 80, fontSize: '1.5rem' },
  };

  const badgeColors = {
    default: '#5f6368',
    primary: '#1a73e8',
    secondary: '#9334e6',
    error: '#d93025',
    info: '#1a73e8',
    success: '#0d652d',
    warning: '#e37400',
  };

  const avatar = (
    <MuiAvatar
      src={src}
      alt={alt}
      sx={{
        ...sizes[size],
        border: borderColor ? `2px solid ${borderColor}` : 'none',
        backgroundColor: borderColor ? alpha(borderColor, 0.1) : undefined,
        color: borderColor || undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAvatar>
  );

  if (badgeContent || online) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {avatar}
        {(badgeContent || online) && (
          <MuiBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={online ? (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#0d652d',
                  border: `2px solid ${badgeColors[badgeColor]}`,
                }}
              />
            ) : badgeContent}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: badgeColors[badgeColor],
                color: 'white',
                minWidth: 20,
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            }}
          />
        )}
      </Box>
    );
  }

  return avatar;
};