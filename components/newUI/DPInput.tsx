// components/newUI/DPInput.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface DPInputProps {
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
}

export function DPInput({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  autoFocus = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconClick,
}: DPInputProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderColor = error ? c.error : focused ? c.borderHot : c.border;
  const glow = error
    ? 'rgba(220,38,38,0.18)'
    : focused ? c.redGlow : 'transparent';

  const handleRightIconClick = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onRightIconClick) {
      onRightIconClick();
    }
  };

  const rightIconContent = isPassword
    ? (showPassword ? '🙈' : '👁️')
    : rightIcon;

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block',
        marginBottom: 8,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: error ? c.error : c.ink,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            opacity: 0.6,
            pointerEvents: 'none',
          }}>
            {leftIcon}
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
            padding: `13px ${rightIconContent ? 48 : 16}px 13px ${leftIcon ? 44 : 16}px`,
            background: disabled ? c.border : c.surface2,
            border: `1.5px solid ${borderColor}`,
            borderRadius: 12,
            color: disabled ? c.inkMuted : c.ink,
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused || error ? `0 0 0 3px ${glow}` : 'none',
          }}
        />
        
        {rightIconContent && (
          <button
            type="button"
            onClick={handleRightIconClick}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.inkMuted,
              padding: 4,
              fontSize: '1rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.redSoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {rightIconContent}
          </button>
        )}
      </div>
      
      {error && (
        <p style={{
          margin: '6px 0 0',
          fontSize: '0.7rem',
          color: c.error,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}