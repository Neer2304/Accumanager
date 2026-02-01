"use client";

import React from 'react';
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';

interface Badge2Props extends MuiBadgeProps {
  count?: number;
  maxCount?: number;
  variant?: 'standard' | 'dot';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const Badge2: React.FC<Badge2Props> = ({
  children,
  count = 0,
  maxCount = 99,
  variant = 'standard',
  color = 'primary',
  sx = {},
  ...props
}) => {
  return (
    <MuiBadge
      badgeContent={count > maxCount ? `${maxCount}+` : count}
      variant={variant}
      color={color as any}
      sx={{
        '& .MuiBadge-badge': {
          borderRadius: 12,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBadge>
  );
};