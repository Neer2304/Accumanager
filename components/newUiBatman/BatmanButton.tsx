// components/newUiBatman/BatmanButton.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { useBatman } from './theme';

interface BatmanButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export function BatmanButton({
  children,
  onClick,
  disabled,
  loading,
  fullWidth = false,
  variant = 'primary',
  size = 'medium',
  icon,
  type = 'button',
}: BatmanButtonProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);
  const isDisabled = disabled || loading;

  const sizes = {
    small: { padding: '8px 16px', fontSize: '0.75rem', gap: 6 },
    medium: { padding: '12px 24px', fontSize: '0.875rem', gap: 8 },
    large: { padding: '16px 32px', fontSize: '1rem', gap: 10 },
  };

  const variants = {
    primary: {
      background: isDisabled ? c.gray : `linear-gradient(135deg, ${c.gold}, ${c.goldHov})`,
      color: dark ? '#0a0a0a' : '#ffffff',
      border: 'none',
      boxShadow: isDisabled ? 'none' : `0 4px 15px ${c.goldGlow}`,
    },
    secondary: {
      background: isDisabled ? c.gray : dark ? '#1a1a1a' : '#e8e8e8',
      color: isDisabled ? c.inkMuted : c.gold,
      border: `1px solid ${c.gold}`,
      boxShadow: 'none',
    },
    outline: {
      background: 'transparent',
      color: isDisabled ? c.inkMuted : c.gold,
      border: `2px solid ${isDisabled ? c.gray : c.gold}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: isDisabled ? c.inkMuted : c.ink,
      border: 'none',
      boxShadow: 'none',
    },
    danger: {
      background: isDisabled ? c.gray : `linear-gradient(135deg, #ff4444, #cc0000)`,
      color: '#ffffff',
      border: 'none',
      boxShadow: isDisabled ? 'none' : `0 4px 15px rgba(255,68,68,0.3)`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizes[size].gap,
        width: fullWidth ? '100%' : 'auto',
        padding: sizes[size].padding,
        borderRadius: 40,
        fontWeight: 700,
        letterSpacing: '0.03em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        fontFamily: '"Roboto Condensed", "Google Sans", sans-serif',
        ...variants[variant],
        ...(variant === 'ghost' && {
          '&:hover': !isDisabled && {
            background: c.goldSoft,
            color: c.gold,
          },
        }),
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant !== 'ghost') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = `0 6px 20px ${c.goldGlow}`;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = `0 4px 15px ${c.goldGlow}`;
          }
        }
      }}
    >
      {loading && (
        <span style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `2px solid currentColor`,
          borderTopColor: 'transparent',
          animation: 'bat-spin 0.6s linear infinite',
          display: 'inline-block',
        }} />
      )}
      {icon && !loading && <span style={{ fontSize: sizes[size].fontSize }}>{icon}</span>}
      {children}
    </button>
  );
}