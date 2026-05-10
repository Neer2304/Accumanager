/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/batman-admin-about/page.tsx (Batman Theme - COMPLETE)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery, Typography } from '@mui/material';
import { useBatman } from '@/components/newUiBatman/theme';
import { BatmanCard } from '@/components/newUiBatman/BatmanCard';
import { BatmanButton } from '@/components/newUiBatman/BatmanButton';
import { BatmanToast } from '@/components/newUiBatman/BatmanToast';
import { BatmanDivider } from '@/components/newUiBatman/BatmanDivider';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import {
  Business, Email, Share, TextFields, Search, Palette, Settings,
  Refresh, 
  ColorLens, DarkMode,
} from '@mui/icons-material';

// Complete Types (same as Professional)
interface AboutData {
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  contact: { email: string; phone: string; address: string; workingHours: string; supportHours: string; };
  socialMedia: { facebook: string; twitter: string; instagram: string; linkedin: string; youtube: string; github: string; };
  labels: Record<string, string>;
  seo: { metaTitle: string; metaDescription: string; metaKeywords: string[]; ogTitle: string; ogDescription: string; ogImage: string; };
  theme: {
    gold: any;
    primaryColor: string; secondaryColor: string; accentColor: string; backgroundColor: string;
    textColor: string; textSecondary: string; textMuted: string; borderColor: string;
    successColor: string; warningColor: string; errorColor: string; infoColor: string;
    fontFamily: string; fontSizeBase: string; fontSizeLg: string; fontSizeSm: string;
    borderRadius: string; borderRadiusLg: string; borderRadiusSm: string;
    boxShadow: string; boxShadowLg: string; headerHeight: string; sidebarWidth: string; darkMode: boolean;
  };
  system: {
    timezone: string; dateFormat: string; timeFormat: string; currency: string; currencySymbol: string;
    language: string; defaultRole: string; defaultPlan: string; trialDays: number; sessionTimeout: number;
    itemsPerPage: number; enableRegistration: boolean; enableEmailVerification: boolean;
    enablePhoneVerification: boolean; enableTwoFactor: boolean; enableCaptcha: boolean; maintenanceMode: boolean;
  };
}

const defaultAboutData: AboutData = {
  companyName: 'Wayne Enterprises',
  companyDescription: 'Gotham\'s Premier Business Solutions • Justice Through Innovation',
  companyLogo: '',
  contact: {
    email: 'bruce.wayne@wayneenterprises.com',
    phone: '+1 (555) BAT-MOBILE',
    address: '1007 Mountain Drive, Gotham City, NY 10001',
    workingHours: 'Monday - Friday, 9:00 AM - 9:00 PM EST',
    supportHours: '24/7 (The Batman is always watching)',
  },
  socialMedia: {
    facebook: 'https://facebook.com/wayneenterprises',
    twitter: 'https://twitter.com/wayneenterprises',
    instagram: 'https://instagram.com/wayneenterprises',
    linkedin: 'https://linkedin.com/company/wayne-enterprises',
    youtube: 'https://youtube.com/wayneenterprises',
    github: 'https://github.com/wayne-enterprises',
  },
  labels: {
    home: 'The Cave',
    about: 'About Wayne Enterprises',
    services: 'Our Services',
    contact: 'Contact Batman',
    dashboard: 'Batcomputer',
    login: 'Access Protocol',
    register: 'Join The Mission',
    logout: 'Exit Batcave',
    profile: 'Bruce Wayne Profile',
    settings: 'Bat-settings',
    users: 'Allies',
    products: 'Tech Arsenal',
    orders: 'Justice Log',
    reports: 'Gotham Reports',
  },
  seo: {
    metaTitle: 'Wayne Enterprises - Innovation for a Better Gotham',
    metaDescription: 'Leading technology and business solutions for a safer tomorrow.',
    metaKeywords: ['wayne enterprises', 'batman', 'gotham', 'technology', 'justice'],
    ogTitle: 'Wayne Enterprises - Building a Better Gotham',
    ogDescription: 'Committed to innovation, justice, and the future of Gotham City.',
    ogImage: 'https://wayneenterprises.com/og-image.jpg',
  },
  theme: {
    primaryColor: '#ffd700',
    secondaryColor: '#1a1a1a',
    accentColor: '#ffd700',
    backgroundColor: '#0a0a0a',
    textColor: '#e8e8e8',
    textSecondary: '#888888',
    textMuted: '#444444',
    borderColor: '#2a2a2a',
    successColor: '#00ff88',
    warningColor: '#ffaa00',
    errorColor: '#ff4444',
    infoColor: '#ffd700',
    fontFamily: '"Roboto Condensed", "Google Sans", sans-serif',
    fontSizeBase: '14px',
    fontSizeLg: '16px',
    fontSizeSm: '12px',
    borderRadius: '12px',
    borderRadiusLg: '20px',
    borderRadiusSm: '8px',
    boxShadow: '0 4px 15px rgba(255,215,0,0.15)',
    boxShadowLg: '0 8px 30px rgba(255,215,0,0.25)',
    headerHeight: '64px',
    sidebarWidth: '250px',
    darkMode: true,
    gold: undefined
  },
  system: {
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    currency: 'USD',
    currencySymbol: '$',
    language: 'en',
    defaultRole: 'citizen',
    defaultPlan: 'justice',
    trialDays: 30,
    sessionTimeout: 60,
    itemsPerPage: 15,
    enableRegistration: true,
    enableEmailVerification: true,
    enablePhoneVerification: true,
    enableTwoFactor: true,
    enableCaptcha: true,
    maintenanceMode: false,
  },
};

