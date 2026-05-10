// app/batman-login/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BatmanCard } from '@/components/newUiBatman/BatmanCard';
import { BatmanButton } from '@/components/newUiBatman/BatmanButton';
import { BatmanInput } from '@/components/newUiBatman/BatmanInput';
import { BatmanToast } from '@/components/newUiBatman/BatmanToast';
import { BatmanDivider } from '@/components/newUiBatman/BatmanDivider';
import { useBatman } from '@/components/newUiBatman/theme';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

function validateForm(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
}

export default function BatmanLoginPage() {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = useBatman(dark);
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'warning' }>({
    open: false, msg: '', type: 'success',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (authError) {
      showToast(authError, 'error');
      clearError();
    }
  }, [authError, clearError]);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') =>
    setToast({ open: true, msg, type });

  const handleFieldChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = useCallback(async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast(Object.values(errors)[0], 'error');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
    } catch (err) {
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
      <style>{`
        @keyframes bat-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bat-glide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bat-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes bat-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: dark
          ? 'radial-gradient(ellipse at 30% 40%, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)'
          : 'radial-gradient(ellipse at 30% 40%, #e0e0e0 0%, #d0d0d0 60%, #c0c0c0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: '"Roboto Condensed", "Google Sans", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Gotham City Skyline Silhouette */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: dark
            ? 'linear-gradient(transparent, rgba(0,0,0,0.8)), repeating-linear-gradient(90deg, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 2px, #1a1a1a 4px)'
            : 'linear-gradient(transparent, rgba(0,0,0,0.1)), repeating-linear-gradient(90deg, #999 0px, #999 2px, #aaa 2px, #aaa 4px)',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />
        
        {/* Bat Signal Effect */}
        <div style={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.goldSoft} 0%, transparent 70%)`,
          opacity: 0.4,
          animation: 'bat-pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        
        <div style={{
          position: 'fixed',
          bottom: '15%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.goldSoft} 0%, transparent 70%)`,
          opacity: 0.2,
          animation: 'bat-pulse 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Main Content */}
        <div style={{
          width: '100%',
          maxWidth: 460,
          position: 'relative',
          zIndex: 1,
          animation: 'bat-glide 0.6s ease-out',
        }}>
          
          {/* Batman Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 90,
              height: 90,
              margin: '0 auto 16px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${c.gold}, ${c.goldHov})`,
                borderRadius: '50%',
                opacity: 0.15,
                transform: 'scale(1.3)',
              }} />
              <div style={{
                width: '100%',
                height: '100%',
                background: dark ? '#0a0a0a' : '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${c.gold}`,
                boxShadow: `0 0 20px ${c.goldGlow}`,
                fontSize: 48,
              }}>
                🦇
              </div>
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.6rem, 5vw, 2rem)',
              fontWeight: 900,
              color: c.ink,
              letterSpacing: '-0.02em',
              fontFamily: '"Roboto Condensed", sans-serif',
              textTransform: 'uppercase',
            }}>
              DARK KNIGHT
            </h1>
            <p style={{
              margin: '8px 0 0',
              fontSize: '0.8rem',
              color: c.gold,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Enterprise Command Center
            </p>
          </div>

          {/* Login Card */}
          <BatmanCard variant="elevated">
            <div style={{ padding: '32px 28px' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: c.ink,
                  letterSpacing: '-0.02em',
                }}>
                  Access Protocol
                </h2>
                <p style={{
                  margin: '6px 0 0',
                  fontSize: '0.8rem',
                  color: c.inkSub,
                }}>
                  Authorized personnel only
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <BatmanInput
                  type="email"
                  label="Gotham ID"
                  value={formData.email}
                  onChange={(val) => handleFieldChange('email', val)}
                  placeholder="wayne@batman.com"
                  error={fieldErrors.email}
                  icon="📧"
                  autoFocus
                  required
                />

                <BatmanInput
                  type="password"
                  label="Security Key"
                  value={formData.password}
                  onChange={(val) => handleFieldChange('password', val)}
                  placeholder="••••••••"
                  error={fieldErrors.password}
                  icon="🔒"
                  required
                />

                {/* Forgot Password */}
                <div style={{ textAlign: 'right', marginBottom: 28 }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: c.gold,
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textShadow = `0 0 4px ${c.goldGlow}`)}
                    onMouseLeave={(e) => (e.currentTarget.style.textShadow = 'none')}
                  >
                    🔑 Forgot Access Key?
                  </Link>
                </div>

                {/* Submit Button */}
                <BatmanButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="large"
                  loading={isLoading}
                  disabled={!formData.email || !formData.password}
                  onClick={handleSubmit}
                  icon="⚡"
                >
                  {isLoading ? 'Authenticating...' : 'Enter the Cave'}
                </BatmanButton>
              </form>

              <BatmanDivider variant="bat" />

              {/* Social Login */}
              <div style={{ display: 'flex', gap: 12 }}>
                <BatmanButton
                  variant="outline"
                  fullWidth
                  onClick={() => handleSocialLogin('google')}
                  icon="G"
                  size="medium"
                >
                  Google
                </BatmanButton>
                <BatmanButton
                  variant="outline"
                  fullWidth
                  onClick={() => handleSocialLogin('github')}
                  icon="🐙"
                  size="medium"
                >
                  GitHub
                </BatmanButton>
              </div>

              {/* Sign Up */}
              <div style={{ marginTop: 28, textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: c.inkSub }}>
                  New to the Bat-team?{' '}
                  <Link
                    href="/register"
                    style={{
                      fontWeight: 700,
                      color: c.gold,
                      textDecoration: 'none',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textShadow = `0 0 4px ${c.goldGlow}`)}
                    onMouseLeave={(e) => (e.currentTarget.style.textShadow = 'none')}
                  >
                    Join the Mission →
                  </Link>
                </span>
              </div>

              {/* Security Badges */}
              <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${c.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}>
                {[
                  { icon: '🛡️', label: 'WayneSecure' },
                  { icon: '🔐', label: '256-bit' },
                  { icon: '🦇', label: 'Bat-Encrypted' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: c.goldSoft,
                  }}>
                    <span style={{ fontSize: '0.7rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: c.gold }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                margin: '20px 0 0',
                textAlign: 'center',
                fontSize: '0.7rem',
                fontStyle: 'italic',
                color: c.inkMuted,
              }}>
                &quot;I am vengeance. I am the night. I am Batman!&quot; — Bruce Wayne
              </p>

            </div>
          </BatmanCard>
        </div>
      </div>

      <BatmanToast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </>
  );
}