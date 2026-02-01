"use client";

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader, Box } from '@mui/material';

interface Card2Props extends MuiCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
  variant?: 'elevation' | 'outlined';
}

export const Card2: React.FC<Card2Props> = ({
  children,
  title,
  subtitle,
  action,
  noPadding = false,
  variant = 'elevation',
  sx = {},
  ...props
}) => {
  return (
    <MuiCard
      variant={variant}
      sx={{
        borderRadius: 3,
        ...sx,
      }}
      {...props}
    >
      {(title || action) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={action}
          sx={{
            borderBottom: subtitle ? 'none' : '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
      <CardContent sx={noPadding ? { p: 0 } : undefined}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export const CardContent2: React.FC<{ children: React.ReactNode; noPadding?: boolean }> = ({
  children,
  noPadding = false,
}) => (
  <Box sx={{ p: noPadding ? 0 : 3 }}>{children}</Box>
);

export const CardActions2: React.FC<{ children: React.ReactNode; align?: 'left' | 'center' | 'right' }> = ({
  children,
  align = 'right',
}) => (
  <Box
    sx={{
      p: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
      gap: 1,
    }}
  >
    {children}
  </Box>
);