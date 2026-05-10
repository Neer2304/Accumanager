// components/newUI/DPPasswordInput.tsx
'use client';
import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPPasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label: string;
  error?: string;
  autoFocus?: boolean;
}

export function DPPasswordInput({
  value, onChange, placeholder, label, error, autoFocus,
}: DPPasswordInputProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const borderColor = error ? c.error : focused ? c.borderHot : c.border;
  const glow = error
    ? 'rgba(220,38,38,0.18)'
    : focused ? c.redGlow : 'transparent';

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', marginBottom: 7,
        fontSize: '0.82rem', fontWeight: 600,
        color: error ? c.error : c.ink,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          autoFocus={autoFocus}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '13px 48px 13px 16px',
            background: c.surface2,
            border: `1.5px solid ${borderColor}`,
            borderRadius: 12,
            color: c.ink,
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused || error ? `0 0 0 3px ${glow}` : 'none',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: c.inkMuted, padding: 4, fontSize: 18, lineHeight: 1,
            display: 'flex', alignItems: 'center',
          }}
          title={show ? 'Hide' : 'Show'}
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: c.error }}>
          {error}
        </p>
      )}
    </div>
  );
}