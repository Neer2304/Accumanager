// app/dp-forgot-password/page.tsx (Deadpool Theme)
'use client';

import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DPCard } from '@/components/newUI/DPCard';
import { DPButton } from '@/components/newUI/DPButton';
import { DPToast } from '@/components/newUI/DPToast';
import { DPPasswordInput } from '@/components/newUI/DPPasswordInput';
import { DPStrengthMeter } from '@/components/newUI/DPStrengthMeter';
import { useDP } from '@/components/newUI/theme';
import { ArrowBack, Security, CheckCircle } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import { OTPInput } from '@/components/user-auth/OTPInput';

const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

export default function DpForgotPasswordPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useDP(darkMode);
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
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
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

  const showToast = (msg: string, type: 'success' | 'error') =>
    setToast({ open: true, msg, type });

  const handleSendOTP = async () => {
    if (!email) {
      setError('Hey! You forgot to enter your email! Maximum effort!');
      showToast('Hey! You forgot to enter your email! Maximum effort!', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setActiveStep(1);
      setSuccess(`Boom! Code sent to ${email}. Check your inbox, chimi-f*cking-changa!`);
      showToast(`Code sent to ${email}`, 'success');
      setTimer(60);
      setCanResend(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('6 digits, genius! Enter the complete code!');
      showToast('6 digits, genius! Enter the complete code!', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        setActiveStep(2);
        setSuccess('Nailed it! Now let\'s get you a new password! 🦸');
        showToast('OTP verified! Time for a new password!', 'success');
      } else {
        setError('Wrong code, bub! Try again with maximum effort!');
        showToast('Wrong code! Try again!', 'error');
      }
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required! No half-measures!');
      showToast('Both password fields are required!', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords don\'t match! Are you even trying?');
      showToast('Passwords don\'t match!', 'error');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password too weak! Make it at least 6 characters, champ!');
      showToast('Password too weak! Make it stronger!', 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Password reset successful! You\'re welcome! Redirecting...');
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
      setSuccess(`Fresh code sent to ${email}. Don't mess it up!`);
      showToast(`Fresh code sent to ${email}`, 'success');
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
              Enter your email and I&apos;ll send you a magic code. Don&apos;t screw it up.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: c.ink, marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: c.surface2,
                  border: `1px solid ${error ? c.error : c.border}`,
                  borderRadius: 12,
                  color: c.ink,
                  fontSize: 14,
                }}
              />
            </div>

            <DPButton
              type="button"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !email}
              onClick={handleSendOTP}
            >
              {isLoading ? 'Sending...' : 'Send Me The Code!'}
            </DPButton>
          </div>
        );

      case 1:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Enter the 6-digit code sent to{' '}
              <span style={{ fontWeight: 700, color: c.red }}>{email}</span>
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
                    color: c.red,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: 20,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.redSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Resend Code
                </button>
              ) : (
                <span style={{ fontSize: 13, color: c.inkSub }}>
                  Resend code in{' '}
                  <span style={{ fontWeight: 700, color: c.red }}>
                    00:{timer.toString().padStart(2, '0')}
                  </span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <DPButton variant="ghost" fullWidth onClick={handleStepBack}>
                Back
              </DPButton>
              <DPButton
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || otp.join('').length !== 6}
                onClick={handleVerifyOTP}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </DPButton>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <p style={{ fontSize: 14, color: c.inkSub, marginBottom: 24, textAlign: 'center' }}>
              Create a new password. Make it strong. Make it count.
            </p>

            <DPPasswordInput
              label="NEW PASSWORD *"
              value={newPassword}
              onChange={setNewPassword}
              error={error}
            />

            <DPStrengthMeter password={newPassword} />

            <DPPasswordInput
              label="CONFIRM PASSWORD *"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={error}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <DPButton variant="ghost" fullWidth onClick={handleStepBack}>
                Back
              </DPButton>
              <DPButton
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading || !newPassword || !confirmPassword}
                onClick={handleResetPassword}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </DPButton>
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
        @keyframes dp-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
        {/* Deadpool Blobs */}
        <div style={{
          position: 'fixed',
          top: '-15%',
          right: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(#dc262620, transparent 70%)' : 'radial-gradient(#dc262610, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(#7f1d1d20, transparent 70%)' : 'radial-gradient(#fecaca20, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 520,
          position: 'relative',
          zIndex: 1,
          animation: 'dp-slide-up 0.5s ease-out',
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
                background: c.redSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Security style={{ fontSize: 28, color: c.red }} />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: isMobile ? '1.5rem' : '1.75rem',
                fontWeight: 800,
                color: c.ink,
                letterSpacing: '-0.02em',
              }}>
                Forgot Password?
              </h1>
            </div>
            <p style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: c.inkSub,
            }}>
              Don&apos;t worry, it happens to the best of us!
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
                    background: activeStep >= index ? c.red : c.border,
                    color: activeStep >= index ? '#fff' : c.inkMuted,
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
              background: c.redSoft,
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
          <DPCard>
            <div style={{ padding: '28px 24px' }}>
              {renderStepContent(activeStep)}
            </div>
          </DPCard>

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
                e.currentTarget.style.color = c.red;
                e.currentTarget.style.background = c.redSoft;
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

          {/* Deadpool Quote */}
          <p style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 11,
            fontStyle: 'italic',
            color: c.inkMuted,
          }}>
            &quot;With great power comes great... wait, wrong franchise. Just reset your password!&quot; — Deadpool
          </p>
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