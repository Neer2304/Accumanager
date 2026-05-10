// app/admin/about/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { 
  updateSection, 
  setActiveSection, 
  setLoading, 
  setSaving, 
  setError, 
  setSuccess,
  clearMessages,
  setAboutData,
  updateLabel
} from '@/store/slices/adminAboutSlice'
import { AdminAboutService } from '@/services/adminAboutService'
import { AboutSection, About, ContactInfo, SocialMedia, Labels, SEO, Theme, System } from '@/types/about'

// Google Material Design colors
const COLORS = {
  blue: '#1a73e8',
  blueSoft: 'rgba(26,115,232,0.09)',
  green: '#1e8e3e',
  greenSoft: 'rgba(30,142,62,0.09)',
  yellow: '#f9ab00',
  yellowSoft: 'rgba(249,171,0,0.11)',
  red: '#d93025',
  redSoft: 'rgba(217,48,37,0.09)',
}

// Icons
const Icons = {
  building: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  contacts: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 0H4v2h16V0zm0 4H4v2h16V4zM4 22h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zm8-12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm-6 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/></svg>,
  share: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>,
  text: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>,
  search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  palette: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>,
  save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>,
  refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  warn: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
  close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
}

// Toast Component
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = { success: COLORS.green, error: COLORS.red, info: COLORS.blue }
  const Icon = { success: Icons.check, error: Icons.warn, info: Icons.info }

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
      borderRadius: 8, background: colors[type], color: '#fff', zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {/* <Icon /> {msg} */}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>
        <Icons.close />
      </button>
    </div>
  )
}

// Theme Tokens
function getThemeTokens(dark: boolean) {
  return dark ? {
    bg: '#202124', bgSurface: '#1c1e22', border: '#3c4043',
    text: '#e8eaed', textSecondary: '#9aa0a6', textMuted: '#5f6368',
    inputBg: '#26282c', inputBorder: '#3c4043',
  } : {
    bg: '#f8f9fa', bgSurface: '#ffffff', border: '#e8eaed',
    text: '#202124', textSecondary: '#5f6368', textMuted: '#80868b',
    inputBg: '#ffffff', inputBorder: '#dadce0',
  }
}

// Input Component
function Input({ value, onChange, placeholder, type = 'text', T }: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  T: ReturnType<typeof getThemeTokens>
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: `1px solid ${T.inputBorder}`, background: T.inputBg,
        color: T.text, fontSize: 14, outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = COLORS.blue}
      onBlur={(e) => e.currentTarget.style.borderColor = T.inputBorder}
    />
  )
}

// TextArea Component
function TextArea({ value, onChange, placeholder, rows = 3, T }: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  T: ReturnType<typeof getThemeTokens>
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: `1px solid ${T.inputBorder}`, background: T.inputBg,
        color: T.text, fontSize: 14, outline: 'none', fontFamily: 'inherit',
        resize: 'vertical',
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = COLORS.blue}
      onBlur={(e) => e.currentTarget.style.borderColor = T.inputBorder}
    />
  )
}

// Select Component
function Select({ value, onChange, options, T }: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  T: ReturnType<typeof getThemeTokens>
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: `1px solid ${T.inputBorder}`, background: T.inputBg,
        color: T.text, fontSize: 14, outline: 'none', cursor: 'pointer',
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = COLORS.blue}
      onBlur={(e) => e.currentTarget.style.borderColor = T.inputBorder}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

// Toggle Component
function Toggle({ checked, onChange, label, T }: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  T: ReturnType<typeof getThemeTokens>
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
      <span style={{ color: T.text }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 48, height: 24, borderRadius: 12, border: 'none',
          background: checked ? COLORS.blue : T.textMuted, cursor: 'pointer',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: checked ? 26 : 2,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

// Color Input Component
function ColorInput({ value, onChange, label, T }: {
  value: string
  onChange: (value: string) => void
  label: string
  T: ReturnType<typeof getThemeTokens>
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 50, height: 40, borderRadius: 8, border: `1px solid ${T.border}`, cursor: 'pointer' }}
        />
        <Input value={value} onChange={onChange} T={T} />
      </div>
    </div>
  )
}

