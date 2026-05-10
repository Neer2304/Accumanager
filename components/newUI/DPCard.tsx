// components/newUI/DPCard.tsx
'use client';
import React from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DPCard({ children, style }: DPCardProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');

  return (
    <div style={{
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: palette.mode === 'dark'
        ? `0 0 0 1px ${c.border}, 0 24px 64px rgba(0,0,0,0.7), 0 0 80px ${c.redGlow}`
        : `0 8px 40px ${c.redGlow}, 0 1px 0 ${c.border}`,
      position: 'relative',
      ...style,
    }}>
      {/* Top accent bar — Deadpool red */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444, #dc2626, #7f1d1d)`,
        backgroundSize: '200% 100%',
      }} />
      {children}
    </div>
  );
}