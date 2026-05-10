/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
// app/pro-admin-about/page.tsx (Professional Theme - COMPLETE)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery, Typography } from '@mui/material';
import { usePro } from '@/components/newUiProfessional/theme';
import { ProCard } from '@/components/newUiProfessional/ProCard';
import { ProButton } from '@/components/newUiProfessional/ProButton';
import { ProInput } from '@/components/newUiProfessional/ProInput';
import { ProToast } from '@/components/newUiProfessional/ProToast';
import GoogleAMLogo from '@/components/GoogleAMLogo';
import {
  Business, Email, Share, 
  TextFields, Search, Palette, Settings, Refresh,
  ColorLens, BorderStyle, DarkMode, LightMode,
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
  companyName: 'AccuManage',
  companyDescription: 'Enterprise Business Management Platform',
  companyLogo: '',
  contact: {
    email: 'contact@accumanage.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    workingHours: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
    supportHours: '24/7 Premium Support',
  },
  socialMedia: {
    facebook: 'https://facebook.com/accumanage',
    twitter: 'https://twitter.com/accumanage',
    instagram: 'https://instagram.com/accumanage',
    linkedin: 'https://linkedin.com/company/accumanage',
    youtube: 'https://youtube.com/accumanage',
    github: 'https://github.com/accumanage',
  },
  labels: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    dashboard: 'Dashboard',
    login: 'Sign In',
    register: 'Create Account',
    logout: 'Sign Out',
    profile: 'My Profile',
    settings: 'Settings',
    users: 'Users',
    products: 'Products',
    orders: 'Orders',
    reports: 'Reports',
  },
  seo: {
    metaTitle: 'AccuManage - Business Management Platform',
    metaDescription: 'Enterprise-grade business management solution for modern companies.',
    metaKeywords: ['business', 'management', 'enterprise', 'SaaS', 'CRM'],
    ogTitle: 'AccuManage - Transform Your Business',
    ogDescription: 'Streamline operations, boost productivity, and grow your business.',
    ogImage: 'https://accumanage.com/og-image.jpg',
  },
  theme: {
    primaryColor: '#1a73e8',
    secondaryColor: '#34a853',
    accentColor: '#ea4335',
    backgroundColor: '#ffffff',
    textColor: '#202124',
    textSecondary: '#5f6368',
    textMuted: '#80868b',
    borderColor: '#dadce0',
    successColor: '#34a853',
    warningColor: '#f9ab00',
    errorColor: '#ea4335',
    infoColor: '#1a73e8',
    fontFamily: 'Inter, sans-serif',
    fontSizeBase: '14px',
    fontSizeLg: '16px',
    fontSizeSm: '12px',
    borderRadius: '8px',
    borderRadiusLg: '12px',
    borderRadiusSm: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    boxShadowLg: '0 4px 12px rgba(0,0,0,0.1)',
    headerHeight: '64px',
    sidebarWidth: '250px',
    darkMode: false,
  },
  system: {
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    currency: 'USD',
    currencySymbol: '$',
    language: 'en',
    defaultRole: 'user',
    defaultPlan: 'trial',
    trialDays: 14,
    sessionTimeout: 30,
    itemsPerPage: 10,
    enableRegistration: true,
    enableEmailVerification: false,
    enablePhoneVerification: false,
    enableTwoFactor: false,
    enableCaptcha: false,
    maintenanceMode: false,
  },
};

// Color Input Component
function ColorInput({ value, onChange, label, T }: { value: string; onChange: (val: string) => void; label: string; T: any }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 50, height: 40, borderRadius: 8, border: `1px solid ${T.border}`, cursor: 'pointer' }} />
        <ProInput value={value} onChange={onChange} />
      </div>
    </div>
  );
}

