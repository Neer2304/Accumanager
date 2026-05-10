// components/newUiProfessional/ProInput.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import { usePro } from './theme';

interface ProInputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

export function ProInput({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  autoFocus = false,
  disabled = false,
  required = false,
  startIcon,
  endIcon,
  onEndIconClick,
}: ProInputProps) {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const isError = !!error;
  const borderColor = isError 
    ? c.error 
    : focused 
      ? c.borderHot 
      : c.border;
  
  const backgroundColor = disabled 
    ? c.surface2 
    : c.surface;

  const handleEndIconClick = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onEndIconClick) {
      onEndIconClick();
    }
  };

  const endIconContent = isPassword
    ? (showPassword ? '🙈' : '👁️')
    : endIcon;

  return (
    <div style={{ marginBottom: 20, width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 500,
          color: c.inkSub,
        }}>
          {label}
          {required && <span style={{ color: c.error, marginLeft: 4 }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        {startIcon && (
          <div style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.inkMuted,
          }}>
            {startIcon}
          </div>
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
            padding: `12px ${endIconContent ? 48 : 16}px 12px ${startIcon ? 48 : 16}px`,
            background: backgroundColor,
            border: `1px solid ${borderColor}`,
            borderRadius: 24,
            color: disabled ? c.inkMuted : c.ink,
            fontSize: 16,
            lineHeight: 1.5,
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        />
        
        {endIconContent && (
          <button
            type="button"
            onClick={handleEndIconClick}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.inkMuted,
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
            {typeof endIconContent === 'string' ? (
              <span style={{ fontSize: 20 }}>{endIconContent}</span>
            ) : (
              endIconContent
            )}
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <p style={{
          margin: '6px 16px 0',
          fontSize: 12,
          color: isError ? c.error : c.inkMuted,
        }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}