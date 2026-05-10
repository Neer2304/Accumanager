// components/newUiBatman/BatmanCard.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { useBatman } from './theme';

interface BatmanCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gotham';
  className?: string;
  style?: React.CSSProperties;
}

export function BatmanCard({ children, variant = 'default', style }: BatmanCardProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);

  const variants = {
    default: {
      background: c.surface,
      border: `1px solid ${c.border}`,
      boxShadow: 'none',
    },
    elevated: {
      background: c.surface,
      border: `1px solid ${c.border}`,
      boxShadow: dark
        ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}`
        : `0 8px 32px rgba(0,0,0,0.08), 0 1px 0 ${c.border}`,
    },
    gotham: {
      background: dark ? '#080808' : '#f5f5f5',
      border: `2px solid ${c.gold}`,
      boxShadow: dark
        ? `0 0 20px ${c.goldGlow}, inset 0 1px 0 ${c.goldSoft}`
        : `0 0 15px ${c.goldGlow}`,
    },
  };

  return (
    <div style={{
      ...variants[variant],
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease',
      ...style,
    }}>
      {/* Bat symbol accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${c.gold}, transparent)`,
        width: '100%',
      }} />
      
      {/* Corner bat decorations */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        opacity: 0.3,
        fontSize: 12,
        pointerEvents: 'none',
      }}>
        🦇
      </div>
      
      {children}
    </div>
  );
}