// components/newUI/DPButton.tsx
'use client';
import React from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit';
}

export function DPButton({
  children, onClick, disabled, loading, fullWidth = false, variant = 'primary', type = 'button',
}: DPButtonProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');
  const isDisabled = disabled || loading;

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: fullWidth ? '100%' : undefined,
    padding: '13px 28px', borderRadius: 12, border: 'none',
    fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    textTransform: 'uppercase' as const,
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      ...base,
      background: isDisabled
        ? c.border
        : `linear-gradient(135deg, #7f1d1d, #dc2626)`,
      color: isDisabled ? c.inkMuted : '#fff',
      boxShadow: isDisabled ? 'none' : `0 4px 20px ${c.redGlow}`,
    },
    ghost: {
      ...base,
      background: 'transparent',
      color: c.inkSub,
      border: `1px solid ${c.border}`,
    },
  };

  return (
    <button type={type} onClick={onClick} disabled={isDisabled} style={styles[variant]}>
      {loading && (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `2px solid rgba(255,255,255,0.3)`,
          borderTopColor: '#fff',
          animation: 'dp-spin 0.7s linear infinite',
          display: 'inline-block', flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  );
}