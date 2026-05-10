// components/newUI/DPToast.tsx
'use client';
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPToastProps {
  open: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function DPToast({ open, message, type, onClose }: DPToastProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  const color  = type === 'success' ? c.success : c.error;
  const icon   = type === 'success' ? '✓' : '✕';
//   const bg     = type === 'success' ? 'rgba(74,222,128,0.08)' : c.redSoft;
  const border = type === 'success' ? 'rgba(74,222,128,0.3)' : c.borderHot;

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 20px 12px 14px',
      background: c.surface, border: `1px solid ${border}`,
      borderRadius: 100,
      boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${border}`,
      animation: 'dp-slide-up 0.25s ease',
      whiteSpace: 'nowrap' as const,
      minWidth: 220,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 900,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: c.ink }}>
        {message}
      </span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: c.inkMuted, fontSize: 16, padding: 2, marginLeft: 4, lineHeight: 1,
      }}>×</button>
      <style>{`
        @keyframes dp-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}