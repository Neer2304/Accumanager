/* eslint-disable @typescript-eslint/no-unused-vars */
// app/batman-legal-disclaimer/page.tsx (Batman Theme)
'use client';

import React, { useState, useEffect, useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BatmanCard } from "@/components/newUiBatman/BatmanCard";
import { BatmanButton } from "@/components/newUiBatman/BatmanButton";
import { BatmanToast } from "@/components/newUiBatman/BatmanToast";
import { BatmanDivider } from "@/components/newUiBatman/BatmanDivider";
import { useBatman } from "@/components/newUiBatman/theme";
import GoogleAMLogo from "@/components/GoogleAMLogo";
import { Warning, ArrowBack, VerifiedUser, Close, Security, Lock, Download, Print, Visibility, CheckCircle, ExpandLess, ExpandMore, Gavel } from "@mui/icons-material";

const steps = ["Review Protocol", "Accept Terms", "Access Granted"];

const disclaimerContent = {
  title: "Gotham Legal Protocol",
  subtitle: "Classified • Authorized Personnel Only",

  criticalWarnings: [
    "CLASSIFIED DEVELOPMENT SYSTEM",
    "UNAUTHORIZED ACCESS PROHIBITED",
    "TEST DATA ONLY - NO REAL INTEL",
    "DATA MAY BE PURGED WITHOUT NOTICE",
    "SYSTEM STABILITY: UNPREDICTABLE",
  ],

  points: [
    { icon: "🦇", title: "Preview Status", description: "Active development. The night is dark and full of bugs.", color: "#ffd700" },
    { icon: "🔒", title: "Test Data Policy", description: "Use dummy intel only. Real data compromises the mission.", color: "#ff4444" },
    { icon: "⚖️", title: "No Liability", description: "AS IS. Wayne Enterprises assumes no responsibility.", color: "#9aa0a6" },
    { icon: "🐛", title: "Expect Anomalies", description: "System may be unstable. Report to the Batcomputer.", color: "#8B5CF6" },
    { icon: "💬", title: "Oracle's Hotline", description: "Report issues through secure channels.", color: "#0EA5E9" },
    { icon: "🎓", title: "Training Use", description: "For Bat-family training and testing purposes only.", color: "#ffd700" },
  ],

  prohibitedItems: [
    "Real civilian identities (Batman doesn't compromise)",
    "Actual financial transactions (Leave that to Bruce)",
    "Wayne Enterprises trade secrets",
    "Gotham city PII data",
    "Arkham patient information",
  ],

  acknowledgment: `By accepting this protocol, you confirm that you are an authorized user of the Batcomputer system. This is a development preview for testing purposes only. Use dummy data. The Batman assumes no liability for data loss or system failures. Remember: The night is darkest just before the dawn. Accept to proceed. — Bruce Wayne 🦇`,
};

export default function BatmanLegalDisclaimerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = theme.palette.mode === "dark";
  const c = useBatman(darkMode);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'warning' }>({ open: false, msg: '', type: 'success' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') => setToast({ open: true, msg, type });

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
      setLoading(false); setSuccess(true); showToast("Access granted. Welcome to the Batcave. 🦇", "success");
      localStorage.setItem("legal_disclaimer_accepted", "true");
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 1500);
  };

  const handleDecline = async () => { try { await logout(); } catch(e) {} finally { router.push("/login"); } };
  const toggleExpand = (index: number) => setExpanded(expanded === index ? null : index);
  const downloadDisclaimer = () => {
    const text = `GOTHAM LEGAL PROTOCOL\n\nUser: ${user?.name}\nEmail: ${user?.email}\nDate: ${new Date().toLocaleString()}\n\n${disclaimerContent.acknowledgment}`;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    element.download = "gotham-legal-protocol.txt";
    element.click();
  };

  if (isLoading) return <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center' }}><div className="bat-spinner" /><p style={{ color: c.inkSub, marginTop: 16 }}>Loading secure protocol...</p></div></div>;

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{`.bat-spinner { width: 48px; height: 48px; border: 3px solid ${c.border}; border-top-color: ${c.gold}; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* User Bar */}
          <BatmanCard variant="elevated"><div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 20, background: c.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock style={{ color: c.gold }} /></div><div><div style={{ fontWeight: 700, color: c.ink }}>{user?.name}</div><div style={{ fontSize: 12, color: c.inkSub }}>{user?.email}</div></div></div><button onClick={handleDecline} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkMuted }}><Close /></button></div></BatmanCard>

          {error && <div style={{ padding: 12, borderRadius: 12, background: `${c.error}15`, borderLeft: `4px solid ${c.error}`, color: c.error, margin: '20px 0' }}>⚠️ {error}</div>}
          {success && <div style={{ padding: 12, borderRadius: 12, background: `${c.success}15`, borderLeft: `4px solid ${c.success}`, color: c.success, margin: '20px 0', display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle /> ✓ Access Granted - Redirecting to Batcomputer...</div>}

          <BatmanCard variant="elevated"><div style={{ padding: isMobile ? 20 : 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GoogleAMLogo size={56} darkMode={darkMode} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: c.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gavel style={{ fontSize: 28, color: darkMode ? '#0a0a0a' : '#fff' }} /></div>
                <div><h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, color: c.ink, margin: 0 }}>{disclaimerContent.title}</h1><p style={{ color: c.inkSub }}>{disclaimerContent.subtitle}</p></div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{['🦇 CLASSIFIED', '🔒 TEST DATA ONLY', '⚡ VERSION 2.0.0'].map(t => <span key={t} style={{ padding: '4px 12px', borderRadius: 16, background: c.goldSoft, color: c.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{t}</span>)}</div>
            </div>

            <div style={{ padding: '20px', borderBottom: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>{steps.map((label, i) => (<div key={label} style={{ flex: 1, textAlign: 'center' }}><div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px', background: activeStep >= i ? c.gold : c.border, color: activeStep >= i ? (darkMode ? '#0a0a0a' : '#fff') : c.inkMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeStep > i ? '✓' : i + 1}</div><div style={{ fontSize: 11, fontWeight: activeStep === i ? 700 : 400, color: activeStep >= i ? c.ink : c.inkMuted, letterSpacing: '0.05em' }}>{label}</div></div>))}</div>
              <div style={{ height: 4, background: c.border, borderRadius: 2, marginTop: 16, overflow: 'hidden' }}><div style={{ width: `${(activeStep + 1) * 33.33}%`, height: '100%', background: c.gold, transition: 'width 0.3s' }} /></div>
            </div>

            <div style={{ padding: isMobile ? 16 : 24 }}>
              <div style={{ padding: 20, borderRadius: 12, background: `${c.error}10`, borderLeft: `4px solid ${c.error}`, marginBottom: 24 }}><h3 style={{ color: c.error, marginBottom: 16 }}>🚨 GOTHAM PROTOCOL WARNINGS</h3><ul>{disclaimerContent.criticalWarnings.map((w, i) => <li key={i} style={{ marginBottom: 8, color: c.ink }}>{w}</li>)}</ul></div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: 16, marginBottom: 24 }}>{disclaimerContent.points.map((p, i) => (<div key={i} onClick={() => toggleExpand(i)} style={{ padding: 16, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}`, cursor: 'pointer' }}><div style={{ display: 'flex', gap: 12 }}><div style={{ fontSize: 24 }}>{p.icon}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: p.color }}>{p.title}</div><div style={{ fontSize: 13, color: c.inkSub }}>{p.description}</div></div>{expanded === i ? <ExpandLess /> : <ExpandMore />}</div></div>))}</div>

              <div style={{ padding: 20, borderRadius: 12, background: `${c.error}10`, border: `2px solid ${c.error}`, marginBottom: 24 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><Security style={{ color: c.error }} /><h3 style={{ fontWeight: 700, color: c.error, margin: 0 }}>UNAUTHORIZED ACTIONS</h3></div><ul>{disclaimerContent.prohibitedItems.map((item, i) => <li key={i} style={{ marginBottom: 8, color: c.ink }}>{item}</li>)}</ul></div>

              <BatmanDivider variant="bat" />

              <div ref={scrollRef} onScroll={handleScroll} style={{ maxHeight: 200, overflow: 'auto', padding: 20, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}`, marginBottom: 24 }}><p>{disclaimerContent.acknowledgment}</p>{!scrolledToBottom && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, padding: 12, background: c.goldSoft, borderRadius: 8 }}><Visibility style={{ color: c.gold }} /><span style={{ color: c.gold, marginLeft: 8 }}>Scroll to continue</span><button onClick={scrollToBottom} style={{ marginLeft: 12, background: 'none', border: 'none', color: c.gold, cursor: 'pointer' }}>Skip ↓</button></div>}</div>

              <div style={{ padding: 20, borderRadius: 12, background: c.surface2, border: `1px solid ${c.border}` }}>
                <label style={{ display: 'flex', gap: 12, marginBottom: 24, cursor: 'pointer' }}><input type="checkbox" checked={checked} onChange={(e) => { setChecked(e.target.checked); if (e.target.checked && activeStep === 1) setActiveStep(2); }} disabled={!scrolledToBottom || loading} style={{ accentColor: c.gold, width: 20, height: 20 }} /><div><div style={{ fontWeight: 700, color: checked ? c.success : c.ink }}>✅ I ACCEPT THE GOTHAM PROTOCOL</div>{!scrolledToBottom && !loading && <div style={{ fontSize: 11, color: c.gold }}>(Review full protocol to enable acceptance)</div>}</div></label>

                <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
                  <BatmanButton variant="outline" onClick={handleDecline}>I DO NOT ACCEPT - LOGOUT</BatmanButton>
                  <BatmanButton variant="primary" onClick={handleAccept} disabled={!checked || loading} loading={loading} icon="🦇">{loading ? 'PROCESSING...' : 'ACCEPT & ACCESS BATCOMPUTER'}</BatmanButton>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
                  <button onClick={downloadDisclaimer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub }}><Download /> Download Protocol</button>
                  <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.inkSub }}><Print /> Print</button>
                </div>
              </div>
            </div>

            <div style={{ padding: 16, borderTop: `1px solid ${c.border}`, background: c.surface2, textAlign: 'center', fontSize: 10, color: c.inkMuted }}>Version 2.0.0 • User ID: {user?.id?.substring(0, 8) || "N/A"} • &quot;I&apos;m Batman.&quot; — Batman</div>
          </div></BatmanCard>
        </div>
      </div>
      <BatmanToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </>
  );
}