// Company Tab
function CompanyTab({ data, onSave, saving, T }: {
  data: Pick<About, 'companyName' | 'companyDescription' | 'companyLogo'>
  onSave: (data: Partial<Pick<About, 'companyName' | 'companyDescription' | 'companyLogo'>>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    companyName: data?.companyName || '',
    companyDescription: data?.companyDescription || '',
    companyLogo: data?.companyLogo || '',
  })

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>Company Information</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary, fontWeight: 500 }}>Company Name</label>
        <Input value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary, fontWeight: 500 }}>Company Description</label>
        <TextArea value={form.companyDescription} onChange={(v) => setForm({ ...form, companyDescription: v })} T={T} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary, fontWeight: 500 }}>Company Logo URL</label>
        <Input value={form.companyLogo} onChange={(v) => setForm({ ...form, companyLogo: v })} T={T} />
        {form.companyLogo && (
          <img src={form.companyLogo} alt="Preview" style={{ marginTop: 12, height: 60, borderRadius: 8 }} />
        )}
      </div>
      <button
        onClick={() => onSave(form)}
        disabled={saving}
        style={{ padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// Contact Tab
function ContactTab({ data, onSave, saving, T }: {
  data: ContactInfo
  onSave: (data: Partial<ContactInfo>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    email: data?.email || '',
    phone: data?.phone || '',
    address: data?.address || '',
    workingHours: data?.workingHours || '',
    supportHours: data?.supportHours || '',
  })

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>Contact Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Email</label>
          <Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} T={T} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Phone</label>
          <Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} T={T} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Working Hours</label>
        <Input value={form.workingHours} onChange={(v) => setForm({ ...form, workingHours: v })} placeholder="Mon-Fri, 9AM-6PM" T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Support Hours</label>
        <Input value={form.supportHours} onChange={(v) => setForm({ ...form, supportHours: v })} placeholder="24/7" T={T} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Address</label>
        <TextArea value={form.address} onChange={(v) => setForm({ ...form, address: v })} T={T} />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// Social Tab
function SocialTab({ data, onSave, saving, T }: {
  data: SocialMedia
  onSave: (data: Partial<SocialMedia>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    facebook: data?.facebook || '',
    twitter: data?.twitter || '',
    instagram: data?.instagram || '',
    linkedin: data?.linkedin || '',
    youtube: data?.youtube || '',
    github: data?.github || '',
  })

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>Social Media</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary, textTransform: 'capitalize' }}>{key}</label>
            <Input value={value} onChange={(v) => setForm({ ...form, [key]: v })} placeholder={`https://${key}.com/...`} T={T} />
          </div>
        ))}
      </div>
      <button onClick={() => onSave(form)} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// Labels Tab
