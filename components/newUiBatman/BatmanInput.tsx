// components/newUiBatman/BatmanInput.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import { useBatman } from './theme';

interface BatmanInputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  icon?: string;
  required?: boolean;
}

export function BatmanInput({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  autoFocus = false,
  disabled = false,
  icon,
  required = false,
}: BatmanInputProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderColor = error ? c.error : focused ? c.borderHot : c.border;
  const glow = error
    ? 'rgba(255,68,68,0.2)'
    : focused ? c.goldGlow : 'transparent';

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block',
        marginBottom: 8,
        fontSize: '0.7rem',
        fontWeight: 700,
        color: error ? c.error : c.ink,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: '"Roboto Condensed", monospace',
      }}>
        {label}
        {required && <span style={{ color: c.gold, marginLeft: 4 }}>✦</span>}
      </label>
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            opacity: 0.5,
            pointerEvents: 'none',
          }}>
            {icon}
          </span>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          disabled={disabled}
          style={{
            width: '100%',
            padding: `13px ${isPassword ? 48 : 16}px 13px ${icon ? 44 : 16}px`,
            background: disabled ? c.gray : c.surface2,
            border: `2px solid ${borderColor}`,
            borderRadius: 12,
            color: disabled ? c.inkMuted : c.ink,
            fontSize: '0.9rem',
            fontWeight: 500,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
            boxShadow: focused || error ? `0 0 0 4px ${glow}` : 'none',
            fontFamily: '"Roboto", sans-serif',
          }}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.inkMuted,
              padding: 6,
              fontSize: '1rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
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
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      
      {error && (
        <p style={{
          margin: '8px 0 0',
          fontSize: '0.7rem',
          color: c.error,
          fontFamily: '"Roboto", sans-serif',
          letterSpacing: '0.3px',
        }}>
          ⚡ {error}
        </p>
      )}
    </div>
  );
}