function ColorInput({ value, onChange, label, c }: { value: string; onChange: (val: string) => void; label: string; c: any }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: c.inkSub, marginBottom: 6, letterSpacing: '0.05em' }}>{label}</label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 50, height: 40, borderRadius: 8, border: `2px solid ${c.border}`, cursor: 'pointer' }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14 }} />
      </div>
    </div>
  );
}

function Select({ value, onChange, options, c }: { value: string; onChange: (val: string) => void; options: Array<{ value: string; label: string }>; c: any }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`,
      background: c.surface2, color: c.ink, fontSize: 14, outline: 'none', cursor: 'pointer',
      fontFamily: c.fontFamily, fontWeight: 500,
    }}>
      {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
  );
}

function Toggle({ checked, onChange, label, c }: { checked: boolean; onChange: (val: boolean) => void; label: string; c: any }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${c.border}` }}>
      <span style={{ color: c.ink, fontWeight: 500, letterSpacing: '0.03em' }}>{label}</span>
      <button onClick={() => onChange(!checked)} style={{
        width: 48, height: 24, borderRadius: 12, border: 'none', background: checked ? c.gold : c.textMuted,
        cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
      }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 26 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', c }: { value: string; onChange: (val: string) => void; placeholder?: string; type?: string; c: any }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`,
      background: c.surface2, color: c.ink, fontSize: 14, outline: 'none', fontFamily: c.fontFamily,
      transition: 'border-color 0.2s',
      '&:focus': { borderColor: c.gold }
    }} />
  );
}

