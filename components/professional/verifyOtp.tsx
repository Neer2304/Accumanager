// app/pro-verify-otp/page.tsx (Professional Theme)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProCard } from '@/components/newUiProfessional/ProCard';
import { ProButton } from '@/components/newUiProfessional/ProButton';
import { ProToast } from '@/components/newUiProfessional/ProToast';
import { usePro } from '@/components/newUiProfessional/theme';
import { Security, ArrowBack, Email, Phone, CheckCircle, Warning, Refresh } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';

export default function ProVerifyOTPPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = usePro(darkMode);
  const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    open: false, msg: '', type: 'info',
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
    //   setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') =>
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
        const successMsg = 'OTP verified successfully!';
        setSuccess(successMsg);
        showToast(successMsg, 'success');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const errorMsg = 'Invalid OTP. Please try again.';
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
      showToast('New OTP sent successfully', 'success');
    }, 1000);
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
        maxWidth: 480,
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
              Verify Your Identity
            </h1>
          </div>
          <p style={{
            margin: '8px 0 0',
            fontSize: 14,
            color: c.inkSub,
          }}>
            Enter the verification code sent to your {verificationMethod}
          </p>
        </div>

        {/* Target Info Card */}
        <ProCard variant="elevated" padding="medium" style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              padding: 12,
              borderRadius: 12,
              background: c.primarySoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {verificationMethod === 'email' ? (
                <Email style={{ fontSize: 24, color: c.primary }} />
              ) : (
                <Phone style={{ fontSize: 24, color: c.primary }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, color: c.inkSub }}>Verification code sent to</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 500, color: c.ink }}>{target}</p>
            </div>
          </div>
        </ProCard>

        {/* Error/Success Alerts */}
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
            <Warning style={{ fontSize: 18 }} />
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

        {/* OTP Inputs Section */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            margin: '0 0 20px 0',
            textAlign: 'center',
            fontSize: 14,
            color: c.inkSub,
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
                    fontWeight: 600,
                    borderRadius: 12,
                    background: c.surface2,
                    border: `2px solid ${
                      error 
                        ? c.error
                        : digit 
                          ? c.primary
                          : c.border
                    }`,
                    color: c.ink,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${c.primarySoft}`;
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

          {/* Timer/Resend Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 13, color: c.inkSub }}>
              {canResend ? "Didn't receive the code?" : 'Resend code in'}
            </span>
            
            {canResend ? (
              <button
                onClick={handleResendOTP}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: c.primary,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = c.primarySoft;
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
                fontWeight: 600,
                color: c.primary,
                fontFamily: 'monospace',
              }}>
                00:{timer.toString().padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Verify Button */}
          <ProButton
            type="button"
            variant="primary"
            fullWidth
            size="large"
            loading={isLoading}
            disabled={isLoading || otp.join('').length !== 6}
            onClick={handleVerify}
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </ProButton>
        </div>

        {/* Footer Links */}
        <div style={{
          paddingTop: 24,
          marginTop: 16,
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
              padding: '6px 12px',
              borderRadius: 8,
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

          <span style={{ fontSize: 11, color: c.inkMuted }}>
            Having trouble?{' '}
            <span
              style={{
                color: c.primary,
                cursor: 'pointer',
                fontWeight: 500,
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