// components/newUiProfessional/ProDivider.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { usePro } from './theme';

interface ProDividerProps {
  text?: string;
  spacing?: number;
}

export function ProDivider({ text, spacing = 24 }: ProDividerProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);

  if (text) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        margin: `${spacing}px 0`,
      }}>
        <div style={{ flex: 1, height: 1, background: c.border }} />
        <span style={{
          fontSize: 12,
          color: c.inkMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {text}
        </span>
        <div style={{ flex: 1, height: 1, background: c.border }} />
      </div>
    );
  }

  return <div style={{ height: 1, background: c.border, margin: `${spacing}px 0` }} />;
}