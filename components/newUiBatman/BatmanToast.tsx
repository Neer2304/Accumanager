// components/newUiBatman/BatmanToast.tsx
'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useBatman } from './theme';

interface BatmanToastProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}

export function BatmanToast({ open, message, type, onClose, duration = 4000 }: BatmanToastProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  const config = {
    success: { icon: '✓', color: c.success, borderColor: c.success },
    error: { icon: '✗', color: c.error, borderColor: c.error },
    warning: { icon: '⚠', color: c.warning, borderColor: c.warning },
  };

  const { icon, color } = config[type];

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 20px 12px 16px',
      background: c.surface,
      borderLeft: `4px solid ${color}`,
      borderRadius: 12,
      boxShadow: dark
        ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}`
        : `0 8px 32px rgba(0,0,0,0.1)`,
      animation: 'bat-toast-slide 0.3s ease',
      minWidth: 240,
      maxWidth: '90vw',
    }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 900,
        color: dark ? '#0a0a0a' : '#ffffff',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        color: c.ink,
        flex: 1,
      }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.inkMuted,
          fontSize: 18,
          padding: 4,
          marginLeft: 8,
          lineHeight: 1,
          borderRadius: 6,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = c.gold;
          e.currentTarget.style.background = c.goldSoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = c.inkMuted;
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ×
      </button>
      
      <style>{`
        @keyframes bat-toast-slide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes bat-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}