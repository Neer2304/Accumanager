// app/batman-verify-otp/page.tsx (Batman Theme)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BatmanCard } from '@/components/newUiBatman/BatmanCard';
import { BatmanButton } from '@/components/newUiBatman/BatmanButton';
import { BatmanToast } from '@/components/newUiBatman/BatmanToast';
import { BatmanDivider } from '@/components/newUiBatman/BatmanDivider';
import { useBatman } from '@/components/newUiBatman/theme';
import { Security, ArrowBack, Email, Phone, CheckCircle, Warning, Refresh } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';

export default function BatmanVerifyOTPPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useBatman(darkMode);
  const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'warning' }>({
    open: false, msg: '', type: 'success',
  });

  const verificationMethod = 'email';
  const target = verificationMethod === 'email' ? 'wayne@batman.com' : '+1 555 0123';

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

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') =>
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
      const errorMsg = 'Please enter the complete 6-digit access code';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpString === '123456') {
        const successMsg = 'Access granted. Welcome to the Batcave. 🦇';
        setSuccess(successMsg);
        showToast(successMsg, 'success');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const errorMsg = 'Invalid access code. Authorization denied.';
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
      showToast('New access code transmitted securely', 'success');
    }, 1000);
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
          maxWidth: 480,
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
                Identity Verification
              </h1>
            </div>
            <p style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: c.inkSub,
            }}>
              Enter your secure access code
            </p>
          </div>

          {/* Target Info Card */}
          <BatmanCard variant="elevated">
            <div style={{ padding: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  padding: 12,
                  borderRadius: 12,
                  background: c.goldSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {verificationMethod === 'email' ? (
                    <Email style={{ fontSize: 24, color: c.gold }} />
                  ) : (
                    <Phone style={{ fontSize: 24, color: c.gold }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: c.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    TRANSMITTED TO
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: c.ink }}>{target}</p>
                </div>
              </div>
            </div>
          </BatmanCard>

          <div style={{ marginTop: 24 }}>
            {/* Error/Success Alerts */}
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
                <Warning style={{ fontSize: 18 }} />
                <span>⚠️ {error}</span>
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

            {/* OTP Inputs */}
            <p style={{
              margin: '0 0 20px 0',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: c.inkSub,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Enter 6-digit access code
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
                            ? c.gold
                            : c.border
                      }`,
                      color: c.ink,
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.gold;
                      e.target.style.boxShadow = `0 0 0 3px ${c.goldGlow}`;
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
                {canResend ? "Code not received?" : 'Resend code in'}
              </span>
              
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.goldSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Refresh style={{ fontSize: 16 }} />
                  Resend Code
                </button>
              ) : (
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: c.gold,
                  fontFamily: 'monospace',
                }}>
                  00:{timer.toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Verify Button */}
            <BatmanButton
              type="button"
              variant="primary"
              fullWidth
              size="large"
              loading={isLoading}
              disabled={isLoading || otp.join('').length !== 6}
              onClick={handleVerify}
              icon="🦇"
            >
              {isLoading ? 'Verifying Access...' : 'Verify & Enter'}
            </BatmanButton>
          </div>

          <BatmanDivider variant="bat" />

          {/* Footer */}
          <div style={{
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

            <span style={{ fontSize: 11, color: c.inkMuted }}>
              Need assistance?{' '}
              <span
                style={{
                  color: c.gold,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Contact Oracle
              </span>
            </span>
          </div>

          {/* Batman Quote */}
          <p style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 10,
            fontStyle: 'italic',
            color: c.inkMuted,
          }}>
            &quot;The night is darkest just before the dawn. And I promise you, the dawn is coming.&quot; — Batman
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