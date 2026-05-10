/* eslint-disable @typescript-eslint/no-unused-vars */
// app/pro-legal-disclaimer/page.tsx (Professional Theme)
'use client';

import React, { useState, useEffect, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProCard } from "@/components/newUiProfessional/ProCard";
import { ProButton } from "@/components/newUiProfessional/ProButton";
import { ProToast } from "@/components/newUiProfessional/ProToast";
import { usePro } from "@/components/newUiProfessional/theme";
import GoogleAMLogo from "@/components/GoogleAMLogo";
import {
  Warning,
  ArrowBack,
  VerifiedUser,
  Close,
  Security,
  CheckCircle,
  Lock,
  Download,
  ExpandLess,
  ExpandMore,
  Print,
  Visibility,
} from "@mui/icons-material";

const steps = ["Read Disclaimer", "Accept Terms", "Access Granted"];

const disclaimerContent = {
  title: "Legal Disclaimer",
  subtitle: "Development Preview • Handle with Care",

  criticalWarnings: [
    "DEVELOPMENT PREVIEW SYSTEM",
    "NOT FOR COMMERCIAL USE",
    "TEST DATA ONLY - NO REAL INFORMATION",
    "PERIODIC DATA RESETS POSSIBLE",
    "FEATURES MAY BE UNSTABLE",
  ],

  points: [
    { icon: "⚠️", title: "Preview Status", description: "Actively under development - preview/demo version only.", color: "#fbbc04" },
    { icon: "🔒", title: "Test Data Policy", description: "Use only test/dummy data. No real customer or financial information.", color: "#ea4335" },
    { icon: "⚖️", title: "No Liability", description: "Provided 'AS IS' - no warranties or liability for data loss.", color: "#9aa0a6" },
    { icon: "🐛", title: "Expect Bugs", description: "Features may be buggy, incomplete, or removed without notice.", color: "#8B5CF6" },
    { icon: "💻", title: "Feedback Welcome", description: "Bug reports and suggestions via appropriate channels.", color: "#0EA5E9" },
    { icon: "📚", title: "Educational Use", description: "For demonstration, testing, and educational purposes only.", color: "#1a73e8" },
  ],

  prohibitedItems: [
    "Real customer names, addresses, or contact information",
    "Actual financial transactions or banking details",
    "Sensitive business information or trade secrets",
    "Personal identification information (PII)",
    "Payment card or financial account numbers",
  ],

  acknowledgment: `By accepting this disclaimer, you confirm that you understand this is a development preview system intended for testing and demonstration purposes only. You agree not to use real data and acknowledge that the developers assume no liability for any issues arising from the use of this application. Any data entered may be used for development and debugging purposes but will not be shared with third parties for commercial purposes.`,
};

