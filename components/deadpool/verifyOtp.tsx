// app/dp-verify-otp/page.tsx (Deadpool Theme)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DPCard } from '@/components/newUI/DPCard';
import { DPButton } from '@/components/newUI/DPButton';
import { DPToast } from '@/components/newUI/DPToast';
import { useDP } from '@/components/newUI/theme';
import { Security, ArrowBack, Email, Phone, CheckCircle, Warning, Refresh } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';

export default function DpVerifyOTPPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useDP(darkMode);
  const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
    open: false, msg: '', type: 'success',
  });

  const verificationMethod = 'email';
  const target = verificationMethod === 'email' ? 'user@example.com' : '+91 98765 43210';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      // setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const showToast = (msg: string, type: 'success' | 'error') =>
    setToast({ open: true, msg, type });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('').slice(0, 6);
      setOtp(otpArray);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      const errorMsg = 'Please enter the complete 6-digit OTP';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        const successMsg = 'OTP verified successfully! Welcome to the Deadpool family! 🦸';
        setSuccess(successMsg);
        showToast(successMsg, 'success');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const errorMsg = 'Invalid OTP. Maximum effort required! Try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setCanResend(false);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
    
    inputRefs.current[0]?.focus();
    
    setTimeout(() => {
      showToast('New OTP sent! Check your inbox, chimi-f*cking-changa!', 'success');
    }, 1000);
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
        {/* Deadpool Decorative Blobs */}
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
          maxWidth: 480,
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
                Deadpool Says Verify!
              </h1>
            </div>
            <p style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: c.inkSub,
            }}>
              Enter the code or I&apos;ll break the fourth wall
            </p>
          </div>

          {/* Target Info Card */}
          <DPCard>
            <div style={{ padding: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  padding: 12,
                  borderRadius: 12,
                  background: c.redSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {verificationMethod === 'email' ? (
                    <Email style={{ fontSize: 24, color: c.red }} />
                  ) : (
                    <Phone style={{ fontSize: 24, color: c.red }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: c.inkMuted, textTransform: 'uppercase' }}>
                    SENT TO
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: c.ink }}>{target}</p>
                </div>
              </div>
            </div>
          </DPCard>

          <div style={{ marginTop: 24 }}>
            {/* Error/Success Alerts */}
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
                <Warning style={{ fontSize: 18 }} />
                <span>⚠️ {error}</span>
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
                <span>✓ {success}</span>
              </div>
            )}

            {/* OTP Inputs */}
            <p style={{
              margin: '0 0 20px 0',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: c.inkSub,
              textTransform: 'uppercase',
            }}>
              Enter 6-digit verification code
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? 8 : 12,
              marginBottom: 32,
            }}>
              {otp.map((digit, index) => (
                <div
                  key={index}
                  style={{
                    width: isMobile ? 44 : 52,
                    height: isMobile ? 44 : 52,
                  }}
                >
                  <input
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    style={{
                      width: '100%',
                      height: '100%',
                      textAlign: 'center',
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                      fontWeight: 700,
                      borderRadius: 12,
                      background: c.surface2,
                      border: `2px solid ${
                        error 
                          ? c.error
                          : digit 
                            ? c.red
                            : c.border
                      }`,
                      color: c.ink,
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.red;
                      e.target.style.boxShadow = `0 0 0 3px ${c.redGlow}`;
                    }}
                    onBlur={(e) => {
                      if (!error && !digit) {
                        e.target.style.borderColor = c.border;
                      }
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Timer/Resend */}
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 13, color: c.inkSub }}>
                {canResend ? "Didn't get the code?" : 'Resend code in'}
              </span>
              
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.redSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Refresh style={{ fontSize: 16 }} />
                  Resend OTP
                </button>
              ) : (
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: c.red,
                  fontFamily: 'monospace',
                }}>
                  00:{timer.toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Verify Button */}
            <DPButton
              type="button"
              fullWidth
              loading={isLoading}
              disabled={isLoading || otp.join('').length !== 6}
              onClick={handleVerify}
              // style={{ marginTop: 8 }}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </DPButton>
          </div>

          {/* Footer */}
          <div style={{
            paddingTop: 24,
            marginTop: 24,
            borderTop: `1px solid ${c.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
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
                padding: '6px 12px',
                borderRadius: 8,
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

            <span style={{ fontSize: 11, color: c.inkMuted }}>
              Having trouble?{' '}
              <span
                style={{
                  color: c.red,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Contact support
              </span>
            </span>
          </div>

          {/* Deadpool Quote */}
          <p style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 11,
            fontStyle: 'italic',
            color: c.inkMuted,
          }}>
            &quot;Maximum effort! Enter that code like you mean it!&quot; — Deadpool
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