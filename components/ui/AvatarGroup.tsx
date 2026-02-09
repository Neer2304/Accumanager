// components/ui/AvatarGroup.tsx
"use client";

import React from 'react';
import {
  AvatarGroup as MuiAvatarGroup,
  Avatar,
  Tooltip,
  Box,
  useTheme,
} from '@mui/material';

interface AvatarGroupProps {
  max?: number;
  children?: React.ReactNode;
  avatars?: Array<{
    name: string;
    src?: string;
    alt?: string;
  }>;
  size?: 'small' | 'medium' | 'large';
  spacing?: 'small' | 'medium' | 'large';
  total?: number;
  onClick?: () => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max = 3,
  children,
  avatars = [],
  size = 'medium',
  spacing = 'medium',
  total,
  onClick,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const sizeMap = {
    small: { width: 24, height: 24, fontSize: '0.75rem' },
    medium: { width: 32, height: 32, fontSize: '0.875rem' },
    large: { width: 40, height: 40, fontSize: '1rem' },
  };

  const spacingMap = {
    small: -8,
    medium: -12,
    large: -16,
  };

  // If children are provided, use them
  if (children) {
    return (
      <MuiAvatarGroup
        max={max}
        sx={{
          '& .MuiAvatar-root': {
            width: sizeMap[size].width,
            height: sizeMap[size].height,
            fontSize: sizeMap[size].fontSize,
            border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
            backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            color: darkMode ? '#e8eaed' : '#202124',
          },
          '& .MuiAvatarGroup-avatar': {
            width: sizeMap[size].width,
            height: sizeMap[size].height,
            fontSize: sizeMap[size].fontSize,
          },
        }}
        spacing={spacingMap[spacing]}
        onClick={onClick}
      >
        {children}
      </MuiAvatarGroup>
    );
  }

  // If avatars array is provided, create avatars from it
  const displayAvatars = total ? avatars.slice(0, max) : avatars;
  const extraCount = total ? total - max : avatars.length - max;

  return (
    <Box sx={{ display: 'flex' }}>
      {displayAvatars.map((avatar, index) => (
        <Tooltip key={index} title={avatar.name}>
          <Avatar
            src={avatar.src}
            alt={avatar.alt || avatar.name}
            sx={{
              width: sizeMap[size].width,
              height: sizeMap[size].height,
              fontSize: sizeMap[size].fontSize,
              marginLeft: index > 0 ? spacingMap[spacing] : 0,
              border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
              backgroundColor: avatar.src ? 'transparent' : (darkMode ? '#4285f4' : '#1a73e8'),
              color: '#ffffff',
              fontWeight: 500,
              cursor: onClick ? 'pointer' : 'default',
              '&:hover': onClick ? { opacity: 0.9 } : {},
            }}
          >
            {!avatar.src && getInitials(avatar.name)}
          </Avatar>
        </Tooltip>
      ))}
      {extraCount > 0 && (
        <Tooltip title={`+${extraCount} more`}>
          <Avatar
            sx={{
              width: sizeMap[size].width,
              height: sizeMap[size].height,
              fontSize: sizeMap[size].fontSize,
              marginLeft: displayAvatars.length > 0 ? spacingMap[spacing] : 0,
              border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
              backgroundColor: darkMode ? '#5f6368' : '#9aa0a6',
              color: '#ffffff',
              fontWeight: 500,
              cursor: onClick ? 'pointer' : 'default',
              '&:hover': onClick ? { opacity: 0.9 } : {},
            }}
          >
            +{extraCount}
          </Avatar>
        </Tooltip>
      )}
    </Box>
  );
};

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};