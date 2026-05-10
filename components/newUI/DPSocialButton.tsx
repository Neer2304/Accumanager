// components/newUI/DPSocialButton.tsx
'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPSocialButtonProps {
  provider: 'google' | 'github';
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const providerConfig = {
  google: {
    icon: 'G',
    label: 'Google',
    gradient: 'linear-gradient(135deg, #4285f4, #34a853)',
    darkGradient: 'linear-gradient(135deg, #8ab4f8, #81c995)',
  },
  github: {
    icon: '🐙',
    label: 'GitHub',
    gradient: 'linear-gradient(135deg, #24292e, #1b1f23)',
    darkGradient: 'linear-gradient(135deg, #8ab4f8, #aecbfa)',
  },
};

export function DPSocialButton({
  provider,
  onClick,
  disabled = false,
  fullWidth = false,
}: DPSocialButtonProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useDP(dark);
  const config = providerConfig[provider];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: fullWidth ? '100%' : 'auto',
        padding: '11px 16px',
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: dark ? c.surface2 : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: c.ink,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.borderColor = c.borderHot;
          e.currentTarget.style.boxShadow = `0 4px 12px ${c.redGlow}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
      }}>
        {config.icon}
      </span>
      {config.label}
    </button>
  );
}