export default function BatmanAdminAboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useBatman(darkMode);
  
  const [activeTab, setActiveTab] = useState(0);
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'warning' }>({
    open: false, msg: '', type: 'success',
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') => setToast({ open: true, msg, type });
  const fetchData = useCallback(async () => { setLoading(true); setTimeout(() => { setAboutData(defaultAboutData); setLoading(false); showToast('Batcomputer data loaded. 🦇', 'success'); }, 800); }, []);
  const saveSection = useCallback(async (section: string, data: any) => { setSaving(true); setTimeout(() => { setAboutData(prev => ({ ...prev, [section]: { ...prev[section as keyof AboutData], ...data } })); setSaving(false); showToast(`${section} saved. Justice is served. 🦇`, 'success'); }, 1000); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { id: 'company', label: 'ENTERPRISE', icon: <Business /> },
    { id: 'contact', label: 'COMMS', icon: <Email /> },
    { id: 'social', label: 'NETWORKS', icon: <Share /> },
    { id: 'labels', label: 'PROTOCOLS', icon: <TextFields /> },
    { id: 'seo', label: 'SIGNALS', icon: <Search /> },
    { id: 'theme', label: 'BAT-STYLE', icon: <Palette /> },
    { id: 'system', label: 'SYSTEMS', icon: <Settings /> },
  ];

  const renderCompanyTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>🏢 WAYNE ENTERPRISES</h2>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub, letterSpacing: '0.05em' }}>CORPORATE IDENTITY</label><Input value={aboutData.companyName} onChange={(val) => setAboutData(prev => ({ ...prev, companyName: val }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>MISSION STATEMENT</label><textarea value={aboutData.companyDescription} onChange={(e) => setAboutData(prev => ({ ...prev, companyDescription: e.target.value }))} rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, resize: 'vertical' }} /></div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>CORPORATE LOGO URL</label><Input value={aboutData.companyLogo} onChange={(val) => setAboutData(prev => ({ ...prev, companyLogo: val }))} c={c} /></div>
      <BatmanButton onClick={() => saveSection('company', { companyName: aboutData.companyName, companyDescription: aboutData.companyDescription, companyLogo: aboutData.companyLogo })} loading={saving} icon="🦇">SAVE ENTERPRISE DATA</BatmanButton>
    </div>
  );

  const renderContactTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>📡 COMMUNICATIONS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>SECURE EMAIL</label><Input value={aboutData.contact.email} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, email: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>BAT-PHONE</label><Input value={aboutData.contact.phone} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, phone: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OPERATING HOURS</label><Input value={aboutData.contact.workingHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, workingHours: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>SUPPORT WINDOW</label><Input value={aboutData.contact.supportHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, supportHours: val } }))} c={c} /></div>
      </div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>WAYNE TOWER ADDRESS</label><textarea value={aboutData.contact.address} onChange={(e) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <BatmanButton onClick={() => saveSection('contact', aboutData.contact)} loading={saving} icon="🦇">SAVE COMMS</BatmanButton>
    </div>
  );

  const renderSocialTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>🌐 GOTHAM NETWORKS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {Object.entries(aboutData.socialMedia).map(([key, value]) => (<div key={key}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub, textTransform: 'uppercase', fontSize: 11 }}>{key}</label><Input value={value} onChange={(val) => setAboutData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [key]: val } }))} c={c} /></div>))}
      </div>
      <BatmanButton onClick={() => saveSection('socialMedia', aboutData.socialMedia)} loading={saving} icon="🦇">SAVE NETWORKS</BatmanButton>
    </div>
  );

  const renderLabelsTab = () => {
    const filteredKeys = Object.keys(aboutData.labels).filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()) || aboutData.labels[key].toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>🔤 SYSTEM LABELS</h2>
        <div style={{ marginBottom: 20 }}><Input value={searchTerm} onChange={setSearchTerm} placeholder="🔍 SEARCH LABELS..." c={c} /></div>
        <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
          {filteredKeys.map((key) => (<div key={key} style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: c.gold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{key}</label><Input value={aboutData.labels[key]} onChange={(val) => setAboutData(prev => ({ ...prev, labels: { ...prev.labels, [key]: val } }))} c={c} /></div>))}
        </div>
        <BatmanButton onClick={() => saveSection('labels', aboutData.labels)} loading={saving}icon="🦇">SAVE LABELS</BatmanButton>
      </div>
    );
  };

  const renderSeoTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>📡 SIGNATURE PROTOCOLS</h2>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>BAT-TITLE</label><Input value={aboutData.seo.metaTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: val } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>BAT-DESCRIPTION</label><textarea value={aboutData.seo.metaDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>BAT-KEYWORDS</label><Input value={aboutData.seo.metaKeywords.join(', ')} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaKeywords: val.split(',').map(s => s.trim()) } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>GOTHAM TITLE</label><Input value={aboutData.seo.ogTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogTitle: val } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>GOTHAM DESCRIPTION</label><textarea value={aboutData.seo.ogDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <BatmanButton onClick={() => saveSection('seo', aboutData.seo)} loading={saving} icon="🦇">SAVE SEO</BatmanButton>
    </div>
  );

  const renderThemeTab = () => {
    const [localTheme, setLocalTheme] = useState(aboutData.theme);
    const applyTheme = () => { setAboutData(prev => ({ ...prev, theme: localTheme })); saveSection('theme', localTheme); };
    return (
      <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>🎨 BAT-STYLE CONFIGURATOR</h2>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.gold }}><ColorLens /> GOTHAM COLORS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0 24px' }}>
            <ColorInput value={localTheme.primaryColor} onChange={(v) => setLocalTheme({ ...localTheme, primaryColor: v })} label="BAT-SIGNAL" c={c} />
            <ColorInput value={localTheme.secondaryColor} onChange={(v) => setLocalTheme({ ...localTheme, secondaryColor: v })} label="DARK KNIGHT" c={c} />
            <ColorInput value={localTheme.backgroundColor} onChange={(v) => setLocalTheme({ ...localTheme, backgroundColor: v })} label="GOTHAM NIGHT" c={c} />
            <ColorInput value={localTheme.textColor} onChange={(v) => setLocalTheme({ ...localTheme, textColor: v })} label="MOONLIGHT" c={c} />
            <ColorInput value={localTheme.borderColor} onChange={(v) => setLocalTheme({ ...localTheme, borderColor: v })} label="GOTHAM SHADOW" c={c} />
            <ColorInput value={localTheme.successColor} onChange={(v) => setLocalTheme({ ...localTheme, successColor: v })} label="JUSTICE" c={c} />
          </div>
        </div>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.gold }}><Typography /> TYPOGRAPHY</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>GOTHAM FONT</label><Select value={localTheme.fontFamily} onChange={(v) => setLocalTheme({ ...localTheme, fontFamily: v })} options={[{ value: '"Roboto Condensed", sans-serif', label: 'Roboto Condensed' }, { value: 'Inter, sans-serif', label: 'Inter' }, { value: '"BatmanForever", sans-serif', label: 'Batman Forever' }]} c={c} /></div>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.gold }}><DarkMode /> APPEARANCE</h3><Toggle checked={localTheme.darkMode} onChange={(v) => setLocalTheme({ ...localTheme, darkMode: v })} label="GOTHAM NIGHT MODE" c={c} /></div>
        <div style={{ marginBottom: 32, padding: 24, borderRadius: parseInt(localTheme.borderRadius), border: `3px solid ${localTheme.gold}`, background: localTheme.backgroundColor, boxShadow: localTheme.boxShadowLg }}>
          <h3 style={{ color: localTheme.gold, fontFamily: localTheme.fontFamily }}>🦇 BAT-COMPUTER PREVIEW</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={{ backgroundColor: localTheme.primaryColor, color: '#0a0a0a', border: 'none', padding: '8px 20px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, fontWeight: 700, cursor: 'pointer' }}>BATMAN BUTTON</button>
            <button style={{ backgroundColor: 'transparent', color: localTheme.gold, border: `2px solid ${localTheme.gold}`, padding: '8px 20px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, fontWeight: 700, cursor: 'pointer' }}>OUTLINE</button>
          </div>
          <p style={{ color: localTheme.textColor, fontFamily: localTheme.fontFamily }}>&quot;I am vengeance. I am the night. I am Batman!&quot; — Bruce Wayne</p>
        </div>
        <BatmanButton onClick={applyTheme} loading={saving} icon="🦇">APPLY BAT-STYLE</BatmanButton>
      </div>
    );
  };

  const renderSystemTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.gold, letterSpacing: '0.05em' }}>⚡ BAT-SYSTEMS CONFIGURATION</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>GOTHAM TIMEZONE</label><Input value={aboutData.system.timezone} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, timezone: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>DATE FORMAT</label><Input value={aboutData.system.dateFormat} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, dateFormat: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>CURRENCY</label><Input value={aboutData.system.currency} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, currency: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>TRIAL PERIOD</label><input type="number" value={aboutData.system.trialDays} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, trialDays: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      </div>
      <BatmanDivider variant="bat" />
      <div style={{ marginTop: 24 }}><h3 style={{ marginBottom: 16, color: c.gold }}>SECURITY PROTOCOLS</h3>
        <Toggle checked={aboutData.system.enableRegistration} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableRegistration: v } }))} label="ALLOW REGISTRATION" c={c} />
        <Toggle checked={aboutData.system.enableTwoFactor} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableTwoFactor: v } }))} label="REQUIRE 2FA" c={c} />
        <Toggle checked={aboutData.system.maintenanceMode} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, maintenanceMode: v } }))} label="BATCAVE MAINTENANCE" c={c} />
      </div>
      <BatmanButton onClick={() => saveSection('system', aboutData.system)} loading={saving} icon="🦇">SAVE SYSTEM CONFIG</BatmanButton>
    </div>
  );

  const renderContent = () => {
    switch (tabs[activeTab]?.id) {
      case 'company': return renderCompanyTab();
      case 'contact': return renderContactTab();
      case 'social': return renderSocialTab();
      case 'labels': return renderLabelsTab();
      case 'seo': return renderSeoTab();
      case 'theme': return renderThemeTab();
      case 'system': return renderSystemTab();
      default: return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}><div style={{ width: 48, height: 48, border: `3px solid ${c.border}`, borderTopColor: c.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: c.inkSub }}>🦇 Initializing Batcomputer... 🦇</p></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '28px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><GoogleAMLogo size={40} darkMode={darkMode} /><h1 style={{ fontSize: 28, fontWeight: 800, color: c.gold, margin: 0, letterSpacing: '0.05em' }}>WAYNE ADMIN</h1></div><p style={{ color: c.inkSub }}>🦇 Managing Gotham&apos;s Finest Technology Stack</p></div>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface, color: c.ink, cursor: 'pointer', fontWeight: 500 }}><Refresh /> RELOAD DATA</button>
        </div>
        <BatmanCard variant="elevated"><div style={{ padding: 0 }}>
          <div style={{ display: 'flex', borderBottom: `2px solid ${c.border}`, padding: '0 16px', overflowX: 'auto', background: c.surface2 }}>
            {tabs.map((tab, i) => (<button key={i} onClick={() => setActiveTab(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', border: 'none', background: 'transparent', color: activeTab === i ? c.gold : c.inkSub, borderBottom: activeTab === i ? `3px solid ${c.gold}` : '3px solid transparent', cursor: 'pointer', fontWeight: activeTab === i ? 700 : 400, fontSize: 13, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{tab.icon} {tab.label}</button>))}
          </div>
          <div style={{ padding: isMobile ? 16 : 28 }}>{renderContent()}</div>
        </div></BatmanCard>
      </div>
      <BatmanToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </div>
  );
}