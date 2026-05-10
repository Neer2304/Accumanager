/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dp-legal-disclaimer/page.tsx (Deadpool Theme)
'use client';

import React, { useState, useEffect, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DPCard } from "@/components/newUI/DPCard";
import { DPButton } from "@/components/newUI/DPButton";
import { DPToast } from "@/components/newUI/DPToast";
import { useDP } from "@/components/newUI/theme";
import GoogleAMLogo from "@/components/GoogleAMLogo";
import { Warning, ArrowBack, VerifiedUser, Close, Security, Lock, Download, Print, Visibility, CheckCircle, ExpandLess, ExpandMore } from "@mui/icons-material";

const steps = ["Read The Fine Print", "Accept or Else", "Welcome to the Chaos"];

const disclaimerContent = {
  title: "Deadpool's Legal Disclaimer",
  subtitle: "Maximum Disclaimers • Minimum Responsibility",

  criticalWarnings: [
    "DEADPOOL APPROVED (Not Really)",
    "DEVELOPMENT PREVIEW - THINGS WILL BREAK",
    "USE FAKE DATA OR I'LL BREAK THE FOURTH WALL",
    "DATA MAY DISAPPEAR (Like My Sanity)",
    "BUGS ARE FEATURES WAITING TO HAPPEN",
  ],

  points: [
    { icon: "💀", title: "Preview Status", description: "Actively under development. Things will break. Don't say I didn't warn you!", color: "#dc2626" },
    { icon: "🦸", title: "Test Data Policy", description: "Use fake data only. Real data = Bad. Fake data = Maximum Fun.", color: "#f97316" },
    { icon: "⚖️", title: "No Liability", description: "AS IS. No warranties. If data gets lost, blame my healing factor.", color: "#9aa0a6" },
    { icon: "🐛", title: "Expect Bugs", description: "Features may vanish. Bugs are my sidekicks. Deal with it.", color: "#8B5CF6" },
    { icon: "💬", title: "Feedback Welcome", description: "Tell me what's broken. I might fix it. No promises. 😘", color: "#06b6d4" },
    { icon: "🎓", title: "Educational Use", description: "For testing purposes. Don't try this at home. I'm a professional.", color: "#dc2626" },
  ],

  prohibitedItems: [
    "Real customer data (I'm not your lawyer, but seriously, don't)",
    "Actual financial info (Deadpool doesn't do math)",
    "Trade secrets (I'll accidentally tweet them)",
    "Personal IDs (Identity theft is not a joke, Jim!)",
    "Payment card numbers (I have impulse control issues)",
  ],

  acknowledgment: `By accepting this disclaimer (you have no choice, really), you confirm that you understand this is a development preview. It's buggy, it's messy, and it might explode. But that's part of the charm! Use fake data only. I take no responsibility for anything. Seriously, I'm just a guy in a red suit. Now accept it so we can have some fun! - Deadpool 🦸‍♂️💀`,
};