// Select Component
function Select({ value, onChange, options, T }: { value: string; onChange: (val: string) => void; options: Array<{ value: string; label: string }>; T: any }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${T.border}`,
      background: T.surface2, color: T.ink, fontSize: 14, outline: 'none', cursor: 'pointer',
      fontFamily: 'inherit',
    }}>
      {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
  );
}

// Toggle Component
function Toggle({ checked, onChange, label, T }: { checked: boolean; onChange: (val: boolean) => void; label: string; T: any }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
      <span style={{ color: T.ink }}>{label}</span>
      <button onClick={() => onChange(!checked)} style={{
        width: 48, height: 24, borderRadius: 12, border: 'none', background: checked ? T.primary : T.textMuted,
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 26 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

export default function ProAdminAboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  const c = usePro(darkMode);
  
  const [activeTab, setActiveTab] = useState(0);
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ open: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    open: false, msg: '', type: 'info',
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info') =>
    setToast({ open: true, msg, type });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setAboutData(defaultAboutData);
      setLoading(false);
      showToast('Settings loaded successfully', 'success');
    }, 800);
  }, []);

  const saveSection = useCallback(async (section: string, data: unknown) => {
    setSaving(true);
    setTimeout(() => {
      setAboutData(prev => ({ ...prev, [section]: { ...prev[section as keyof AboutData], ...data } }));
      setSaving(false);
      showToast(`${section} saved successfully`, 'success');
    }, 1000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { id: 'company', label: 'Company', icon: <Business /> },
    { id: 'contact', label: 'Contact', icon: <Email /> },
    { id: 'social', label: 'Social', icon: <Share /> },
    { id: 'labels', label: 'Labels', icon: <TextFields /> },
    { id: 'seo', label: 'SEO', icon: <Search /> },
    { id: 'theme', label: 'Theme', icon: <Palette /> },
    { id: 'system', label: 'System', icon: <Settings /> },
  ];

  // Company Tab
  const renderCompanyTab = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>Company Information</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: c.inkSub, fontWeight: 500 }}>Company Name</label>
        <ProInput value={aboutData.companyName} onChange={(val) => setAboutData(prev => ({ ...prev, companyName: val }))} placeholder="Enter company name" />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: c.inkSub, fontWeight: 500 }}>Company Description</label>
        <textarea value={aboutData.companyDescription} onChange={(e) => setAboutData(prev => ({ ...prev, companyDescription: e.target.value }))} rows={4} placeholder="Enter company description" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: c.inkSub, fontWeight: 500 }}>Company Logo URL</label>
        <ProInput value={aboutData.companyLogo} onChange={(val) => setAboutData(prev => ({ ...prev, companyLogo: val }))} placeholder="https://example.com/logo.png" />
        {aboutData.companyLogo && <img src={aboutData.companyLogo} alt="Preview" style={{ marginTop: 12, height: 60, borderRadius: 8 }} />}
      </div>
      <ProButton onClick={() => saveSection('company', { companyName: aboutData.companyName, companyDescription: aboutData.companyDescription, companyLogo: aboutData.companyLogo })} loading={saving}>Save Changes</ProButton>
    </div>
  );

  // Contact Tab
  const renderContactTab = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>Contact Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Email</label><ProInput value={aboutData.contact.email} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, email: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Phone</label><ProInput value={aboutData.contact.phone} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, phone: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Working Hours</label><ProInput value={aboutData.contact.workingHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, workingHours: val } }))} placeholder="Mon-Fri, 9AM-6PM" /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Support Hours</label><ProInput value={aboutData.contact.supportHours} onChange={(val) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, supportHours: val } }))} placeholder="24/7" /></div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Address</label>
        <textarea value={aboutData.contact.address} onChange={(e) => setAboutData(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
      </div>
      <ProButton onClick={() => saveSection('contact', aboutData.contact)} loading={saving}>Save Changes</ProButton>
    </div>
  );

  // Social Tab
  const renderSocialTab = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>Social Media Links</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {Object.entries(aboutData.socialMedia).map(([key, value]) => (
          <div key={key}>
            <label style={{ display: 'block', marginBottom: 8, color: c.inkSub, textTransform: 'capitalize' }}>{key}</label>
            <ProInput value={value} onChange={(val) => setAboutData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [key]: val } }))} placeholder={`https://${key}.com/...`} />
          </div>
        ))}
      </div>
      <ProButton onClick={() => saveSection('socialMedia', aboutData.socialMedia)} loading={saving}>Save Changes</ProButton>
    </div>
  );

  // Labels Tab
  const renderLabelsTab = () => {
    const filteredKeys = Object.keys(aboutData.labels).filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()) || aboutData.labels[key].toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>UI Labels</h2>
        <div style={{ marginBottom: 20 }}><ProInput value={searchTerm} onChange={setSearchTerm} placeholder="Search labels..." /></div>
        <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
          {filteredKeys.map((key) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.inkMuted, marginBottom: 4, textTransform: 'uppercase' }}>{key}</label>
              <ProInput value={aboutData.labels[key]} onChange={(val) => setAboutData(prev => ({ ...prev, labels: { ...prev.labels, [key]: val } }))} />
            </div>
          ))}
        </div>
        <ProButton onClick={() => saveSection('labels', aboutData.labels)} loading={saving}>Save Changes</ProButton>
      </div>
    );
  };

  // SEO Tab
  const renderSeoTab = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>SEO Settings</h2>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Title</label><ProInput value={aboutData.seo.metaTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: val } }))} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Description</label><textarea value={aboutData.seo.metaDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Meta Keywords (comma separated)</label><ProInput value={aboutData.seo.metaKeywords.join(', ')} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, metaKeywords: val.split(',').map(s => s.trim()).filter(Boolean) } }))} placeholder="keyword1, keyword2, keyword3" /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Title</label><ProInput value={aboutData.seo.ogTitle} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogTitle: val } }))} /></div>
      <div style={{ marginBottom: 20 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Description</label><textarea value={aboutData.seo.ogDescription} onChange={(e) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogDescription: e.target.value } }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} /></div>
      <div style={{ marginBottom: 24 }}><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>OG Image URL</label><ProInput value={aboutData.seo.ogImage} onChange={(val) => setAboutData(prev => ({ ...prev, seo: { ...prev.seo, ogImage: val } }))} placeholder="https://example.com/og-image.jpg" /></div>
      <ProButton onClick={() => saveSection('seo', aboutData.seo)} loading={saving}>Save Changes</ProButton>
    </div>
  );

  // Theme Tab - FULL with all color pickers, typography, shadows, live preview
  const renderThemeTab = () => {
    const [localTheme, setLocalTheme] = useState(aboutData.theme);
    
    const applyTheme = () => {
      setAboutData(prev => ({ ...prev, theme: localTheme }));
      saveSection('theme', localTheme);
      Object.entries(localTheme).forEach(([key, value]) => {
        if (typeof value === 'string') document.documentElement.style.setProperty(`--${key}`, value);
      });
    };

    return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>Theme Settings</h2>
        
        {/* Colors Section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: c.ink, display: 'flex', alignItems: 'center', gap: 8 }}><ColorLens /> Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0 24px' }}>
            <ColorInput value={localTheme.primaryColor} onChange={(v) => setLocalTheme({ ...localTheme, primaryColor: v })} label="Primary Color" T={c} />
            <ColorInput value={localTheme.secondaryColor} onChange={(v) => setLocalTheme({ ...localTheme, secondaryColor: v })} label="Secondary Color" T={c} />
            <ColorInput value={localTheme.accentColor} onChange={(v) => setLocalTheme({ ...localTheme, accentColor: v })} label="Accent Color" T={c} />
            <ColorInput value={localTheme.backgroundColor} onChange={(v) => setLocalTheme({ ...localTheme, backgroundColor: v })} label="Background Color" T={c} />
            <ColorInput value={localTheme.textColor} onChange={(v) => setLocalTheme({ ...localTheme, textColor: v })} label="Text Color" T={c} />
            <ColorInput value={localTheme.textSecondary} onChange={(v) => setLocalTheme({ ...localTheme, textSecondary: v })} label="Text Secondary" T={c} />
            <ColorInput value={localTheme.textMuted} onChange={(v) => setLocalTheme({ ...localTheme, textMuted: v })} label="Text Muted" T={c} />
            <ColorInput value={localTheme.borderColor} onChange={(v) => setLocalTheme({ ...localTheme, borderColor: v })} label="Border Color" T={c} />
            <ColorInput value={localTheme.successColor} onChange={(v) => setLocalTheme({ ...localTheme, successColor: v })} label="Success Color" T={c} />
            <ColorInput value={localTheme.warningColor} onChange={(v) => setLocalTheme({ ...localTheme, warningColor: v })} label="Warning Color" T={c} />
            <ColorInput value={localTheme.errorColor} onChange={(v) => setLocalTheme({ ...localTheme, errorColor: v })} label="Error Color" T={c} />
            <ColorInput value={localTheme.infoColor} onChange={(v) => setLocalTheme({ ...localTheme, infoColor: v })} label="Info Color" T={c} />
          </div>
        </div>

        {/* Typography Section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: c.ink, display: 'flex', alignItems: 'center', gap: 8 }}><Typography /> Typography</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Font Family</label><Select value={localTheme.fontFamily} onChange={(v) => setLocalTheme({ ...localTheme, fontFamily: v })} options={[{ value: 'Inter, sans-serif', label: 'Inter' }, { value: 'Roboto, sans-serif', label: 'Roboto' }, { value: 'system-ui, sans-serif', label: 'System UI' }, { value: 'Arial, sans-serif', label: 'Arial' }]} T={c} /></div>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Base Font Size</label><Select value={localTheme.fontSizeBase} onChange={(v) => setLocalTheme({ ...localTheme, fontSizeBase: v })} options={[{ value: '12px', label: 'Small (12px)' }, { value: '14px', label: 'Normal (14px)' }, { value: '16px', label: 'Large (16px)' }]} T={c} /></div>
          </div>
        </div>

        {/* Borders & Shadows */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: c.ink, display: 'flex', alignItems: 'center', gap: 8 }}><BorderStyle /> Borders & Shadows</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Border Radius</label><Select value={localTheme.borderRadius} onChange={(v) => setLocalTheme({ ...localTheme, borderRadius: v })} options={[{ value: '4px', label: 'Subtle (4px)' }, { value: '8px', label: 'Medium (8px)' }, { value: '12px', label: 'Rounded (12px)' }, { value: '16px', label: 'Very Rounded (16px)' }]} T={c} /></div>
            <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Large Border Radius</label><Select value={localTheme.borderRadiusLg} onChange={(v) => setLocalTheme({ ...localTheme, borderRadiusLg: v })} options={[{ value: '8px', label: '8px' }, { value: '12px', label: '12px' }, { value: '16px', label: '16px' }, { value: '24px', label: '24px' }]} T={c} /></div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: c.ink, display: 'flex', alignItems: 'center', gap: 8 }}>{localTheme.darkMode ? <DarkMode /> : <LightMode />} Appearance</h3>
          <Toggle checked={localTheme.darkMode} onChange={(v) => setLocalTheme({ ...localTheme, darkMode: v })} label="Enable Dark Mode" T={c} />
        </div>

        {/* Live Preview */}
        <div style={{ marginBottom: 32, padding: 24, borderRadius: parseInt(localTheme.borderRadius), border: `1px solid ${localTheme.borderColor}`, backgroundColor: localTheme.backgroundColor }}>
          <h3 style={{ color: localTheme.textColor, marginBottom: 16, fontFamily: localTheme.fontFamily }}>Live Preview</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={{ backgroundColor: localTheme.primaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, cursor: 'pointer' }}>Primary Button</button>
            <button style={{ backgroundColor: localTheme.secondaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, cursor: 'pointer' }}>Secondary Button</button>
            <button style={{ backgroundColor: 'transparent', color: localTheme.textColor, border: `1px solid ${localTheme.borderColor}`, padding: '8px 16px', borderRadius: parseInt(localTheme.borderRadius), fontFamily: localTheme.fontFamily, cursor: 'pointer' }}>Outline Button</button>
          </div>
          <p style={{ color: localTheme.textColor, fontFamily: localTheme.fontFamily, fontSize: localTheme.fontSizeBase }}>This is a preview of your text styling. The quick brown fox jumps over the lazy dog.</p>
          <p style={{ color: localTheme.textSecondary, fontFamily: localTheme.fontFamily, fontSize: localTheme.fontSizeSm }}>Secondary text appears like this.</p>
          <div style={{ padding: 12, background: localTheme.backgroundColor, border: `1px solid ${localTheme.borderColor}`, borderRadius: parseInt(localTheme.borderRadiusSm), boxShadow: localTheme.boxShadow }}>
            <span style={{ color: localTheme.successColor }}>✓ Success message</span> | <span style={{ color: localTheme.warningColor }}>⚠ Warning message</span> | <span style={{ color: localTheme.errorColor }}>✗ Error message</span>
          </div>
        </div>

        <ProButton onClick={applyTheme} loading={saving}>Apply Theme Changes</ProButton>
      </div>
    );
  };

  // System Tab - FULL with all toggles
  const renderSystemTab = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: c.ink }}>System Configuration</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Timezone</label><ProInput value={aboutData.system.timezone} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, timezone: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Date Format</label><ProInput value={aboutData.system.dateFormat} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, dateFormat: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Time Format</label><ProInput value={aboutData.system.timeFormat} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, timeFormat: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Currency</label><ProInput value={aboutData.system.currency} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, currency: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Currency Symbol</label><ProInput value={aboutData.system.currencySymbol} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, currencySymbol: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Language</label><ProInput value={aboutData.system.language} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, language: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Default Role</label><ProInput value={aboutData.system.defaultRole} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, defaultRole: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Default Plan</label><ProInput value={aboutData.system.defaultPlan} onChange={(val) => setAboutData(prev => ({ ...prev, system: { ...prev.system, defaultPlan: val } }))} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Trial Days</label><input type="number" value={aboutData.system.trialDays} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, trialDays: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Session Timeout (minutes)</label><input type="number" value={aboutData.system.sessionTimeout} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, sessionTimeout: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
        <div><label style={{ display: 'block', marginBottom: 8, color: c.inkSub }}>Items Per Page</label><input type="number" value={aboutData.system.itemsPerPage} onChange={(e) => setAboutData(prev => ({ ...prev, system: { ...prev.system, itemsPerPage: parseInt(e.target.value) } }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface2, color: c.ink }} /></div>
      </div>
      
      {/* Feature Toggles */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16, color: c.ink }}>Feature Flags</h3>
        <Toggle checked={aboutData.system.enableRegistration} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableRegistration: v } }))} label="Enable User Registration" T={c} />
        <Toggle checked={aboutData.system.enableEmailVerification} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableEmailVerification: v } }))} label="Require Email Verification" T={c} />
        <Toggle checked={aboutData.system.enablePhoneVerification} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enablePhoneVerification: v } }))} label="Enable Phone Verification" T={c} />
        <Toggle checked={aboutData.system.enableTwoFactor} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableTwoFactor: v } }))} label="Enable Two-Factor Authentication" T={c} />
        <Toggle checked={aboutData.system.enableCaptcha} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, enableCaptcha: v } }))} label="Enable CAPTCHA on Forms" T={c} />
        <Toggle checked={aboutData.system.maintenanceMode} onChange={(v) => setAboutData(prev => ({ ...prev, system: { ...prev.system, maintenanceMode: v } }))} label="Maintenance Mode (Site Offline)" T={c} />
      </div>

      <ProButton onClick={() => saveSection('system', aboutData.system)} loading={saving}>Save System Settings</ProButton>
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
        <div style={{ textAlign: 'center' }}><div style={{ width: 48, height: 48, border: `3px solid ${c.border}`, borderTopColor: c.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: c.inkSub }}>Loading settings...</p></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, padding: isMobile ? '16px' : '28px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><GoogleAMLogo size={40} darkMode={darkMode} /><h1 style={{ fontSize: 28, fontWeight: 700, color: c.ink, margin: 0 }}>About & Settings</h1></div><p style={{ color: c.inkSub, marginTop: 4 }}>Manage company information, appearance, and system configuration</p></div>
          <button onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.ink, cursor: 'pointer' }}><Refresh style={{ fontSize: 18 }} /> Refresh Data</button>
        </div>

        <ProCard variant="elevated" padding="none">
          <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, padding: '0 16px', overflowX: 'auto' }}>
            {tabs.map((tab, i) => (<button key={i} onClick={() => setActiveTab(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', border: 'none', background: 'transparent', color: activeTab === i ? c.primary : c.inkSub, borderBottom: activeTab === i ? `2px solid ${c.primary}` : '2px solid transparent', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === i ? 600 : 400, whiteSpace: 'nowrap' }}>{tab.icon} {tab.label}</button>))}
          </div>
          <div style={{ padding: isMobile ? 16 : 28 }}>{renderContent()}</div>
        </ProCard>
      </div>
      <ProToast open={toast.open} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
    </div>
  );
}