export default function ProLegalDisclaimerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = theme.palette.mode === "dark";
  const c = usePro(darkMode);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    open: false, msg: '', type: 'info',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info') =>
    setToast({ open: true, msg, type });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10;
    setScrolledToBottom(bottom);
    if (bottom && activeStep === 0) {
      setActiveStep(1);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrolledToBottom(true);
      setActiveStep(1);
    }
  };

  const handleAccept = async () => {
    if (!checked) return;
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast("Disclaimer accepted successfully!", "success");
      localStorage.setItem("legal_disclaimer_accepted", "true");
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 1500);
  };

  const handleDecline = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  };

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const downloadDisclaimer = () => {
    const text = `LEGAL DISCLAIMER ACCEPTANCE\n\nAccepted by: ${user?.name}\nEmail: ${user?.email}\nDate: ${new Date().toLocaleString()}\n\n${disclaimerContent.acknowledgment}\n\nVersion: 2.0.0`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "disclaimer-acceptance.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${c.border}`, borderTopColor: c.primary, animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 16, color: c.inkSub }}>Loading legal disclaimer...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* User Info Bar */}
        <ProCard variant="elevated" padding="small" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: c.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock style={{ fontSize: 20, color: c.primary }} />
              </div>
              <div>
                <div style={{ fontWeight: 500, color: c.ink }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: c.inkSub }}>{user?.email}</div>
              </div>
            </div>
            <button onClick={handleDecline} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkMuted, padding: 8, borderRadius: 8 }}>
              <Close />
            </button>
          </div>
        </ProCard>

        {/* Error/Success Messages */}
        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: c.errorSoft, border: `1px solid ${c.error}`, color: c.error, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: `${c.success}15`, border: `1px solid ${c.success}`, color: c.success, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle /> ✅ Disclaimer Accepted - Redirecting to dashboard...
          </div>
        )}

        {/* Main Card */}
        <ProCard variant="elevated" padding="large">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <GoogleAMLogo size={56} darkMode={darkMode} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: '#fbbc04', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(251,188,4,0.3)' }}>
                <Warning style={{ fontSize: 28, color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 500, color: c.ink, margin: 0 }}>{disclaimerContent.title}</h1>
                <p style={{ fontSize: 14, color: c.inkSub, margin: '4px 0 0' }}>{disclaimerContent.subtitle}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
              <span style={{ padding: '4px 12px', borderRadius: 16, background: 'rgba(251,188,4,0.1)', color: '#fbbc04', fontSize: 12, fontWeight: 500 }}>⚠️ DEVELOPMENT PREVIEW</span>
              <span style={{ padding: '4px 12px', borderRadius: 16, background: 'rgba(234,67,53,0.1)', color: '#ea4335', fontSize: 12, fontWeight: 500 }}>🔒 TEST DATA ONLY</span>
              <span style={{ padding: '4px 12px', borderRadius: 16, background: 'rgba(26,115,232,0.1)', color: c.primary, fontSize: 12, fontWeight: 500 }}>ℹ️ VERSION 2.0.0</span>
            </div>
          </div>

          {/* Stepper */}
          <div style={{ padding: '24px', borderBottom: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              {steps.map((label, index) => (
                <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeStep >= index ? c.primary : c.border, color: activeStep >= index ? '#fff' : c.inkMuted,
                  }}>{activeStep > index ? '✓' : index + 1}</div>
                  <div style={{ fontSize: 12, color: activeStep >= index ? c.ink : c.inkMuted }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: c.border, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(activeStep + 1) * 33.33}%`, height: '100%', background: c.primary, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: isMobile ? '16px' : '24px' }}>
            {/* Critical Warnings */}
            <div style={{ padding: '20px', borderRadius: 12, background: 'rgba(234,67,53,0.05)', border: `1px solid rgba(234,67,53,0.2)`, marginBottom: 24 }}>
              <h3 style={{ color: '#ea4335', marginBottom: 16, fontSize: '1rem' }}>🚨 CRITICAL WARNINGS</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {disclaimerContent.criticalWarnings.map((warning, i) => (
                  <li key={i} style={{ marginBottom: 8, color: c.ink }}>{warning}</li>
                ))}
              </ul>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: 16, marginBottom: 24 }}>
              {disclaimerContent.points.map((point, index) => (
                <div key={index} onClick={() => toggleExpand(index)} style={{
                  padding: 16, borderRadius: 12, background: darkMode ? c.surface2 : '#fff', border: `1px solid ${c.border}`, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{point.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: point.color, marginBottom: 4 }}>{point.title}</div>
                      <div style={{ fontSize: 13, color: c.inkSub }}>{point.description}</div>
                    </div>
                    {expanded === index ? <ExpandLess /> : <ExpandMore />}
                  </div>
                </div>
              ))}
            </div>

            {/* Prohibited Items */}
            <div style={{ padding: 20, borderRadius: 12, background: 'rgba(234,67,53,0.02)', border: `2px solid rgba(234,67,53,0.2)`, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Security style={{ color: '#ea4335' }} />
                <h3 style={{ fontWeight: 600, color: '#ea4335', margin: 0 }}>ABSOLUTELY PROHIBITED</h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {disclaimerContent.prohibitedItems.map((item, i) => (
                  <li key={i} style={{ marginBottom: 8, color: c.ink }}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: `1px solid ${c.border}`, margin: '24px 0', textAlign: 'center', paddingTop: 16 }}>
              <span style={{ padding: '4px 12px', borderRadius: 16, background: c.primarySoft, color: c.primary, fontSize: 12 }}>FINAL ACKNOWLEDGMENT</span>
            </div>

            {/* Scrollable Acknowledgment */}
            <div ref={scrollRef} onScroll={handleScroll} style={{
              maxHeight: 200, overflow: 'auto', padding: 20, borderRadius: 12, background: darkMode ? c.surface2 : '#f8f9fa', border: `1px solid ${c.border}`, marginBottom: 24,
              '&::-webkit-scrollbar': { width: 8 }, '&::-webkit-scrollbar-track': { background: c.border, borderRadius: 4 }, '&::-webkit-scrollbar-thumb': { background: c.inkMuted, borderRadius: 4 }
            }}>
              <p style={{ lineHeight: 1.6, color: c.ink }}>{disclaimerContent.acknowledgment}</p>
              {!scrolledToBottom && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, padding: 12, background: 'rgba(251,188,4,0.05)', borderRadius: 8 }}>
                  <Visibility style={{ fontSize: 18, marginRight: 8, color: '#fbbc04' }} />
                  <span style={{ fontSize: 12, color: '#fbbc04' }}>Scroll to the bottom to continue</span>
                  <button onClick={scrollToBottom} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#fbbc04', cursor: 'pointer', fontSize: 12 }}>Skip to bottom →</button>
                </div>
              )}
            </div>

            {/* Acceptance Section */}
            <div style={{ padding: 20, borderRadius: 12, background: darkMode ? c.surface2 : '#f8f9fa', border: `1px solid ${c.border}` }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, cursor: 'pointer' }}>
                <input type="checkbox" checked={checked} onChange={(e) => { setChecked(e.target.checked); if (e.target.checked && activeStep === 1) setActiveStep(2); }} disabled={!scrolledToBottom || loading} style={{ width: 20, height: 20, marginTop: 2, accentColor: c.primary }} />
                <div>
                  <div style={{ fontWeight: 500, color: checked ? c.success : c.ink }}>✅ I HAVE READ, UNDERSTOOD, AND AGREE TO ALL TERMS</div>
                  {!scrolledToBottom && !loading && <div style={{ fontSize: 11, color: '#fbbc04', marginTop: 4 }}>(Please scroll to the bottom of the acknowledgment text to enable this checkbox)</div>}
                </div>
              </label>

              <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between' }}>
                <ProButton variant="secondary" onClick={handleDecline} disabled={loading} startIcon={<ArrowBack />}>
                  I DO NOT ACCEPT - LOGOUT
                </ProButton>
                <ProButton variant="primary" onClick={handleAccept} disabled={!checked || loading} loading={loading} endIcon={<VerifiedUser />}>
                  {loading ? 'PROCESSING ACCEPTANCE...' : 'I ACCEPT & PROCEED TO DASHBOARD'}
                </ProButton>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
                <button onClick={downloadDisclaimer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Download style={{ fontSize: 16 }} /> Download Copy</button>
                <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Print style={{ fontSize: 16 }} /> Print</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: 16, borderTop: `1px solid ${c.border}`, background: darkMode ? c.surface2 : '#f8f9fa', textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: c.inkMuted }}>Version 2.0.0 • Last Updated: {new Date().toLocaleDateString()} • User ID: {user?.id?.substring(0, 8) || "N/A"}</span>
          </div>
        </ProCard>
      </div>

      <ProToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </div>
  );
}