export default function DpLegalDisclaimerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = theme.palette.mode === "dark";
  const c = useDP(darkMode);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({ open: false, msg: '', type: 'success' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ open: true, msg, type });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10;
    setScrolledToBottom(bottom);
    if (bottom && activeStep === 0) setActiveStep(1);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; setScrolledToBottom(true); setActiveStep(1); }
  };

  const handleAccept = async () => {
    if (!checked) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false); setSuccess(true); showToast("Boom! You're in the club! 🦸", "success");
      localStorage.setItem("legal_disclaimer_accepted", "true");
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 1500);
  };

  const handleDecline = async () => { try { await logout(); } catch(e) {} finally { router.push("/login"); } };
  const toggleExpand = (index: number) => setExpanded(expanded === index ? null : index);
  const downloadDisclaimer = () => {
    const text = `DEADPOOL'S LEGAL DISCLAIMER\n\nAccepted by: ${user?.name}\nEmail: ${user?.email}\nDate: ${new Date().toLocaleString()}\n\n${disclaimerContent.acknowledgment}`;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    element.download = "deadpool-disclaimer.txt";
    element.click();
  };

  if (isLoading) return <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center' }}><div className="spinner" /><p style={{ color: c.inkSub, marginTop: 16 }}>Loading maximum disclaimer...</p></div></div>;

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{`.spinner { width: 48px; height: 48px; border: 3px solid ${c.border}; border-top-color: ${c.red}; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* User Bar */}
          <DPCard><div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 20, background: c.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock style={{ color: c.red }} /></div><div><div style={{ fontWeight: 600, color: c.ink }}>{user?.name}</div><div style={{ fontSize: 12, color: c.inkSub }}>{user?.email}</div></div></div><button onClick={handleDecline} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkMuted }}><Close /></button></div></DPCard>

          {error && <div style={{ padding: 12, borderRadius: 12, background: c.redSoft, border: `1px solid ${c.error}`, color: c.error, margin: '20px 0' }}>⚠️ {error}</div>}
          {success && <div style={{ padding: 12, borderRadius: 12, background: `${c.success}15`, border: `1px solid ${c.success}`, color: c.success, margin: '20px 0', display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle /> ✅ Accepted! Redirecting to dashboard...</div>}

          <DPCard><div style={{ padding: isMobile ? 20 : 32 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GoogleAMLogo size={56} darkMode={darkMode} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: c.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Warning style={{ fontSize: 28, color: '#fff' }} /></div>
                <div><h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, color: c.ink, margin: 0 }}>{disclaimerContent.title}</h1><p style={{ color: c.inkSub }}>{disclaimerContent.subtitle}</p></div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{['💀 DEVELOPMENT PREVIEW', '🦸 TEST DATA ONLY', '⚡ VERSION 2.0.0'].map(t => <span key={t} style={{ padding: '4px 12px', borderRadius: 16, background: c.redSoft, color: c.red, fontSize: 12, fontWeight: 600 }}>{t}</span>)}</div>
            </div>

            {/* Stepper */}
            <div style={{ padding: '20px', borderBottom: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>{steps.map((label, i) => (<div key={label} style={{ flex: 1, textAlign: 'center' }}><div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px', background: activeStep >= i ? c.red : c.border, color: activeStep >= i ? '#fff' : c.inkMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeStep > i ? '✓' : i + 1}</div><div style={{ fontSize: 11, fontWeight: activeStep === i ? 700 : 400, color: activeStep >= i ? c.ink : c.inkMuted }}>{label}</div></div>))}</div>
              <div style={{ height: 4, background: c.border, borderRadius: 2, marginTop: 16, overflow: 'hidden' }}><div style={{ width: `${(activeStep + 1) * 33.33}%`, height: '100%', background: c.red, transition: 'width 0.3s' }} /></div>
            </div>

            <div style={{ padding: isMobile ? 16 : 24 }}>
              {/* Critical Warnings */}
              <div style={{ padding: 20, borderRadius: 12, background: c.redSoft, border: `1px solid ${c.red}`, marginBottom: 24 }}><h3 style={{ color: c.red, marginBottom: 16 }}>🚨 DEADPOOL&apos;S CRITICAL WARNINGS</h3><ul style={{ margin: 0, paddingLeft: 20 }}>{disclaimerContent.criticalWarnings.map((w, i) => <li key={i} style={{ marginBottom: 8, color: c.ink }}>{w}</li>)}</ul></div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: 16, marginBottom: 24 }}>{disclaimerContent.points.map((p, i) => (<div key={i} onClick={() => toggleExpand(i)} style={{ padding: 16, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}`, cursor: 'pointer' }}><div style={{ display: 'flex', gap: 12 }}><div style={{ fontSize: 24 }}>{p.icon}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: p.color }}>{p.title}</div><div style={{ fontSize: 13, color: c.inkSub }}>{p.description}</div></div>{expanded === i ? <ExpandLess /> : <ExpandMore />}</div></div>))}</div>

              {/* Prohibited */}
              <div style={{ padding: 20, borderRadius: 12, background: `${c.error}10`, border: `2px solid ${c.error}`, marginBottom: 24 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><Security style={{ color: c.error }} /><h3 style={{ fontWeight: 700, color: c.error, margin: 0 }}>ABSOLUTELY PROHIBITED (Seriously, Don&apos;t)</h3></div><ul>{disclaimerContent.prohibitedItems.map((item, i) => <li key={i} style={{ marginBottom: 8, color: c.ink }}>{item}</li>)}</ul></div>

              <div style={{ textAlign: 'center', margin: '24px 0' }}><span style={{ padding: '4px 12px', borderRadius: 16, background: c.redSoft, color: c.red, fontSize: 12 }}>🦸 FINAL ACKNOWLEDGMENT</span></div>

              {/* Scrollable */}
              <div ref={scrollRef} onScroll={handleScroll} style={{ maxHeight: 200, overflow: 'auto', padding: 20, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}`, marginBottom: 24 }}><p style={{ lineHeight: 1.6, color: c.ink }}>{disclaimerContent.acknowledgment}</p>{!scrolledToBottom && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, padding: 12, background: c.redSoft, borderRadius: 8 }}><Visibility style={{ color: c.red }} /><span style={{ color: c.red, marginLeft: 8 }}>Scroll to the bottom, bub!</span><button onClick={scrollToBottom} style={{ marginLeft: 12, background: 'none', border: 'none', color: c.red, cursor: 'pointer' }}>Skip ↓</button></div>}</div>

              {/* Acceptance */}
              <div style={{ padding: 20, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}` }}>
                <label style={{ display: 'flex', gap: 12, marginBottom: 24, cursor: 'pointer' }}><input type="checkbox" checked={checked} onChange={(e) => { setChecked(e.target.checked); if (e.target.checked && activeStep === 1) setActiveStep(2); }} disabled={!scrolledToBottom || loading} style={{ accentColor: c.red, width: 20, height: 20 }} /><div><div style={{ fontWeight: 700, color: checked ? c.success : c.ink }}>✅ I HAVE READ AND ACCEPT (You don&apos;t have a choice)</div>{!scrolledToBottom && !loading && <div style={{ fontSize: 11, color: c.red, marginTop: 4 }}>(Scroll to the bottom first, smartypants!)</div>}</div></label>

                <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
                  <DPButton variant="ghost" onClick={handleDecline}>I DO NOT ACCEPT - LOGOUT</DPButton>
                  <DPButton variant="primary" onClick={handleAccept} disabled={!checked || loading} loading={loading}>{loading ? 'PROCESSING...' : 'I ACCEPT! LET\'S GO!'}</DPButton>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
                  <button onClick={downloadDisclaimer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub }}><Download /> Download Copy</button>
                  <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub }}><Print /> Print</button>
                </div>
              </div>
            </div>

            <div style={{ padding: 16, borderTop: `1px solid ${c.border}`, background: c.surface2, textAlign: 'center', fontSize: 10, color: c.inkMuted }}>Version 2.0.0 • User ID: {user?.id?.substring(0, 8) || "N/A"} • &quot;With great power comes great... wait, wrong movie.&quot; — Deadpool</div>
          </div></DPCard>
        </div>
      </div>
      <DPToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </>
  );
}