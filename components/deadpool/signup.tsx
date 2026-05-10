/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dp-register/page.tsx (Deadpool Theme - Using DP Components)
'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DPCard } from '@/components/newUI/DPCard';
import { DPButton } from '@/components/newUI/DPButton';
import { DPToast } from '@/components/newUI/DPToast';
import { DPPasswordInput } from '@/components/newUI/DPPasswordInput';
import { DPStrengthMeter } from '@/components/newUI/DPStrengthMeter';
import { useDP } from '@/components/newUI/theme';
import { useAuth } from '@/hooks/useAuth';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PersonAdd, Email, Lock, CheckCircle, Business, LocationOn,
  Work, Interests, Language, Cake, ExpandMore, ExpandLess, Info,
  WorkspacePremium, Security, Speed, CloudSync, BusinessCenter, TrendingUp,
} from '@mui/icons-material';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessSize: z.string().optional(),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age").optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  interests: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  marketingConsent: z.boolean().optional(),
  dataSharingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const businessTypes = [
  'Technology', 'Retail', 'Healthcare', 'Finance', 'Education',
  'Manufacturing', 'Construction', 'Real Estate', 'Transportation',
  'Hospitality', 'Media', 'Consulting', 'Agency', 'E-commerce', 'Other',
];

const businessSizes = [
  'Just me (1 employee)', 'Micro (2-9 employees)', 'Small (10-49 employees)',
  'Medium (50-249 employees)', 'Large (250+ employees)',
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese',
  'Japanese', 'Korean', 'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Other',
];

const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00',
];

const occupations = [
  'Software Developer', 'Business Owner', 'Marketing Professional', 'Sales Professional',
  'Consultant', 'Manager', 'Executive', 'Freelancer', 'Student', 'Educator',
  'Healthcare Professional', 'Other',
];