function LabelsTab({ data, onSave, saving, T }: {
  data: Labels
  onSave: (data: Partial<Labels>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState<Partial<Labels>>(data || {})
  const [search, setSearch] = useState('')

  const filteredKeys = Object.keys(form).filter(key =>
    key.toLowerCase().includes(search.toLowerCase()) ||
    String(form[key]).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>UI Labels</h2>
      <div style={{ marginBottom: 20 }}>
        <Input value={search} onChange={setSearch} placeholder="Search labels..." T={T} />
      </div>
      <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
        {filteredKeys.slice(0, 20).map((key) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>{key}</label>
            <Input value={form[key] || ''} onChange={(v) => setForm({ ...form, [key]: v })} T={T} />
          </div>
        ))}
      </div>
      <button onClick={() => onSave(form)} disabled={saving} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// SEO Tab
function SeoTab({ data, onSave, saving, T }: {
  data: SEO
  onSave: (data: Partial<SEO>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    metaTitle: data?.metaTitle || '',
    metaDescription: data?.metaDescription || '',
    metaKeywords: data?.metaKeywords?.join(', ') || '',
    ogTitle: data?.ogTitle || '',
    ogDescription: data?.ogDescription || '',
    ogImage: data?.ogImage || '',
  })

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>SEO Settings</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Meta Title</label>
        <Input value={form.metaTitle} onChange={(v) => setForm({ ...form, metaTitle: v })} T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Meta Description</label>
        <TextArea value={form.metaDescription} onChange={(v) => setForm({ ...form, metaDescription: v })} T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Meta Keywords</label>
        <Input value={form.metaKeywords} onChange={(v) => setForm({ ...form, metaKeywords: v })} placeholder="keyword1, keyword2, keyword3" T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>OG Title</label>
        <Input value={form.ogTitle} onChange={(v) => setForm({ ...form, ogTitle: v })} T={T} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>OG Description</label>
        <TextArea value={form.ogDescription} onChange={(v) => setForm({ ...form, ogDescription: v })} T={T} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>OG Image URL</label>
        <Input value={form.ogImage} onChange={(v) => setForm({ ...form, ogImage: v })} T={T} />
      </div>
      <button onClick={() => onSave({ ...form, metaKeywords: form.metaKeywords.split(',').map(s => s.trim()).filter(Boolean) })} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// Theme Tab
// In app/admin/about/page.tsx - Updated ThemeTab
function ThemeTab({ data, onSave, saving, T }: {
  data: Theme
  onSave: (data: Partial<Theme>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    // Colors
    primaryColor: data?.primaryColor || '#1a73e8',
    secondaryColor: data?.secondaryColor || '#34a853',
    accentColor: data?.accentColor || '#ea4335',
    backgroundColor: data?.backgroundColor || '#ffffff',
    textColor: data?.textColor || '#202124',
    textSecondary: data?.textSecondary || '#5f6368',
    textMuted: data?.textMuted || '#80868b',
    borderColor: data?.borderColor || '#e8eaed',
    successColor: data?.successColor || '#34a853',
    warningColor: data?.warningColor || '#f9ab00',
    errorColor: data?.errorColor || '#ea4335',
    infoColor: data?.infoColor || '#1a73e8',
    
    // Typography
    fontFamily: data?.fontFamily || 'Inter, sans-serif',
    fontSizeBase: data?.fontSizeBase || '14px',
    fontSizeLg: data?.fontSizeLg || '16px',
    fontSizeSm: data?.fontSizeSm || '12px',
    
    // Spacing
    borderRadius: data?.borderRadius || '8px',
    borderRadiusLg: data?.borderRadiusLg || '12px',
    borderRadiusSm: data?.borderRadiusSm || '4px',
    
    // Shadows
    boxShadow: data?.boxShadow || '0 1px 2px rgba(0,0,0,0.05)',
    boxShadowLg: data?.boxShadowLg || '0 4px 12px rgba(0,0,0,0.1)',
    
    // Layout
    headerHeight: data?.headerHeight || '64px',
    sidebarWidth: data?.sidebarWidth || '250px',
    
    darkMode: data?.darkMode || false,
  })

  const handleSave = async () => {
    await onSave(form)
    // Apply theme changes immediately
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style.setProperty(`--${key}`, value)
      }
    })
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>Theme Settings</h2>
      
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: T.text }}>Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
          <ColorInput value={form.primaryColor} onChange={(v) => setForm({ ...form, primaryColor: v })} label="Primary Color" T={T} />
          <ColorInput value={form.secondaryColor} onChange={(v) => setForm({ ...form, secondaryColor: v })} label="Secondary Color" T={T} />
          <ColorInput value={form.accentColor} onChange={(v) => setForm({ ...form, accentColor: v })} label="Accent Color" T={T} />
          <ColorInput value={form.backgroundColor} onChange={(v) => setForm({ ...form, backgroundColor: v })} label="Background Color" T={T} />
          <ColorInput value={form.textColor} onChange={(v) => setForm({ ...form, textColor: v })} label="Text Color" T={T} />
          <ColorInput value={form.borderColor} onChange={(v) => setForm({ ...form, borderColor: v })} label="Border Color" T={T} />
          <ColorInput value={form.successColor} onChange={(v) => setForm({ ...form, successColor: v })} label="Success Color" T={T} />
          <ColorInput value={form.errorColor} onChange={(v) => setForm({ ...form, errorColor: v })} label="Error Color" T={T} />
        </div>
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: T.text }}>Typography</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Font Family</label>
            <Select value={form.fontFamily} onChange={(v) => setForm({ ...form, fontFamily: v })} options={[
              { value: 'Inter, sans-serif', label: 'Inter' },
              { value: 'Roboto, sans-serif', label: 'Roboto' },
              { value: 'system-ui, sans-serif', label: 'System UI' },
              { value: 'Arial, sans-serif', label: 'Arial' },
            ]} T={T} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Base Font Size</label>
            <Select value={form.fontSizeBase} onChange={(v) => setForm({ ...form, fontSizeBase: v })} options={[
              { value: '12px', label: 'Small (12px)' },
              { value: '14px', label: 'Normal (14px)' },
              { value: '16px', label: 'Large (16px)' },
            ]} T={T} />
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: T.text }}>Layout</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Border Radius</label>
            <Select value={form.borderRadius} onChange={(v) => setForm({ ...form, borderRadius: v })} options={[
              { value: '4px', label: 'Subtle (4px)' },
              { value: '8px', label: 'Medium (8px)' },
              { value: '12px', label: 'Rounded (12px)' },
              { value: '16px', label: 'Very Rounded (16px)' },
            ]} T={T} />
          </div>
          <Toggle checked={form.darkMode} onChange={(v) => setForm({ ...form, darkMode: v })} label="Enable Dark Mode" T={T} />
        </div>
      </div>
      
      {/* Live Preview */}
      <div style={{ 
        marginBottom: 24, 
        padding: 20, 
        borderRadius: parseInt(form.borderRadius),
        border: `1px solid ${form.borderColor}`,
        backgroundColor: form.backgroundColor
      }}>
        <h3 style={{ color: form.textColor, marginBottom: 12 }}>Live Preview</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button style={{ backgroundColor: form.primaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(form.borderRadius) }}>
            Primary Button
          </button>
          <button style={{ backgroundColor: form.secondaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: parseInt(form.borderRadius) }}>
            Secondary Button
          </button>
          <p style={{ color: form.textColor, fontFamily: form.fontFamily, fontSize: form.fontSizeBase }}>
            This is a preview of your text styling.
          </p>
        </div>
      </div>
      
      <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Apply Theme'}
      </button>
    </div>
  )
}

