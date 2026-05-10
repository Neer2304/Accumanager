// app/pro-forgot-password/page.tsx (Professional Theme)
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProCard } from '@/components/newUiProfessional/ProCard';
import { ProButton } from '@/components/newUiProfessional/ProButton';
import { ProInput } from '@/components/newUiProfessional/ProInput';
import { ProToast } from '@/components/newUiProfessional/ProToast';
import { usePro } from '@/components/newUiProfessional/theme';
import { ArrowBack, Email, Security, CheckCircle, Lock } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import { OTPInput } from '@/components/user-auth/OTPInput';
import { PasswordStrengthIndicator } from '@/components/user-auth/PasswordStrengthIndicator';

const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

export default function ProForgotPasswordPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = usePro(darkMode);
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    open: false, msg: '', type: 'info',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend && activeStep === 1) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      // setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend, activeStep]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') =>
    setToast({ open: true, msg, type });

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setActiveStep(1);
      setSuccess(`Verification code sent to ${email}`);
      showToast(`Verification code sent to ${email}`, 'success');
      setTimer(60);
      setCanResend(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      showToast('Please enter the complete 6-digit OTP', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        setActiveStep(2);
        setSuccess('OTP verified successfully!');
        showToast('OTP verified successfully!', 'success');
      } else {
        setError('Invalid OTP. Please try again.');
        showToast('Invalid OTP. Please try again.', 'error');
      }
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields');
      showToast('Please fill in both password fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Password reset successfully! Redirecting to login...');
      showToast('Password reset successfully!', 'success');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }, 1500);
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    setTimeout(() => {
      setSuccess(`New verification code sent to ${email}`);
      showToast(`New verification code sent to ${email}`, 'success');
    }, 500);
  };

  const handleStepBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setError('');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Enter your registered email address and we&apos;ll send you a verification code.
            </p>

            <ProInput
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
              error={error}
              startIcon={<Email />}
              required
            />

            <ProButton
              type="button"
              variant="primary"
              fullWidth
              size="large"
              loading={isLoading}
              disabled={isLoading || !email}
              onClick={handleSendOTP}
              // style={{ marginTop: 8 }}
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </ProButton>
          </div>
        );

      case 1:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Enter the verification code sent to{' '}
              <span style={{ fontWeight: 600, color: c.primary }}>{email}</span>
            </p>

            <OTPInput
              otp={otp}
              setOtp={setOtp}
              error={error}
            />

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.primary,
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '8px 16px',
                    borderRadius: 20,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.primarySoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Resend Code
                </button>
              ) : (
                <span style={{ fontSize: 14, color: c.inkSub }}>
                  Resend code in{' '}
                  <span style={{ fontWeight: 600, color: c.primary }}>
                    00:{timer.toString().padStart(2, '0')}
                  </span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <ProButton
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleStepBack}
              >
                Back
              </ProButton>
              <ProButton
                type="button"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || otp.join('').length !== 6}
                onClick={handleVerifyOTP}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </ProButton>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Create a new strong password for your account.
            </p>

            <ProInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Create a strong password"
              error={error && activeStep === 2 ? error : ''}
              startIcon={<Lock />}
              required
            />

            <PasswordStrengthIndicator password={newPassword} />

            <ProInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your new password"
              error={error && activeStep === 2 ? error : ''}
              startIcon={<Lock />}
              required
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <ProButton
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleStepBack}
              >
                Back
              </ProButton>
              <ProButton
                type="button"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || !newPassword || !confirmPassword}
                onClick={handleResetPassword}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </ProButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: c.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: darkMode
          ? 'radial-gradient(circle at 20% 50%, #0d306420 0%, transparent 50%), radial-gradient(circle at 80% 20%, #202124 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, #e3f2fd 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f8f9fa 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 520,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <GoogleAMLogo size={56} darkMode={darkMode} />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 12,
          }}>
            <div style={{
              padding: 12,
              borderRadius: 12,
              background: c.primarySoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Security style={{ fontSize: 28, color: c.primary }} />
            </div>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: 500,
              color: c.ink,
            }}>
              Reset Password
            </h1>
          </div>
          <p style={{
            margin: '8px 0 0',
            fontSize: 14,
            color: c.inkSub,
          }}>
            Follow the steps to reset your password
          </p>
        </div>

        {/* Stepper */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}>
            {steps.map((label, index) => (
              <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: activeStep >= index ? c.primary : c.border,
                  color: activeStep >= index ? '#fff' : c.inkMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  {activeStep > index ? <CheckCircle style={{ fontSize: 18 }} /> : index + 1}
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: activeStep === index ? 600 : 400,
                  color: activeStep >= index ? c.ink : c.inkMuted,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            position: 'relative',
            top: -54,
            height: 2,
            background: c.border,
            margin: '0 40px',
            zIndex: -1,
          }}>
            <div style={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
              height: 2,
              background: c.primary,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: c.errorSoft,
            border: `1px solid ${c.error}`,
            color: c.error,
            marginBottom: 20,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: `${c.success}15`,
            border: `1px solid ${c.success}`,
            color: c.success,
            marginBottom: 20,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <CheckCircle style={{ fontSize: 18 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Step Content */}
        <ProCard variant="elevated" padding="large">
          {renderStepContent(activeStep)}
        </ProCard>

        {/* Back to Login */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: c.inkSub,
              textDecoration: 'none',
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 20,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = c.primary;
              e.currentTarget.style.background = c.primarySoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = c.inkSub;
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowBack style={{ fontSize: 16 }} />
            Back to Login
          </Link>
        </div>
      </div>

      <ProToast
        open={toast.open}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </div>
  );
}