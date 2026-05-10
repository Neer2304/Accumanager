// app/login/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DPCard } from '@/components/newUI/DPCard';
import { DPButton } from '@/components/newUI/DPButton';
import { DPToast } from '@/components/newUI/DPToast';
import { DPInput } from '@/components/newUI/DPInput';
import { DPSocialButton } from '@/components/newUI/DPSocialButton';
import { useDP } from '@/components/newUI/theme';
import { useAuth } from '@/hooks/useAuth';

// ── Types ────────────────────────────────────────────────────────────────
interface LoginFormData {
  email: string;
  password: string;
}

// ── Validation ────────────────────────────────────────────────────────────
function validateForm(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
}

// ── Main Component ───────────────────────────────────────────────────────
export default function LoginPage() {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useDP(dark);
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
    open: false, msg: '', type: 'success',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show auth error in toast
  useEffect(() => {
    if (authError) {
      showToast(authError, 'error');
      clearError();
    }
  }, [authError, clearError]);

  const showToast = (msg: string, type: 'success' | 'error') =>
    setToast({ open: true, msg, type });

  const handleFieldChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = useCallback(async () => {
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast(Object.values(errors)[0], 'error');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      // Success - redirect happens via useEffect
    } catch (err) {
      // Error is handled by auth context
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }, [formData, login]);

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const urls = {
      google: '/google-login',
      github: '/github-login',
    };
    router.push(urls[provider]);
  };

  const isLoading = loading || authLoading;

  return (
    <>
      {/* Global keyframes for animations */}
      <style>{`
        @keyframes dp-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: dark
          ? 'radial-gradient(ellipse at 20% 40%, #3b0000 0%, #0d0000 60%)'
          : 'radial-gradient(ellipse at 20% 40%, #ffe4e4 0%, #fff5f5 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: '"Google Sans", "Roboto", system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Decorative background blobs */}
        <div style={{
          position: 'fixed',
          top: '-15%',
          right: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: dark 
            ? 'radial-gradient(#7f1d1d60, transparent 70%)' 
            : 'radial-gradient(#fca5a530, transparent 70%)',
          pointerEvents: 'none',
          animation: 'dp-fade-in 1s ease-out',
        }} />
        
        <div style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: dark 
            ? 'radial-gradient(#3b000050, transparent 70%)' 
            : 'radial-gradient(#fee2e240, transparent 70%)',
          pointerEvents: 'none',
          animation: 'dp-fade-in 1.2s ease-out',
        }} />

        {/* Main Content Container */}
        <div style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
          animation: 'dp-slide-up 0.5s ease-out',
        }}>
          
          {/* Brand/Logo Section Above Card */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: `linear-gradient(135deg, #7f1d1d, #dc2626)`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${c.redGlow}`,
              fontSize: 32,
              marginBottom: 16,
            }}>
              🎯
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              color: c.ink,
              letterSpacing: '-0.02em',
            }}>
              AccuManage
            </h2>
            <p style={{
              margin: '4px 0 0',
              fontSize: '0.8rem',
              color: c.inkSub,
            }}>
              Business Management Platform
            </p>
          </div>

          {/* Login Card */}
          <DPCard>
            <div style={{ padding: '32px 28px' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
                  fontWeight: 800,
                  color: c.ink,
                  letterSpacing: '-0.03em',
                }}>
                  Welcome Back
                </h1>
                <p style={{
                  margin: '8px 0 0',
                  fontSize: '0.85rem',
                  color: c.inkSub,
                }}>
                  Sign in to your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                {/* Email Field */}
                <DPInput
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(val) => handleFieldChange('email', val)}
                  placeholder="admin@example.com"
                  error={fieldErrors.email}
                  autoFocus
                  leftIcon="📧"
                />

                {/* Password Field */}
                <DPInput
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={(val) => handleFieldChange('password', val)}
                  placeholder="Enter your password"
                  error={fieldErrors.password}
                  leftIcon="🔒"
                />

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: c.red,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <DPButton
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  disabled={!formData.email || !formData.password}
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </DPButton>
              </form>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '24px 0',
              }}>
                <div style={{ flex: 1, height: 1, background: c.border }} />
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: c.inkMuted,
                  letterSpacing: '0.5px',
                }}>
                  OR CONTINUE WITH
                </span>
                <div style={{ flex: 1, height: 1, background: c.border }} />
              </div>

              {/* Social Login Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <DPSocialButton
                  provider="google"
                  onClick={() => handleSocialLogin('google')}
                  fullWidth
                />
                <DPSocialButton
                  provider="github"
                  onClick={() => handleSocialLogin('github')}
                  fullWidth
                />
              </div>

              {/* Sign Up Link */}
              <div style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: `1px solid ${c.border}`,
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '0.8rem', color: c.inkSub }}>
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    style={{
                      fontWeight: 700,
                      color: c.red,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Start Free Trial
                  </Link>
                </span>
              </div>

              {/* Security Note */}
              <div style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}>
                {[
                  { icon: '🔐', label: '256-bit SSL' },
                  { icon: '🛡️', label: 'Secure Login' },
                  { icon: '📊', label: 'Encrypted' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}>
                    <span style={{ fontSize: '0.7rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.65rem', color: c.inkMuted }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </DPCard>
        </div>
      </div>

      {/* Toast Notifications */}
      <DPToast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </>
  );
}