// System Tab
function SystemTab({ data, onSave, saving, T }: {
  data: System
  onSave: (data: Partial<System>) => Promise<void>
  saving: boolean
  T: ReturnType<typeof getThemeTokens>
}) {
  const [form, setForm] = useState({
    timezone: data?.timezone || 'UTC',
    dateFormat: data?.dateFormat || 'MM/DD/YYYY',
    timeFormat: data?.timeFormat || 'hh:mm A',
    currency: data?.currency || 'USD',
    currencySymbol: data?.currencySymbol || '$',
    language: data?.language || 'en',
    defaultRole: data?.defaultRole || 'user',
    defaultPlan: data?.defaultPlan || 'trial',
    trialDays: data?.trialDays || 14,
    sessionTimeout: data?.sessionTimeout || 30,
    itemsPerPage: data?.itemsPerPage || 10,
    enableRegistration: data?.enableRegistration || true,
    enableEmailVerification: data?.enableEmailVerification || false,
    enablePhoneVerification: data?.enablePhoneVerification || false,
    enableTwoFactor: data?.enableTwoFactor || false,
    enableCaptcha: data?.enableCaptcha || false,
    maintenanceMode: data?.maintenanceMode || false,
  })

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: T.text }}>System Configuration</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Timezone</label>
          <Select value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} options={[
            { value: 'UTC', label: 'UTC' },
            { value: 'Asia/Kolkata', label: 'IST (India)' },
            { value: 'America/New_York', label: 'EST (New York)' },
          ]} T={T} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Language</label>
          <Select value={form.language} onChange={(v) => setForm({ ...form, language: v })} options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'es', label: 'Spanish' },
          ]} T={T} />
        </div>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Currency</label>
        <Input value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} T={T} />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, color: T.textSecondary }}>Currency Symbol</label>
        <Input value={form.currencySymbol} onChange={(v) => setForm({ ...form, currencySymbol: v })} T={T} />
      </div>
      
      <Toggle checked={form.enableRegistration} onChange={(v) => setForm({ ...form, enableRegistration: v })} label="Enable Registration" T={T} />
      <Toggle checked={form.enableEmailVerification} onChange={(v) => setForm({ ...form, enableEmailVerification: v })} label="Require Email Verification" T={T} />
      <Toggle checked={form.maintenanceMode} onChange={(v) => setForm({ ...form, maintenanceMode: v })} label="Maintenance Mode" T={T} />
      
      <button onClick={() => onSave(form)} disabled={saving} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 8, background: COLORS.blue, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

