// components/newUiBatman/BatmanDivider.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { useBatman } from './theme';

interface BatmanDividerProps {
  children?: React.ReactNode;
  variant?: 'line' | 'dashed' | 'bat';
}

export function BatmanDivider({ children, variant = 'line' }: BatmanDividerProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);

  const variants = {
    line: {
      borderBottom: `1px solid ${c.border}`,
    },
    dashed: {
      borderBottom: `2px dashed ${c.border}`,
    },
    bat: {
      borderBottom: `1px solid ${c.border}`,
      position: 'relative' as const,
    },
  };

  if (variant === 'bat') {
    return (
      <div style={{ position: 'relative', margin: '20px 0' }}>
        <div style={{ borderBottom: `1px solid ${c.border}` }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: c.surface,
          padding: '0 12px',
          color: c.gold,
          fontSize: 14,
        }}>
          🦇
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        margin: '20px 0',
      }}>
        <div style={{ flex: 1, ...variants.line }} />
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: c.inkMuted,
          textTransform: 'uppercase',
        }}>
          {children}
        </span>
        <div style={{ flex: 1, ...variants.line }} />
      </div>
    );
  }

  return <div style={{ margin: '20px 0', ...variants.line }} />;
}