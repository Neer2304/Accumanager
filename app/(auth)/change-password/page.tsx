// app/change-password/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DPCard }          from '@/components/newUI/DPCard';
import { DPPasswordInput } from '@/components/newUI/DPPasswordInput';
import { DPStrengthMeter } from '@/components/newUI/DPStrengthMeter';
import { DPButton }        from '@/components/newUI/DPButton';
import { DPToast }         from '@/components/newUI/DPToast';
import { useDP }           from '@/components/newUI/theme';

// ── Validation ────────────────────────────────────────────────────────────────
function validate(cur: string, nw: string, con: string): string | null {
  if (!cur || !nw || !con) return 'Please fill in all fields';
  if (nw.length < 6)        return 'New password must be at least 6 characters';
  if (nw === cur)           return 'New password must differ from current password';
  if (nw !== con)           return 'Passwords do not match';
  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChangePasswordPage() {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c    = useDP(dark);
  const router = useRouter();

  const [cur,  setCur]  = useState('');
  const [nw,   setNw]   = useState('');
  const [con,  setCon]  = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
    open: false, msg: '', type: 'success',
  });

  const showToast = (msg: string, type: 'success' | 'error') =>
    setToast({ open: true, msg, type });

  const handleSubmit = useCallback(async () => {
    // Clear old errors
    setFieldErrors({});

    const err = validate(cur, nw, con);
    if (err) {
      // Map error to the relevant field
      if (err.includes('fill'))     setFieldErrors({ cur: ' ', nw: ' ', con: ' ' });
      else if (err.includes('differ')) setFieldErrors({ nw: err });
      else if (err.includes('match'))  setFieldErrors({ con: err });
      else if (err.includes('6'))      setFieldErrors({ nw: err });
      showToast(err, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Failed to change password';
        setFieldErrors({ cur: msg });
        showToast(msg, 'error');
        return;
      }

      showToast('Password changed successfully!', 'success');
      setCur(''); setNw(''); setCon('');
      setTimeout(() => router.push('/dashboard'), 2200);
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [cur, nw, con, router]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Spin keyframe for button loader */}
      <style>{`@keyframes dp-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{
        minHeight: '100vh',
        background: dark
          ? 'radial-gradient(ellipse at 20% 40%, #3b0000 0%, #0d0000 60%)'
          : 'radial-gradient(ellipse at 20% 40%, #ffe4e4 0%, #fff5f5 60%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: '"Google Sans", Roboto, sans-serif',
      }}>

        {/* Decorative blobs */}
        <div style={{
          position: 'fixed', top: '-15%', right: '-10%',
          width: 480, height: 480, borderRadius: '50%',
          background: dark ? 'radial-gradient(#7f1d1d60, transparent 70%)' : 'radial-gradient(#fca5a530, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed', bottom: '-20%', left: '-10%',
          width: 560, height: 560, borderRadius: '50%',
          background: dark ? 'radial-gradient(#3b000050, transparent 70%)' : 'radial-gradient(#fee2e240, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
          <DPCard>
            <div style={{ padding: '36px 32px 32px' }}>

              {/* Logo / icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: `linear-gradient(135deg, #7f1d1d, #dc2626)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${c.redGlow}`,
                  fontSize: 28,
                }}>
                  🔐
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 style={{
                  margin: '0 0 8px',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 800,
                  color: c.ink,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                }}>
                  Change Password
                </h1>
                <p style={{ margin: 0, fontSize: '0.875rem', color: c.inkSub, lineHeight: 1.6 }}>
                  Update your credentials to keep your account secure
                </p>
              </div>

              {/* ── Fields ──────────────────────────────────────────────── */}
              <DPPasswordInput
                label="Current Password"
                value={cur}
                onChange={v => { setCur(v); setFieldErrors(e => ({ ...e, cur: '' })); }}
                placeholder="Enter your current password"
                error={fieldErrors.cur?.trim() ? fieldErrors.cur : undefined}
              />

              <DPPasswordInput
                label="New Password"
                value={nw}
                onChange={v => { setNw(v); setFieldErrors(e => ({ ...e, nw: '' })); }}
                placeholder="Create a strong new password"
                error={fieldErrors.nw?.trim() ? fieldErrors.nw : undefined}
              />

              {/* Strength meter — only while typing new password */}
              <DPStrengthMeter password={nw} />

              <div style={{ height: nw ? 20 : 0, transition: 'height 0.2s' }} />

              <DPPasswordInput
                label="Confirm New Password"
                value={con}
                onChange={v => { setCon(v); setFieldErrors(e => ({ ...e, con: '' })); }}
                placeholder="Repeat your new password"
                error={
                  (fieldErrors.con?.trim() ? fieldErrors.con : undefined) ||
                  (con && nw !== con ? 'Passwords do not match' : undefined)
                }
              />

              {/* ── Submit ──────────────────────────────────────────────── */}
              <div style={{ marginTop: 8 }}>
                <DPButton
                  fullWidth
                  loading={loading}
                  disabled={!cur || !nw || !con}
                  onClick={handleSubmit}
                >
                  {loading ? 'Updating…' : 'Change Password'}
                </DPButton>
              </div>

              {/* ── Footer ──────────────────────────────────────────────── */}
              <div style={{
                marginTop: 28, paddingTop: 20,
                borderTop: `1px solid ${c.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap' as const, gap: 10,
              }}>
                <Link href="/dashboard" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.8rem', color: c.inkSub, textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = c.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = c.inkSub)}
                >
                  ← Back to Dashboard
                </Link>

                <Link href="/forgot-password" style={{
                  fontSize: '0.8rem', color: c.red, textDecoration: 'none', fontWeight: 600,
                }}>
                  Forgot password?
                </Link>
              </div>

              {/* Security note */}
              <p style={{
                margin: '16px 0 0', textAlign: 'center',
                fontSize: '0.72rem', color: c.inkMuted, lineHeight: 1.5,
              }}>
                🔒 Your password is encrypted and never stored in plain text
              </p>

            </div>
          </DPCard>
        </div>
      </div>

      <DPToast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </>
  );
}