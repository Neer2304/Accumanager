// components/newUiProfessional/ProToast.tsx
'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { usePro } from './theme';

interface ProToastProps {
  open: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function ProToast({ 
  open, 
  message, 
  type = 'info', 
  onClose, 
  duration = 4000 
}: ProToastProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  const colors = {
    success: { bg: c.success, icon: '✓' },
    error: { bg: c.error, icon: '✕' },
    info: { bg: c.primary, icon: 'ℹ' },
  };

  const { bg, icon } = colors[type];

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 20px',
      background: c.surface,
      borderRadius: 100,
      boxShadow: dark
        ? '0 4px 12px rgba(0,0,0,0.3)'
        : '0 4px 12px rgba(0,0,0,0.15)',
      border: `1px solid ${c.border}`,
      animation: 'pro-toast-slide 0.2s ease',
    }}>
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, color: c.ink }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          color: c.inkMuted,
          fontSize: 18,
          borderRadius: 20,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = c.primarySoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ×
      </button>
      
      <style>{`
        @keyframes pro-toast-slide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}