/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
// app/dp-admin-about/page.tsx (Deadpool Theme - COMPLETE)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery, Typography } from '@mui/material';
import { useDP } from '@/components/newUI/theme';
import { DPCard } from '@/components/newUI/DPCard';
import { DPButton } from '@/components/newUI/DPButton';
import { DPToast } from '@/components/newUI/DPToast';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import {
  Business, Email, Share, TextFields, Search, Palette, Settings,
  Refresh, 
  ColorLens, DarkMode,
} from '@mui/icons-material';

// Complete Types
interface AboutData {
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
    supportHours: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    github: string;
  };
  labels: Record<string, string>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    textSecondary: string;
    textMuted: string;
    borderColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
    infoColor: string;
    fontFamily: string;
    fontSizeBase: string;
    fontSizeLg: string;
    fontSizeSm: string;
    borderRadius: string;
    borderRadiusLg: string;
    borderRadiusSm: string;
    boxShadow: string;
    boxShadowLg: string;
    headerHeight: string;
    sidebarWidth: string;
    darkMode: boolean;
  };
  system: {
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    currencySymbol: string;
    language: string;
    defaultRole: string;
    defaultPlan: string;
    trialDays: number;
    sessionTimeout: number;
    itemsPerPage: number;
    enableRegistration: boolean;
    enableEmailVerification: boolean;
    enablePhoneVerification: boolean;
    enableTwoFactor: boolean;
    enableCaptcha: boolean;
    maintenanceMode: boolean;
  };
}

const defaultAboutData: AboutData = {
  companyName: 'Deadpool Inc.',
  companyDescription: 'Maximum Effort Business Solutions • Chimichanga Included',
  companyLogo: '',
  contact: {
    email: 'deadpool@maximumeffort.com',
    phone: '+1 (555) DP-4-LIFE',
    address: '123 Chimichanga Lane, New York, NY 10001',
    workingHours: 'Whenever I feel like it',
    supportHours: '24/7 (if I\'m not napping)',
  },
  socialMedia: {
    facebook: 'https://facebook.com/deadpool',
    twitter: 'https://twitter.com/deadpool',
    instagram: 'https://instagram.com/deadpool',
    linkedin: 'https://linkedin.com/in/deadpool',
    youtube: 'https://youtube.com/deadpool',
    github: 'https://github.com/deadpool',
  },
  labels: {
    home: 'Home Sweet Home',
    about: 'About Me',
    services: 'Services (I do it all)',
    contact: 'Contact (If you dare)',
    dashboard: 'My Dashboard',
    login: 'Sign In (No chin check)',
    register: 'Join the Chaos',
    logout: 'Peace Out',
    profile: 'My Sexy Profile',
    settings: 'Settings (Don\'t break it)',
    users: 'Fellow Misfits',
    products: 'Stuff I Sell',
    orders: 'Orders (Cha-ching!)',
    reports: 'Reports (Boring but necessary)',
  },
  seo: {
    metaTitle: 'Deadpool Corp - Maximum Effort Business Solutions',
    metaDescription: 'The best damn business platform this side of the fourth wall.',
    metaKeywords: ['deadpool', 'business', 'maximum', 'effort', 'chimichanga'],
    ogTitle: 'Deadpool Says: Use This Platform!',
    ogDescription: 'Seriously, it\'s awesome. Trust me. I\'m a superhero.',
    ogImage: 'https://deadpool.com/og-image.jpg',
  },
  theme: {
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
    accentColor: '#f97316',
    backgroundColor: '#0d0000',
    textColor: '#f5e0e0',
    textSecondary: '#b08080',
    textMuted: '#7a4040',
    borderColor: '#4a1010',
    successColor: '#4ade80',
    warningColor: '#fbbf24',
    errorColor: '#f87171',
    infoColor: '#dc2626',
    fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive, sans-serif',
    fontSizeBase: '14px',
    fontSizeLg: '16px',
    fontSizeSm: '12px',
    borderRadius: '12px',
    borderRadiusLg: '20px',
    borderRadiusSm: '8px',
    boxShadow: '0 4px 12px rgba(220,38,38,0.2)',
    boxShadowLg: '0 8px 24px rgba(220,38,38,0.3)',
    headerHeight: '64px',
    sidebarWidth: '250px',
    darkMode: true,
  },
  system: {
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    currency: 'USD',
    currencySymbol: '$',
    language: 'en',
    defaultRole: 'merc',
    defaultPlan: 'chimichanga',
    trialDays: 999,
    sessionTimeout: 9999,
    itemsPerPage: 20,
    enableRegistration: true,
    enableEmailVerification: false,
    enablePhoneVerification: false,
    enableTwoFactor: false,
    enableCaptcha: false,
    maintenanceMode: false,
  },
};