const features = [
  { icon: <Speed />, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
  { icon: <WorkspacePremium />, title: 'Premium Features', description: 'All premium features included' },
  { icon: <CloudSync />, title: 'Cloud Sync', description: 'Real-time data synchronization' },
  { icon: <BusinessCenter />, title: 'Business Tools', description: 'Complete business management suite' },
  { icon: <TrendingUp />, title: 'Analytics', description: 'Advanced reporting and insights' },
  { icon: <Security />, title: 'Bank-Level Security', description: 'Enterprise-grade encryption' },
];

export default function DpRegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useDP(darkMode);
  
  const { register: registerUser, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [ageValue, setAgeValue] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
    open: false, msg: '', type: 'success',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      age: 30,
      gender: 'prefer-not-to-say',
      marketingConsent: false,
      dataSharingConsent: false,
    },
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

  const showToast = (msg: string, type: 'success' | 'error') =>
    setToast({ open: true, msg, type });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    clearError();
    const { confirmPassword, ...userData } = data;
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== '' && v !== undefined)
    );
    try {
      await registerUser(filteredData);
      showToast('Account created! Welcome to the Deadpool family! 🦸', 'success');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => router.push('/login');
  const handleGoogleRedirect = () => router.push("/google-register");
  const handleGithubRedirect = () => router.push("/github-register");

  const handleAgeChange = (value: number) => {
    setAgeValue(value);
    setValue('age', value);
  };

  const isLoading = loading || authLoading;

  return (
    <>
      <style>{`
        @keyframes dp-spin { to { transform: rotate(360deg); } }
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
        
        {/* Decorative Deadpool Blobs */}
        <div style={{
          position: 'fixed',
          top: '-15%',
          right: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(#dc262620, transparent 70%)' : 'radial-gradient(#dc262610, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(#7f1d1d20, transparent 70%)' : 'radial-gradient(#fecaca20, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 1200,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 32 : 48,
          alignItems: 'flex-start',
          animation: 'dp-slide-up 0.5s ease-out',
        }}>
          
          {/* Left Side - Brand Section */}
          {!isMobile && (
            <div style={{ flex: 1, maxWidth: 500, position: 'sticky', top: 24 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 100,
                background: `linear-gradient(135deg, ${c.red}, ${c.redHov})`,
                marginBottom: 24,
                boxShadow: `0 4px 12px ${c.redGlow}`,
              }}>
                <WorkspacePremium style={{ fontSize: 18, color: '#fff' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>14-Day Free Trial • No Credit Card Required</span>
              </div>

              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: c.ink,
                marginBottom: 16,
                lineHeight: 1.2,
              }}>
                Start Your Journey with <span style={{ color: c.red }}>AccuManage</span>
              </h1>
              
              <p style={{ fontSize: '1rem', color: c.inkSub, marginBottom: 32, lineHeight: 1.6 }}>
                Get started with AccuManage and transform your business operations.
                No credit card required for the 14-day free trial.
              </p>

              {/* Features Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                marginBottom: 32,
              }}>
                {features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${c.border}`,
                  }}>
                    <div style={{ color: c.red }}>{feature.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{feature.title}</div>
                      <div style={{ fontSize: 11, color: c.inkSub }}>{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', gap: 12 }}>
                {['🔐 256-bit SSL', '✓ GDPR Compliant', '⭐ 4.9/5 Rating', '🏆 Award Winning'].map((badge, i) => (
                  <div key={i} style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    fontSize: 12,
                    color: c.inkSub,
                  }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side - Registration Form */}
          <div style={{ flex: 1, maxWidth: 520, width: '100%', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <GoogleAMLogo size={64} darkMode={darkMode} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: c.ink, letterSpacing: '-0.03em' }}>
                Deadpool Says Join!
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: 14, color: c.inkSub }}>
                Maximum effort. Minimum hassle. Start free trial.
              </p>
              {isMobile && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: `${c.redSoft}`,
                }}>
                  <WorkspacePremium style={{ fontSize: 14, color: c.red }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.red }}>No credit card required</span>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {authError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 12,
                background: `${c.redSoft}`,
                border: `1px solid ${c.error}`,
                color: c.error,
                marginBottom: 20,
                fontSize: 13,
              }}>
                ⚠️ {authError}
              </div>
            )}

            {/* Registration Form Card */}
            <DPCard>
              <div style={{ padding: '32px 28px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Required Fields */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: c.ink, marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>
                      FULL NAME *
                    </label>
                    <input
                      {...register('name')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: c.surface2,
                        border: `1px solid ${errors.name ? c.error : c.border}`,
                        borderRadius: 12,
                        color: c.ink,
                        fontSize: 14,
                      }}
                      placeholder="John Doe"
                    />
                    {errors.name && <p style={{ fontSize: 11, color: c.error, marginTop: 4 }}>{errors.name.message}</p>}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: c.ink, marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: c.surface2,
                        border: `1px solid ${errors.email ? c.error : c.border}`,
                        borderRadius: 12,
                        color: c.ink,
                        fontSize: 14,
                      }}
                      placeholder="name@example.com"
                    />
                    {errors.email && <p style={{ fontSize: 11, color: c.error, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>

                  <DPPasswordInput
                    label="PASSWORD *"
                    value={watch('password') || ''}
                    onChange={(v) => setValue('password', v)}
                    error={errors.password?.message}
                  />
                  
                  <DPStrengthMeter password={watch('password') || ''} />
                  
                  <DPPasswordInput
                    label="CONFIRM PASSWORD *"
                    value={watch('confirmPassword') || ''}
                    onChange={(v) => setValue('confirmPassword', v)}
                    error={errors.confirmPassword?.message}
                  />

                  {/* Terms */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" {...register('terms')} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: c.red }} />
                      <span style={{ fontSize: 12, color: c.inkSub }}>
                        I agree to the <Link href="/terms" style={{ color: c.red, textDecoration: 'none' }}>Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" style={{ color: c.red, textDecoration: 'none' }}>Privacy Policy</Link>
                      </span>
                    </label>
                    {errors.terms && <p style={{ fontSize: 11, color: c.error, marginTop: 4 }}>{errors.terms.message}</p>}
                  </div>

                  {/* Optional Fields Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      borderTop: `1px solid ${c.border}`,
                      padding: '16px 0',
                      cursor: 'pointer',
                      color: c.red,
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {showOptionalFields ? 'HIDE OPTIONAL INFORMATION' : 'ADD OPTIONAL INFORMATION (BUSINESS & DEMOGRAPHICS)'}
                    {showOptionalFields ? <ExpandLess /> : <ExpandMore />}
                  </button>

                  {/* Optional Fields */}
                  {showOptionalFields && (
                    <div style={{ marginTop: 16 }}>
                      <h4 style={{ color: c.ink, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Business Information</h4>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>BUSINESS NAME</label>
                        <input
                          {...register('businessName')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: c.surface2,
                            border: `1px solid ${c.border}`,
                            borderRadius: 10,
                            color: c.ink,
                            fontSize: 14,
                          }}
                          placeholder="Your Business Name"
                        />
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>BUSINESS TYPE</label>
                        <select
                          {...register('businessType')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: c.surface2,
                            color: c.ink,
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Business Type</option>
                          {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>BUSINESS SIZE</label>
                        <select
                          {...register('businessSize')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: c.surface2,
                            color: c.ink,
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Business Size</option>
                          {businessSizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div style={{ height: 1, background: c.border, margin: '20px 0' }} />
                      
                      <h4 style={{ color: c.ink, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Demographic Information</h4>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>AGE: {ageValue} years</label>
                        <input
                          type="range"
                          min={18}
                          max={100}
                          value={ageValue}
                          onChange={(e) => handleAgeChange(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: c.red }}
                        />
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>GENDER</label>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {['male', 'female', 'other', 'prefer-not-to-say'].map(g => (
                            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.ink }}>
                              <input type="radio" {...register('gender')} value={g} /> {g}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>LOCATION</label>
                        <input
                          {...register('location')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: c.surface2,
                            border: `1px solid ${c.border}`,
                            borderRadius: 10,
                            color: c.ink,
                            fontSize: 14,
                          }}
                          placeholder="City, Country"
                        />
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>OCCUPATION</label>
                        <select
                          {...register('occupation')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: c.surface2,
                            color: c.ink,
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Occupation</option>
                          {occupations.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>INTERESTS</label>
                        <input
                          {...register('interests')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: c.surface2,
                            border: `1px solid ${c.border}`,
                            borderRadius: 10,
                            color: c.ink,
                            fontSize: 14,
                          }}
                          placeholder="Technology, Marketing, Design"
                        />
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>LANGUAGE</label>
                        <select
                          {...register('language')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: c.surface2,
                            color: c.ink,
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Language</option>
                          {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 6, display: 'block' }}>TIMEZONE</label>
                        <select
                          {...register('timezone')}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: c.surface2,
                            color: c.ink,
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Timezone</option>
                          {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                      </div>

                      <div style={{ height: 1, background: c.border, margin: '20px 0' }} />
                      
                      <h4 style={{ color: c.ink, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Preferences</h4>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <input type="checkbox" {...register('marketingConsent')} />
                        <span style={{ fontSize: 12, color: c.inkSub }}>I&apos;d like to receive marketing emails about new features and updates</span>
                      </label>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <input type="checkbox" {...register('dataSharingConsent')} />
                        <span style={{ fontSize: 12, color: c.inkSub }}>Allow us to use my data to improve your experience (GDPR compliant)</span>
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <DPButton
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    disabled={!watch('name') || !watch('email') || !watch('password') || !watch('confirmPassword')}
                    onClick={() => {}}
                    // style={{ marginTop: 24 }}
                  >
                    {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                  </DPButton>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
                  <div style={{ flex: 1, height: 1, background: c.border }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.inkMuted }}>OR SIGN UP WITH</span>
                  <div style={{ flex: 1, height: 1, background: c.border }} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <DPButton variant="ghost" fullWidth onClick={handleGoogleRedirect}>G Google</DPButton>
                  <DPButton variant="ghost" fullWidth onClick={handleGithubRedirect}>🐙 GitHub</DPButton>
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <span style={{ fontSize: 13, color: c.inkSub }}>
                    Already have an account?{' '}
                    <button
                      onClick={handleLogin}
                      style={{ color: c.red, fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Sign In
                    </button>
                  </span>
                </div>

                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Info style={{ fontSize: 14, color: c.inkMuted }} />
                  <span style={{ fontSize: 11, color: c.inkMuted }}>All optional fields are securely stored</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
                  {[
                    { icon: '🔐', label: '256-bit SSL' },
                    { icon: '✓', label: 'GDPR Ready' },
                    { icon: '⭐', label: '4.9/5 Rating' },
                  ].map((f, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 20 }}>{f.icon}</div>
                      <div style={{ fontSize: 10, color: c.inkMuted }}>{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </DPCard>
          </div>
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