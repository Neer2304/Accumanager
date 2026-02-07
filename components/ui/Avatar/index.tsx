// components/ui/Avatar/index.tsx
"use client";

import React from 'react';
import { 
  Avatar as MuiAvatar, 
  AvatarProps as MuiAvatarProps,
  alpha,
  useTheme,
} from '@mui/material';
import { Box } from 'lucide-react';

interface AvatarProps extends MuiAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  variant?: 'circular' | 'rounded' | 'square';
  border?: boolean;
  borderColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  status,
  variant = 'circular',
  border = false,
  borderColor,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const sizes = {
    xs: { width: 24, height: 24, fontSize: '0.75rem' },
    sm: { width: 32, height: 32, fontSize: '0.875rem' },
    md: { width: 40, height: 40, fontSize: '1rem' },
    lg: { width: 56, height: 56, fontSize: '1.25rem' },
    xl: { width: 80, height: 80, fontSize: '1.5rem' },
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#34a853';
      case 'offline': return '#9aa0a6';
      case 'away': return '#fbbc04';
      case 'busy': return '#ea4335';
      default: return 'transparent';
    }
  };

  const statusSize = {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14,
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <MuiAvatar
        variant={variant}
        sx={{
          ...sizes[size],
          backgroundColor: darkMode ? '#4285f4' : '#e3f2fd',
          color: darkMode ? '#e8eaed' : '#1a73e8',
          fontWeight: 500,
          border: border ? `2px solid ${borderColor || (darkMode ? '#303134' : '#ffffff')}` : 'none',
          boxShadow: border ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
          ...sx,
        }}
        {...props}
      />
      {status && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusSize[size],
            height: statusSize[size],
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            border: `2px solid ${darkMode ? '#303134' : '#ffffff'}`,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};