// Color Input Component
function ColorInput({ value, onChange, label, c: colors }: { value: string; onChange: (val: string) => void; label: string; c: any }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: colors.inkSub, marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 50, height: 40, borderRadius: 8, border: `2px solid ${colors.border}`, cursor: 'pointer', background: colors.surface2 }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `2px solid ${colors.border}`, background: colors.surface2, color: colors.ink, fontSize: 14 }} />
      </div>
    </div>
  );
}

// Select Component
function Select({ value, onChange, options, c }: { value: string; onChange: (val: string) => void; options: Array<{ value: string; label: string }>; c: any }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`,
      background: c.surface2, color: c.ink, fontSize: 14, outline: 'none', cursor: 'pointer',
      fontFamily: c.fontFamily,
    }}>
      {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
  );
}

// Toggle Component
function Toggle({ checked, onChange, label, c }: { checked: boolean; onChange: (val: boolean) => void; label: string; c: any }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${c.border}` }}>
      <span style={{ color: c.ink, fontWeight: 500 }}>{label}</span>
      <button onClick={() => onChange(!checked)} style={{
        width: 48, height: 24, borderRadius: 12, border: 'none', background: checked ? c.red : c.textMuted,
        cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
      }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 26 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

// Input Component
function Input({ value, onChange, placeholder, type = 'text', c }: { value: string; onChange: (val: string) => void; placeholder?: string; type?: string; c: any }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`,
      background: c.surface2, color: c.ink, fontSize: 14, outline: 'none',
    }} />
  );
}

export default function DpAdminAboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = useDP(darkMode);
  
  const [activeTab, setActiveTab] = useState(0);
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({
    open: false, msg: '', type: 'success',
  });

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ open: true, msg, type });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setAboutData(defaultAboutData);
      setLoading(false);
      showToast('Settings loaded! Maximum effort! 🦸', 'success');
    }, 800);
  }, []);

  const saveSection = useCallback(async (section: string, data: any) => {
    setSaving(true);
    setTimeout(() => {
      setAboutData(prev => ({ ...prev, [section]: { ...prev[section as keyof AboutData], ...data } }));
      setSaving(false);
      showToast(`${section} saved! Chimichanga time! 🌯`, 'success');
    }, 1000);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { id: 'company', label: 'Company', icon: <Business /> },
    { id: 'contact', label: 'Contact', icon: <Email /> },
    { id: 'social', label: 'Social', icon: <Share /> },
    { id: 'labels', label: 'Labels', icon: <TextFields /> },
    { id: 'seo', label: 'SEO', icon: <Search /> },
    { id: 'theme', label: 'Theme', icon: <Palette /> },
    { id: 'system', label: 'System', icon: <Settings /> },
  ];

  const renderCompanyTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>🦸 Company Information</h2>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Company Name</label><Input value={aboutData.companyName} onChange={(val) => setAboutData(prev => ({ ...prev, companyName: val }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Company Description</label><textarea value={aboutData.companyDescription} onChange={(e) => setAboutData(prev => ({ ...prev, companyDescription: e.target.value }))} rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} /></div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Company Logo URL</label><Input value={aboutData.companyLogo} onChange={(val) => setAboutData(prev => ({ ...prev, companyLogo: val }))} c={c} /></div>
      <DPButton onClick={() => saveSection('company', { companyName: aboutData.companyName, companyDescription: aboutData.companyDescription, companyLogo: aboutData.companyLogo })} loading={saving}>Save Changes 🦸</DPButton>
    </div>
  );

  const renderContactTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>📞 Contact Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Email</label><Input value={aboutData.contact.email} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, email: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Phone</label><Input value={aboutData.contact.phone} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, phone: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Working Hours</label><Input value={aboutData.contact.workingHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, workingHours: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Support Hours</label><Input value={aboutData.contact.supportHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, supportHours: val } }))} c={c} /></div>
      </div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Address</label><textarea value={aboutData.contact.address} onChange={(e) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <DPButton onClick={() => saveSection('contact', aboutData.contact)} loading={saving}>Save Contact Info 📞</DPButton>
    </div>
  );

  const renderSocialTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>📱 Social Media (Follow Me!)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {Object.entries(aboutData.socialMedia).map(([key, value]) => (<div key={key}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub, textTransform: 'capitalize' }}>{key}</label><Input value={value} onChange={(val) => setAboutData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [key]: val } }))} c={c} /></div>))}
      </div>
      <DPButton onClick={() => saveSection('socialMedia', aboutData.socialMedia)} loading={saving} >Save Social Links 📱</DPButton>
    </div>
  );

  const renderLabelsTab = () => {
    const filteredKeys = Object.keys(aboutData.labels).filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()) || aboutData.labels[key].toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>🏷️ UI Labels (Make it yours!)</h2>
        <div style={{ marginBottom: 20 }}><Input value={searchTerm} onChange={setSearchTerm} placeholder="🔍 Search labels..." c={c} /></div>
        <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
          {filteredKeys.map((key) => (<div key={key} style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: c.red, marginBottom: 4, textTransform: 'uppercase' }}>{key}</label><Input value={aboutData.labels[key]} onChange={(val) => setAboutData(prev => ({ ...prev, labels: { ...prev.labels, [key]: val } }))} c={c} /></div>))}
        </div>
        <DPButton onClick={() => saveSection('labels', aboutData.labels)} loading={saving}>Save Labels 🏷️</DPButton>
      </div>
    );
  };

  const renderSeoTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>🔍 SEO Settings (Get Found!)</h2>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Title</label><Input value={aboutData.seo.metaTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: val } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Description</label><textarea value={aboutData.seo.metaDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Keywords</label><Input value={aboutData.seo.metaKeywords.join(', ')} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaKeywords: val.split(',').map(s => s.trim()) } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Title</label><Input value={aboutData.seo.ogTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogTitle: val } }))} c={c} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Description</label><textarea value={aboutData.seo.ogDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Image URL</label><Input value={aboutData.seo.ogImage} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogImage: val } }))} c={c} /></div>
      <DPButton onClick={() => saveSection('seo', aboutData.seo)} loading={saving}>Save SEO Settings 🔍</DPButton>
    </div>
  );

  const renderThemeTab = () => {
    const [localTheme, setLocalTheme] = useState(aboutData.theme);
    const applyTheme = () => { setAboutData(prev => ({ ...prev, theme: localTheme })); saveSection('theme', localTheme); };
    return (
      <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>🎨 Theme Settings (Make it POP!)</h2>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.red }}><ColorLens /> Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0 24px' }}>
            <ColorInput value={localTheme.primaryColor} onChange={(v) => setLocalTheme({ ...localTheme, primaryColor: v })} label="Primary" c={c} />
            <ColorInput value={localTheme.secondaryColor} onChange={(v) => setLocalTheme({ ...localTheme, secondaryColor: v })} label="Secondary" c={c} />
            <ColorInput value={localTheme.accentColor} onChange={(v) => setLocalTheme({ ...localTheme, accentColor: v })} label="Accent" c={c} />
            <ColorInput value={localTheme.backgroundColor} onChange={(v) => setLocalTheme({ ...localTheme, backgroundColor: v })} label="Background" c={c} />
            <ColorInput value={localTheme.textColor} onChange={(v) => setLocalTheme({ ...localTheme, textColor: v })} label="Text" c={c} />
            <ColorInput value={localTheme.borderColor} onChange={(v) => setLocalTheme({ ...localTheme, borderColor: v })} label="Border" c={c} />
            <ColorInput value={localTheme.successColor} onChange={(v) => setLocalTheme({ ...localTheme, successColor: v })} label="Success" c={c} />
            <ColorInput value={localTheme.errorColor} onChange={(v) => setLocalTheme({ ...localTheme, errorColor: v })} label="Error" c={c} />
          </div>
        </div>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.red }}><Typography /> Typography</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Font Family</label><Select value={localTheme.fontFamily} onChange={(v) => setLocalTheme({ ...localTheme, fontFamily: v })} options={[{ value: '"Comic Sans MS", cursive', label: 'Comic Sans (Deadpool Special)' }, { value: 'Inter, sans-serif', label: 'Inter' }, { value: 'Roboto, sans-serif', label: 'Roboto' }]} c={c} /></div>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Base Font Size</label><Select value={localTheme.fontSizeBase} onChange={(v) => setLocalTheme({ ...localTheme, fontSizeBase: v })} options={[{ value: '12px', label: 'Small' }, { value: '14px', label: 'Normal' }, { value: '16px', label: 'Large' }]} c={c} /></div>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}><h3 style={{ marginBottom: 16, color: c.red }}><DarkMode /> Appearance</h3><Toggle checked={localTheme.darkMode} onChange={(v) => setLocalTheme({ ...localTheme, darkMode: v })} label="Dark Mode (Because I'm Batman... wait, wrong franchise)" c={c} /></div>
        {/* Live Preview */}
        <div style={{ marginBottom: 32, padding: 24, borderRadius: parseInt(localTheme.borderRadius), border: `3px solid ${localTheme.borderColor}`, background: localTheme.backgroundColor }}>
          <h3 style={{ color: localTheme.textColor, fontFamily: localTheme.fontFamily }}>🔥 Live Preview 🔥</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={{ backgroundColor: localTheme.primaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, cursor: 'pointer' }}>Deadpool Button</button>
            <button style={{ backgroundColor: localTheme.secondaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, cursor: 'pointer' }}>Chimichanga Button</button>
          </div>
          <p style={{ color: localTheme.textColor, fontFamily: localTheme.fontFamily }}>Maximum effort typography right here! 🦸</p>
          <p style={{ color: localTheme.textSecondary, fontFamily: localTheme.fontFamily, fontSize: localTheme.fontSizeSm }}>This is secondary text. Still awesome though.</p>
          <div style={{ padding: 12, background: localTheme.backgroundColor, border: `2px solid ${localTheme.borderColor}`, borderRadius: parseInt(localTheme.borderRadiusSm) }}>
            <span style={{ color: localTheme.successColor }}>✓ Success!</span> | <span style={{ color: localTheme.warningColor }}>⚠ Warning!</span> | <span style={{ color: localTheme.errorColor }}>✗ Error!</span>
          </div>
        </div>
        <DPButton onClick={applyTheme} loading={saving}>Apply Deadpool Theme 🦸</DPButton>
      </div>
    );
  };

  const renderSystemTab = () => (
    <div><h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: c.ink }}>⚙️ System Settings (Don&apos;t break it!)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Timezone</label><Input value={aboutData.system.timezone} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, timezone: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Date Format</label><Input value={aboutData.system.dateFormat} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, dateFormat: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Currency</label><Input value={aboutData.system.currency} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, currency: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Currency Symbol</label><Input value={aboutData.system.currencySymbol} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, currencySymbol: val } }))} c={c} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Trial Days</label><input type="number" value={aboutData.system.trialDays} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, trialDays: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Items Per Page</label><input type="number" value={aboutData.system.itemsPerPage} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, itemsPerPage: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      </div>
      <div style={{ marginTop: 24 }}><h3 style={{ marginBottom: 16, color: c.red }}>Feature Flags</h3>
        <Toggle checked={aboutData.system.enableRegistration} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableRegistration: v } }))} label="Enable Registration" c={c} />
        <Toggle checked={aboutData.system.enableTwoFactor} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableTwoFactor: v } }))} label="Enable 2FA" c={c} />
        <Toggle checked={aboutData.system.maintenanceMode} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, maintenanceMode: v } }))} label="Maintenance Mode (Site Offline)" c={c} />
      </div>
      <DPButton onClick={() => saveSection('system', aboutData.system)} loading={saving}>Save System Settings ⚙️</DPButton>
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
        <div style={{ textAlign: 'center' }}><div style={{ width: 48, height: 48, border: `3px solid ${c.border}`, borderTopColor: c.red, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: c.inkSub }}>Loading Maximum Effort Settings...</p></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '28px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><GoogleAMLogo size={40} darkMode={darkMode} /><h1 style={{ fontSize: 28, fontWeight: 800, color: c.ink, margin: 0 }}>Deadpool&apos;s Settings</h1></div><p style={{ color: c.inkSub }}>Maximum effort configuration panel • Chimichanga included</p></div>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: `2px solid ${c.border}`, background: c.surface, color: c.ink, cursor: 'pointer' }}><Refresh /> Refresh</button>
        </div>
        <DPCard><div style={{ padding: 0 }}>
          <div style={{ display: 'flex', borderBottom: `2px solid ${c.border}`, padding: '0 16px', overflowX: 'auto', background: c.surface2 }}>
            {tabs.map((tab, i) => (<button key={i} onClick={() => setActiveTab(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', border: 'none', background: 'transparent', color: activeTab === i ? c.red : c.inkSub, borderBottom: activeTab === i ? `3px solid ${c.red}` : '3px solid transparent', cursor: 'pointer', fontWeight: activeTab === i ? 700 : 400, whiteSpace: 'nowrap' }}>{tab.icon} {tab.label}</button>))}
          </div>
          <div style={{ padding: isMobile ? 16 : 28 }}>{renderContent()}</div>
        </div></DPCard>
      </div>
      <DPToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </div>
  );
}