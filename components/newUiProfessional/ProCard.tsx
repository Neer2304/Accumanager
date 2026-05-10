// components/newUiProfessional/ProCard.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { usePro } from './theme';

interface ProCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export function ProCard({ 
  children, 
  variant = 'default', 
  padding = 'medium',
  style 
}: ProCardProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);

  const variants = {
    default: {
      background: c.surface,
      border: `1px solid ${c.border}`,
      boxShadow: 'none',
    },
    elevated: {
      background: c.surface,
      border: 'none',
      boxShadow: dark
        ? '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)'
        : '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px 0 rgba(0,0,0,0.1)',
    },
    outlined: {
      background: 'transparent',
      border: `1px solid ${c.border}`,
      boxShadow: 'none',
    },
  };

  const paddings = {
    none: { padding: 0 },
    small: { padding: 12 },
    medium: { padding: 24 },
    large: { padding: 32 },
  };

  return (
    <div style={{
      borderRadius: 28,
      transition: 'box-shadow 0.2s, background 0.2s',
      ...variants[variant],
      ...paddings[padding],
      ...style,
    }}>
      {children}
    </div>
  );
}