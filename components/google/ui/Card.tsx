// components/ui/Card/index.tsx
"use client";

import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps, 
  CardContent,
  CardHeader,
  CardActions as MuiCardActions,
  alpha,
  useTheme,
} from '@mui/material';

interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  noPadding = false,
  variant = 'elevation',
  elevation = 0,
  hover = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MuiCard
      variant={variant}
      elevation={elevation}
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: variant === 'outlined' ? `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` : 'none',
        overflow: 'hidden',
        transition: hover ? 'all 0.3s ease' : 'none',
        '&:hover': hover ? {
          transform: 'translateY(-2px)',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        } : {},
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
            py: 2,
            px: 3,
            borderBottom: subtitle ? 'none' : `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            '& .MuiCardHeader-title': {
              fontSize: '1.125rem',
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.875rem',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        />
      )}
      <CardContent sx={{ 
        p: noPadding ? 0 : 3,
        '&:last-child': {
          pb: noPadding ? 0 : 3,
        },
      }}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export const CardContent2: React.FC<{ 
  children: React.ReactNode; 
  noPadding?: boolean;
}> = ({
  children,
  noPadding = false,
}) => (
  <CardContent sx={{ 
    p: noPadding ? 0 : 3,
    '&:last-child': {
      pb: noPadding ? 0 : 3,
    },
  }}>
    {children}
  </CardContent>
);

export const CardActions: React.FC<{ 
  children: React.ReactNode; 
  align?: 'left' | 'center' | 'right';
  noPadding?: boolean;
}> = ({
  children,
  align = 'right',
  noPadding = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MuiCardActions
      sx={{
        p: noPadding ? 0 : 2,
        pt: noPadding ? 0 : 1.5,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        display: 'flex',
        justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
        gap: 1,
      }}
    >
      {children}
    </MuiCardActions>
  );
};