// Main Page Component
export default function AdminAboutPage() {
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'
  const T = getThemeTokens(dark)
  
  const dispatch = useAppDispatch()
  const { data: aboutData, loading, saving, error, success, activeSection } = useAppSelector((state) => state.adminAbout)
  
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
    if (type === 'success') dispatch(setSuccess(msg))
    if (type === 'error') dispatch(setError(msg))
    setTimeout(() => {
      setToast(null)
      dispatch(clearMessages())
    }, 4000)
  }, [dispatch])

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const data = await AdminAboutService.getAboutData()
      dispatch(setAboutData(data))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      showToast(errorMessage, 'error')
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, showToast])

  const saveSection = useCallback(async (section: AboutSection, data: Partial<About>[keyof About]) => {
    try {
      dispatch(setSaving(true))
      await AdminAboutService.updateSection(section, data as Record<string, unknown>)
      dispatch(updateSection({ section, data }))
      showToast(`${section} saved successfully!`, 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to save ${section}`
      showToast(errorMessage, 'error')
    } finally {
      dispatch(setSaving(false))
    }
  }, [dispatch, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (error) showToast(error, 'error')
    if (success) showToast(success, 'success')
  }, [error, success, showToast])

  const tabs: Array<{ label: string; icon: () => JSX.Element; key: AboutSection; color: string }> = [
    { label: 'Company', icon: Icons.building, key: 'company', color: COLORS.blue },
    { label: 'Contact', icon: Icons.contacts, key: 'contact', color: COLORS.green },
    { label: 'Social', icon: Icons.share, key: 'socialMedia', color: COLORS.red },
    { label: 'Labels', icon: Icons.text, key: 'labels', color: COLORS.yellow },
    { label: 'SEO', icon: Icons.search, key: 'seo', color: COLORS.green },
    { label: 'Theme', icon: Icons.palette, key: 'theme', color: COLORS.red },
    { label: 'System', icon: Icons.settings, key: 'system', color: COLORS.blue },
  ]

  const renderContent = () => {
    if (!aboutData) return null
    
    const tab = tabs[activeTab]
    const props = { saving, T }
    
    switch (tab.key) {
      case 'company':
        return <CompanyTab data={{ companyName: aboutData.companyName, companyDescription: aboutData.companyDescription, companyLogo: aboutData.companyLogo }} onSave={(d) => saveSection('company', d)} {...props} />
      case 'contact':
        return <ContactTab data={aboutData.contact} onSave={(d) => saveSection('contact', d)} {...props} />
      case 'socialMedia':
        return <SocialTab data={aboutData.socialMedia} onSave={(d) => saveSection('socialMedia', d)} {...props} />
      case 'labels':
        return <LabelsTab data={aboutData.labels} onSave={(d) => saveSection('labels', d)} {...props} />
      case 'seo':
        return <SeoTab data={aboutData.seo} onSave={(d) => saveSection('seo', d)} {...props} />
      case 'theme':
        return <ThemeTab data={aboutData.theme} onSave={(d) => saveSection('theme', d)} {...props} />
      case 'system':
        return <SystemTab data={aboutData.system} onSave={(d) => saveSection('system', d)} {...props} />
      default:
        return null
    }
  }

  if (loading && !aboutData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: T.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTopColor: COLORS.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: T.textSecondary }}>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, padding: '28px 24px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>About & Settings</h1>
          <p style={{ color: T.textSecondary, marginTop: 4 }}>Manage company information, appearance, and system configuration</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSurface, color: T.text, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          <Icons.refresh /> Refresh
        </button>
      </div>

      <div style={{ background: T.bgSurface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, padding: '0 16px', overflowX: 'auto' }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(i)
                dispatch(setActiveSection(tab.key))
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 20px', border: 'none', background: 'transparent',
                color: activeTab === i ? tab.color : T.textSecondary,
                borderBottom: activeTab === i ? `2px solid ${tab.color}` : '2px solid transparent',
                cursor: 'pointer', fontSize: 14, fontWeight: activeTab === i ? 600 : 400,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>
        
        <div style={{ padding: '28px' }}>
          {renderContent()}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}