// components/newUI/DPStrengthMeter.tsx
'use client';
import React from 'react';
import { useTheme } from '@mui/material';
import { useDP } from './theme';

interface Requirement { label: string; met: boolean; }

interface DPStrengthMeterProps {
  password: string;
}

function calcStrength(p: string): number {
  let s = 0;
  if (p.length >= 8)         s++;
  if (/[A-Z]/.test(p))       s++;
  if (/[a-z]/.test(p))       s++;
  if (/[0-9]/.test(p))       s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

export function DPStrengthMeter({ password }: DPStrengthMeterProps) {
  const { palette } = useTheme();
  const c = useDP(palette.mode === 'dark');

  if (!password) return null;

  const score = calcStrength(password);
  const pct   = (score / 5) * 100;

  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong';
  const color = score <= 1 ? c.error : score <= 3 ? c.gold : c.success;

  const reqs: Requirement[] = [
    { label: '8+ characters',        met: password.length >= 8 },
    { label: 'Uppercase (A–Z)',       met: /[A-Z]/.test(password) },
    { label: 'Lowercase (a–z)',       met: /[a-z]/.test(password) },
    { label: 'Number (0–9)',          met: /[0-9]/.test(password) },
    { label: 'Special (!@#…)',        met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div style={{ marginTop: 14 }}>
      {/* Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.72rem', color: c.inkSub }}>Strength</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color }}>{label}</span>
      </div>
      <div style={{ height: 5, borderRadius: 10, background: c.border, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          borderRadius: 10, transition: 'width 0.35s ease',
        }} />
      </div>

      {/* Requirements grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px' }}>
        {reqs.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 15, height: 15, borderRadius: '50%', flexShrink: 0,
              background: r.met ? c.success : c.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', color: '#fff',
              transition: 'background 0.2s',
            }}>
              {r.met ? '✓' : ''}
            </div>
            <span style={{
              fontSize: '0.72rem',
              color: r.met ? c.ink : c.inkMuted,
              transition: 'color 0.2s',
            }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}