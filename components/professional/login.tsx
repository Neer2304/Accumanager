// app/pro-login/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProCard } from '@/components/newUiProfessional/ProCard';
import { ProInput } from '@/components/newUiProfessional/ProInput';
import { ProButton } from '@/components/newUiProfessional/ProButton';
import { ProDivider } from '@/components/newUiProfessional/ProDivider';
import { ProToast } from '@/components/newUiProfessional/ProToast';
import { usePro } from '@/components/newUiProfessional/theme';
import { useAuth } from '@/hooks/useAuth';
import GoogleAMLogo from '@/components/GoogleAMLogo';

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

export default function ProLoginPage() {
  const { palette } = useTheme();
  const dark = palette.mode === 'dark';
  const c = usePro(dark);
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    open: false, msg: '', type: 'info',
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

  const showToast = (msg: string, type: 'success' | 'error' | 'info') =>
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
    <div style={{
      minHeight: '100vh',
      background: c.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      
      {/* Main Container */}
      <div style={{
        width: '100%',
        maxWidth: 448,
        margin: '0 auto',
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* Logo */}
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 24px',
            background: c.primarySoft,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            <GoogleAMLogo/>
          </div>
          
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
            fontWeight: 500,
            color: c.ink,
            letterSpacing: '-0.02em',
          }}>
            Welcome back
          </h1>
          <p style={{
            margin: '8px 0 0',
            fontSize: 14,
            color: c.inkSub,
          }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <ProCard variant="elevated" padding="large">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Email Field */}
            <ProInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(val) => handleFieldChange('email', val)}
              placeholder="name@example.com"
              error={fieldErrors.email}
              autoFocus
              startIcon="📧"
            />

            {/* Password Field */}
            <ProInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={(val) => handleFieldChange('password', val)}
              placeholder="Enter your password"
              error={fieldErrors.password}
              startIcon="🔒"
            />

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: 14,
                  color: c.primary,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <ProButton
              type="submit"
              variant="primary"
              fullWidth
              size="large"
              loading={isLoading}
              disabled={!formData.email || !formData.password}
              onClick={handleSubmit}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </ProButton>
          </form>

          {/* Divider */}
          <ProDivider text="or continue with" spacing={24} />

          {/* Social Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <ProButton
              variant="secondary"
              fullWidth
              onClick={() => handleSocialLogin('google')}
              startIcon="G"
            >
              Google
            </ProButton>
            <ProButton
              variant="secondary"
              fullWidth
              onClick={() => handleSocialLogin('github')}
              startIcon="🐙"
            >
              GitHub
            </ProButton>
          </div>
        </ProCard>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 14, color: c.inkSub }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              style={{
                color: c.primary,
                textDecoration: 'none',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p style={{
          textAlign: 'center',
          fontSize: 12,
          color: c.inkMuted,
          marginTop: 24,
        }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: c.primary, textDecoration: 'none' }}>
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: c.primary, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Toast Notifications */}
      <ProToast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </div>
  );
}