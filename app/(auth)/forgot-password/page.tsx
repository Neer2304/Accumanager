// app/batman-forgot-password/page.tsx (Batman Theme)
'use client';

import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BatmanCard } from '@/components/newUiBatman/BatmanCard';
import { BatmanButton } from '@/components/newUiBatman/BatmanButton';
import { BatmanInput } from '@/components/newUiBatman/BatmanInput';
import { BatmanToast } from '@/components/newUiBatman/BatmanToast';
import { BatmanDivider } from '@/components/newUiBatman/BatmanDivider';
import { useBatman } from '@/components/newUiBatman/theme';
import { ArrowBack, Security, CheckCircle } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import { OTPInput } from '@/components/user-auth/OTPInput';
import { PasswordStrengthIndicator } from '@/components/user-auth/PasswordStrengthIndicator';

const steps = ['Verify Identity', 'Access Code', 'New Credentials'];

export default function BatmanForgotPasswordPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useBatman(darkMode);
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
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'warning' }>({
    open: false, msg: '', type: 'success',
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

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') =>
    setToast({ open: true, msg, type });

  const handleSendOTP = async () => {
    if (!email) {
      setError('Identity verification required. Enter your registered email.');
      showToast('Enter your registered email', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setActiveStep(1);
      setSuccess(`Secure code transmitted to ${email}. Check your secure channel.`);
      showToast(`Code sent to ${email}`, 'success');
      setTimer(60);
      setCanResend(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Invalid access code format. Must be 6 digits.');
      showToast('Invalid access code format', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        setActiveStep(2);
        setSuccess('Identity verified. You may now create new credentials.');
        showToast('Identity verified successfully', 'success');
      } else {
        setError('Access denied. Invalid verification code.');
        showToast('Access denied. Invalid code.', 'error');
      }
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Both credential fields are required.');
      showToast('Both password fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Credential mismatch. Please ensure both entries match.');
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      setError('Weak credential detected. Minimum 6 characters required.');
      showToast('Password too weak', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Credentials updated successfully. Redirecting to secure login.');
      showToast('Password reset successful!', 'success');
      
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
      setSuccess(`New access code transmitted to ${email}`);
      showToast(`New code sent to ${email}`, 'success');
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
              Enter your registered identity to initiate recovery protocol.
            </p>

            <BatmanInput
              label="Registered Identity"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="wayne@batman.com"
              error={error}
              icon="📧"
              required
            />

            <BatmanButton
              type="button"
              variant="primary"
              fullWidth
              size="large"
              loading={isLoading}
              disabled={isLoading || !email}
              onClick={handleSendOTP}
              icon="🦇"
              // style={{ marginTop: 8 }}
            >
              {isLoading ? 'Initiating Protocol...' : 'Request Access Code'}
            </BatmanButton>
          </div>
        );

      case 1:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Enter the 6-digit access code sent to{' '}
              <span style={{ fontWeight: 700, color: c.gold }}>{email}</span>
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
                    color: c.gold,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: 20,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.goldSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Request New Code
                </button>
              ) : (
                <span style={{ fontSize: 13, color: c.inkSub }}>
                  New code available in{' '}
                  <span style={{ fontWeight: 700, color: c.gold }}>
                    00:{timer.toString().padStart(2, '0')}
                  </span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <BatmanButton variant="secondary" fullWidth onClick={handleStepBack}>
                Return
              </BatmanButton>
              <BatmanButton
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || otp.join('').length !== 6}
                onClick={handleVerifyOTP}
                icon="✓"
              >
                {isLoading ? 'Verifying...' : 'Verify Identity'}
              </BatmanButton>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Create new secure credentials for your account.
            </p>

            <BatmanInput
              label="New Credential"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Create a strong password"
              error={error}
              icon="🔒"
              required
            />

            <PasswordStrengthIndicator password={newPassword} />

            <BatmanInput
              label="Confirm Credential"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your new password"
              error={error}
              icon="🔒"
              required
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <BatmanButton variant="secondary" fullWidth onClick={handleStepBack}>
                Return
              </BatmanButton>
              <BatmanButton
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || !newPassword || !confirmPassword}
                onClick={handleResetPassword}
                icon="🦇"
              >
                {isLoading ? 'Updating...' : 'Update Credentials'}
              </BatmanButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes bat-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bat-glide { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bat-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: darkMode
          ? 'radial-gradient(ellipse at 30% 40%, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)'
          : 'radial-gradient(ellipse at 30% 40%, #e0e0e0 0%, #d0d0d0 60%, #c0c0c0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gotham Skyline */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: darkMode
            ? 'linear-gradient(transparent, rgba(0,0,0,0.8)), repeating-linear-gradient(90deg, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 2px, #1a1a1a 4px)'
            : 'linear-gradient(transparent, rgba(0,0,0,0.1)), repeating-linear-gradient(90deg, #999 0px, #999 2px, #aaa 2px, #aaa 4px)',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />
        
        {/* Bat Signal */}
        <div style={{
          position: 'fixed',
          top: '15%',
          right: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c.goldSoft} 0%, transparent 70%)`,
          opacity: 0.3,
          animation: 'bat-pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 520,
          position: 'relative',
          zIndex: 1,
          animation: 'bat-glide 0.6s ease-out',
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
                background: c.goldSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Security style={{ fontSize: 28, color: c.gold }} />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: isMobile ? '1.5rem' : '1.75rem',
                fontWeight: 800,
                color: c.ink,
                letterSpacing: '-0.02em',
                fontFamily: '"Roboto Condensed", sans-serif',
              }}>
                Recovery Protocol
              </h1>
            </div>
            <p style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: c.inkSub,
            }}>
              Initiate secure credential recovery
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
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: activeStep >= index ? c.gold : c.border,
                    color: activeStep >= index ? (darkMode ? '#0a0a0a' : '#fff') : c.inkMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: 14,
                    fontWeight: 700,
                  }}>
                    {activeStep > index ? <CheckCircle style={{ fontSize: 18 }} /> : index + 1}
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: activeStep === index ? 700 : 400,
                    color: activeStep >= index ? c.ink : c.inkMuted,
                    letterSpacing: '0.05em',
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: `${c.error}15`,
              borderLeft: `4px solid ${c.error}`,
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
              borderLeft: `4px solid ${c.success}`,
              color: c.success,
              marginBottom: 20,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <CheckCircle style={{ fontSize: 18 }} />
              <span>✓ {success}</span>
            </div>
          )}

          {/* Step Content */}
          <BatmanCard variant="elevated">
            <div style={{ padding: '28px 24px' }}>
              {renderStepContent(activeStep)}
            </div>
          </BatmanCard>

          <BatmanDivider variant="bat" />

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
                fontSize: 13,
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: 20,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = c.gold;
                e.currentTarget.style.background = c.goldSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = c.inkSub;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <ArrowBack style={{ fontSize: 16 }} />
              Return to Login
            </Link>
          </div>

          {/* Batman Quote */}
          <p style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 10,
            fontStyle: 'italic',
            color: c.inkMuted,
          }}>
            &quot;I&apos;m Batman. And even I forget my passwords sometimes. Let&apos;s fix that.&quot; — Batman
          </p>
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