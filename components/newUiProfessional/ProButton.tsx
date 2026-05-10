// components/newUiProfessional/ProButton.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { usePro } from './theme';

interface ProButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export function ProButton({
  children,
  onClick,
  disabled,
  loading,
  fullWidth = false,
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  type = 'button',
}: ProButtonProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);
  const isDisabled = disabled || loading;

  const sizes = {
    small: { padding: '6px 16px', fontSize: 14, gap: 6 },
    medium: { padding: '10px 24px', fontSize: 14, gap: 8 },
    large: { padding: '12px 32px', fontSize: 16, gap: 8 },
  };

  const variants = {
    primary: {
      background: isDisabled ? c.inkMuted : c.primary,
      color: '#ffffff',
      border: 'none',
      boxShadow: 'none',
      '&:hover': !isDisabled && {
        background: c.primaryHov,
        boxShadow: dark 
          ? '0 1px 2px 0 rgba(0,0,0,0.3)'
          : '0 1px 2px 0 rgba(0,0,0,0.1)',
      },
    },
    secondary: {
      background: isDisabled ? c.surface2 : 'transparent',
      color: isDisabled ? c.inkMuted : c.primary,
      border: `1px solid ${isDisabled ? c.border : c.primary}`,
      boxShadow: 'none',
    },
    text: {
      background: 'transparent',
      color: isDisabled ? c.inkMuted : c.primary,
      border: 'none',
      boxShadow: 'none',
    },
    danger: {
      background: isDisabled ? c.inkMuted : c.error,
      color: '#ffffff',
      border: 'none',
      boxShadow: 'none',
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
        borderRadius: 100,
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        ...variants[variant],
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {loading && (
        <span style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `2px solid currentColor`,
          borderTopColor: 'transparent',
          animation: 'pro-spin 0.6s linear infinite',
          display: 'inline-block',
        }} />
      )}
      {startIcon && !loading && <span>{startIcon}</span>}
      {children}
      {endIcon && !loading && <span>{endIcon}</span>}
      
      <style>{`
        @keyframes pro-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}