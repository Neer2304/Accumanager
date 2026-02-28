'use client'

// app/admin/about/page.tsx
// Zero MUI — all tab content self-contained, Google Material Design aesthetic.

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from '@mui/material/styles'

// ─── Design tokens ────────────────────────────────────────────────────────────

const G = {
  blue:   '#1a73e8', blueSoft:   'rgba(26,115,232,0.09)',
  green:  '#1e8e3e', greenSoft:  'rgba(30,142,62,0.09)',
  yellow: '#f9ab00', yellowSoft: 'rgba(249,171,0,0.11)',
  red:    '#d93025', redSoft:    'rgba(217,48,37,0.09)',
}

function tok(dark: boolean) {
  return dark ? {
    bg:         '#202124', bgS: '#1c1e22', bgE: '#26282c', bgSub: '#2d3034',
    border:     '#3c4043', text: '#e8eaed', sub: '#9aa0a6', muted: '#5f6368',
    input:      '#26282c', inputBorder: '#3c4043', inputFocus: G.blue,
    shadow:     '0 1px 3px rgba(0,0,0,.5),0 4px 8px rgba(0,0,0,.35)',
  } : {
    bg:         '#f8f9fa', bgS: '#ffffff', bgE: '#ffffff', bgSub: '#f1f3f4',
    border:     '#e8eaed', text: '#202124', sub: '#5f6368', muted: '#80868b',
    input:      '#ffffff', inputBorder: '#dadce0', inputFocus: G.blue,
    shadow:     '0 1px 2px rgba(60,64,67,.15),0 2px 6px rgba(60,64,67,.10)',
  }
}

type Tok = ReturnType<typeof tok>

// ─── SVG icons ────────────────────────────────────────────────────────────────

const Icon = {
  building: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  contacts: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 0H4v2h16V0zm0 4H4v2h16V4zM4 22h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zm8-12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm-6 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/></svg>,
  share:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>,
  text:     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>,
  search:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  palette:  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>,
  save:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>,
  refresh:  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>,
  check:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  warn:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  info:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  eye:      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>,
  eyeOff:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>,
  upload:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>,
  toggle:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>,
}

// ─── Reusable field components ────────────────────────────────────────────────

function Field({ label, hint, children, T }: { label: string; hint?: string; children: React.ReactNode; T: Tok }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.sub, marginBottom: 6, letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.4 }}>{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', T, multiline = false, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; T: Tok; multiline?: boolean; rows?: number;
}) {
  const [focus, setFocus] = useState(false)
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  const base: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${focus ? T.inputFocus : T.inputBorder}`,
    background: T.input, color: T.text, fontSize: 14,
    outline: 'none', transition: 'border-color .15s, box-shadow .15s',
    boxShadow: focus ? `0 0 0 3px ${G.blue}18` : 'none',
    fontFamily: 'inherit',
    resize: multiline ? 'vertical' : 'none',
  }

  if (multiline) return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={base}
    />
  )

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={inputType} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...base, paddingRight: isPassword ? 40 : 14 }}
      />
      {isPassword && (
        <button onClick={() => setShow(s => !s)} type="button" style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 0,
        }}>
          {show ? Icon.eyeOff : Icon.eye}
        </button>
      )}
    </div>
  )
}

function Select({ value, onChange, options, T }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; T: Tok;
}) {
  const [focus, setFocus] = useState(false)
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '10px 14px', borderRadius: 8,
        border: `1px solid ${focus ? G.blue : T.inputBorder}`,
        background: T.input, color: T.text, fontSize: 14,
        outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: focus ? `0 0 0 3px ${G.blue}18` : 'none',
        transition: 'border-color .15s, box-shadow .15s',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ checked, onChange, label, T }: { checked: boolean; onChange: (v: boolean) => void; label: string; T: Tok }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 14, color: T.text }}>{label}</span>
      <button
        onClick={() => onChange(!checked)} type="button"
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: checked ? G.blue : T.muted, transition: 'background .2s',
          position: 'relative', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </button>
    </div>
  )
}

function ColorInput({ value, onChange, label, T }: { value: string; onChange: (v: string) => void; label: string; T: Tok }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.sub, marginBottom: 6, letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
          style={{ width: 44, height: 36, padding: 2, border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', background: T.input }} />
        <Input value={value} onChange={onChange} placeholder="#000000" T={T} />
      </div>
    </div>
  )
}

function SaveBtn({ onClick, saving, T }: { onClick: () => void; saving: boolean; T: Tok }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} disabled={saving} type="button"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '10px 22px', borderRadius: 8,
        background: saving ? T.muted : h ? '#1557b0' : G.blue,
        color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
        fontSize: 14, fontWeight: 600, transition: 'background .15s',
        opacity: saving ? .7 : 1,
      }}
    >
      {saving ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #fff3', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> : Icon.save}
      {saving ? 'Saving…' : 'Save Changes'}
    </button>
  )
}

function SectionHeader({ title, description, color, T }: { title: string; description: string; color: string; T: Tok }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 4, height: 20, borderRadius: 2, background: color, display: 'inline-block' }} />
        {title}
      </h3>
      <p style={{ fontSize: 13, color: T.sub, marginLeft: 12 }}>{description}</p>
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 24px' }}>
      {children}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const colors = { success: G.green, error: G.red, info: G.blue }
  const icons  = { success: Icon.check, error: Icon.warn, info: Icon.info }
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px', borderRadius: 10, zIndex: 9999,
      background: colors[type], color: '#fff', fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,.25)', animation: 'slideUp .25s ease',
      maxWidth: 400, whiteSpace: 'nowrap',
    }}>
      {icons[type]} {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffffaa', cursor: 'pointer', marginLeft: 6, padding: 0 }}>{Icon.close}</button>
    </div>
  )
}

// ─── Tab content components ────────────────────────────────────────────────────

function CompanyTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    companyName:        data?.companyName        ?? '',
    companyDescription: data?.companyDescription ?? '',
    companyLogo:        data?.companyLogo        ?? '',
    companyWebsite:     data?.companyWebsite      ?? '',
    companyEmail:       data?.companyEmail        ?? '',
    foundedYear:        data?.foundedYear         ?? '',
    employeeCount:      data?.employeeCount       ?? '',
    industry:           data?.industry            ?? '',
  })
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <SectionHeader title="Company Information" description="Basic company details shown publicly" color={G.blue} T={T} />
      <Grid2>
        <Field label="Company Name" T={T}><Input value={form.companyName} onChange={set('companyName')} placeholder="Acme Corp" T={T} /></Field>
        <Field label="Website" T={T}><Input value={form.companyWebsite} onChange={set('companyWebsite')} placeholder="https://example.com" T={T} /></Field>
        <Field label="Business Email" T={T}><Input value={form.companyEmail} onChange={set('companyEmail')} placeholder="hello@example.com" T={T} /></Field>
        <Field label="Founded Year" T={T}><Input value={form.foundedYear} onChange={set('foundedYear')} placeholder="2020" T={T} /></Field>
        <Field label="Team Size" T={T}><Input value={form.employeeCount} onChange={set('employeeCount')} placeholder="50-100" T={T} /></Field>
        <Field label="Industry" T={T}><Input value={form.industry} onChange={set('industry')} placeholder="Technology" T={T} /></Field>
      </Grid2>
      <Field label="Company Description" hint="Brief description shown on public pages" T={T}>
        <Input value={form.companyDescription} onChange={set('companyDescription')} placeholder="We help businesses grow…" T={T} multiline rows={4} />
      </Field>
      <Field label="Logo URL" hint="Direct URL to your company logo image" T={T}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}><Input value={form.companyLogo} onChange={set('companyLogo')} placeholder="https://…/logo.png" T={T} /></div>
          {form.companyLogo && (
            <img src={form.companyLogo} alt="Logo preview" onError={e => (e.currentTarget.style.display = 'none')}
              style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub }} />
          )}
        </div>
      </Field>
      <SaveBtn onClick={() => onSave(form)} saving={saving} T={T} />
    </div>
  )
}

function ContactTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    email:        data?.email        ?? '',
    phone:        data?.phone        ?? '',
    address:      data?.address      ?? '',
    workingHours: data?.workingHours ?? '',
    supportHours: data?.supportHours ?? '',
    supportEmail: data?.supportEmail ?? '',
    salesEmail:   data?.salesEmail   ?? '',
    faxNumber:    data?.faxNumber    ?? '',
  })
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <SectionHeader title="Contact Details" description="How customers and partners can reach you" color={G.green} T={T} />
      <Grid2>
        <Field label="Primary Email" T={T}><Input value={form.email} onChange={set('email')} placeholder="contact@company.com" T={T} /></Field>
        <Field label="Support Email" T={T}><Input value={form.supportEmail} onChange={set('supportEmail')} placeholder="support@company.com" T={T} /></Field>
        <Field label="Sales Email" T={T}><Input value={form.salesEmail} onChange={set('salesEmail')} placeholder="sales@company.com" T={T} /></Field>
        <Field label="Phone Number" T={T}><Input value={form.phone} onChange={set('phone')} placeholder="+1 (555) 123-4567" T={T} /></Field>
        <Field label="Fax Number" T={T}><Input value={form.faxNumber} onChange={set('faxNumber')} placeholder="+1 (555) 765-4321" T={T} /></Field>
        <Field label="Working Hours" T={T}><Input value={form.workingHours} onChange={set('workingHours')} placeholder="Mon–Fri, 9AM–6PM" T={T} /></Field>
        <Field label="Support Hours" T={T}><Input value={form.supportHours} onChange={set('supportHours')} placeholder="24/7" T={T} /></Field>
      </Grid2>
      <Field label="Full Address" T={T}>
        <Input value={form.address} onChange={set('address')} placeholder="123 Main Street, City, Country" T={T} multiline rows={3} />
      </Field>
      <SaveBtn onClick={() => onSave(form)} saving={saving} T={T} />
    </div>
  )
}

function SocialTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    facebook:  data?.facebook  ?? '', twitter:   data?.twitter   ?? '',
    instagram: data?.instagram ?? '', linkedin:  data?.linkedin  ?? '',
    youtube:   data?.youtube   ?? '', github:    data?.github    ?? '',
    tiktok:    data?.tiktok    ?? '', discord:   data?.discord   ?? '',
  })
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const platforms = [
    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/yourpage',  color: '#1877f2' },
    { key: 'twitter',   label: 'X / Twitter', placeholder: 'https://x.com/yourhandle',    color: '#000' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', color: '#e1306c' },
    { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/company/…', color: '#0a66c2' },
    { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@yourchannel', color: '#ff0000' },
    { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/yourorg',    color: '#24292e' },
    { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@yourhandle', color: '#010101' },
    { key: 'discord',   label: 'Discord',   placeholder: 'https://discord.gg/yourserver', color: '#5865f2' },
  ]

  return (
    <div>
      <SectionHeader title="Social Media" description="Links to your social media profiles" color={G.red} T={T} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 24px' }}>
        {platforms.map(p => (
          <Field key={p.key} label={p.label} T={T}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{p.label[0]}</span>
              </div>
              <div style={{ flex: 1 }}><Input value={(form as any)[p.key]} onChange={set(p.key)} placeholder={p.placeholder} T={T} /></div>
            </div>
          </Field>
        ))}
      </div>
      <SaveBtn onClick={() => onSave(form)} saving={saving} T={T} />
    </div>
  )
}

function LabelsTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({ ...data })
  const [search, setSearch] = useState('')
  const set = (k: string) => (v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const groups = [
    { title: 'Navigation', keys: ['appName', 'dashboard', 'profile', 'settings', 'logout', 'login', 'register'] },
    { title: 'Actions', keys: ['save', 'cancel', 'delete', 'edit', 'view', 'createNew', 'viewDetails'] },
    { title: 'Data Export', keys: ['downloadReport', 'exportData', 'importData'] },
    { title: 'User Fields', keys: ['name', 'email', 'password', 'confirmPassword', 'phone', 'address'] },
    { title: 'Status Labels', keys: ['active', 'inactive', 'pending', 'completed', 'draft'] },
    { title: 'Dashboard', keys: ['welcomeMessage', 'totalUsers', 'totalRevenue', 'activeSubscriptions', 'recentActivities'] },
  ]

  const filtered = search.trim()
    ? [{ title: 'Search Results', keys: Object.keys(form).filter(k => k.toLowerCase().includes(search.toLowerCase()) || ((form as any)[k] || '').toLowerCase().includes(search.toLowerCase())) }]
    : groups

  return (
    <div>
      <SectionHeader title="UI Labels" description="Customize all text labels shown in the app" color={G.yellow} T={T} />
      <div style={{ marginBottom: 20 }}>
        <Input value={search} onChange={setSearch} placeholder="Search labels…" T={T} />
      </div>
      {filtered.map(group => group.keys.length > 0 && (
        <div key={group.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>
            {group.title}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0 24px' }}>
            {group.keys.map(k => (
              <Field key={k} label={k} T={T}>
                <Input value={(form as any)[k] ?? ''} onChange={set(k)} placeholder={k} T={T} />
              </Field>
            ))}
          </div>
        </div>
      ))}
      <SaveBtn onClick={() => onSave(form)} saving={saving} T={T} />
    </div>
  )
}

function SeoTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    metaTitle:       data?.metaTitle       ?? '',
    metaDescription: data?.metaDescription ?? '',
    metaKeywords:    (data?.metaKeywords || []).join(', '),
    ogTitle:         data?.ogTitle         ?? '',
    ogDescription:   data?.ogDescription   ?? '',
    ogImage:         data?.ogImage         ?? '',
    twitterCard:     data?.twitterCard     ?? 'summary_large_image',
    canonicalUrl:    data?.canonicalUrl    ?? '',
    robotsTxt:       data?.robotsTxt       ?? 'index, follow',
  })
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const charCount = (v: string, max: number) => (
    <span style={{ fontSize: 11, color: v.length > max ? G.red : T.muted, marginLeft: 4 }}>{v.length}/{max}</span>
  )

  return (
    <div>
      <SectionHeader title="SEO Settings" description="Control how your app appears in search engines and social shares" color={G.green} T={T} />

      <div style={{ background: T.bgSub, borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ color: G.blue, marginTop: 1 }}>{Icon.info}</span>
        <p style={{ fontSize: 13, color: T.sub, margin: 0, lineHeight: 1.55 }}>Keep meta title under 60 characters and meta description under 160 for best results.</p>
      </div>

      <Field label={<span>Meta Title {charCount(form.metaTitle, 60)} </span> as any} T={T}>
        <Input value={form.metaTitle} onChange={set('metaTitle')} placeholder="My App — Dashboard" T={T} />
      </Field>
      <Field label={<span>Meta Description {charCount(form.metaDescription, 160)}</span> as any} T={T}>
        <Input value={form.metaDescription} onChange={set('metaDescription')} placeholder="Describe your app in 1–2 sentences…" T={T} multiline rows={3} />
      </Field>
      <Field label="Meta Keywords" hint="Comma-separated keywords" T={T}>
        <Input value={form.metaKeywords} onChange={set('metaKeywords')} placeholder="admin, dashboard, saas" T={T} />
      </Field>

      <div style={{ height: 1, background: T.border, margin: '24px 0' }} />
      <p style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 16, letterSpacing: '.06em', textTransform: 'uppercase' }}>Open Graph / Social</p>

      <Grid2>
        <Field label="OG Title" T={T}><Input value={form.ogTitle} onChange={set('ogTitle')} placeholder="Same as meta title" T={T} /></Field>
        <Field label="Twitter Card" T={T}>
          <Select value={form.twitterCard} onChange={set('twitterCard')} T={T} options={[
            { value: 'summary', label: 'Summary' },
            { value: 'summary_large_image', label: 'Summary + Large Image' },
            { value: 'app', label: 'App' },
          ]} />
        </Field>
        <Field label="Canonical URL" T={T}><Input value={form.canonicalUrl} onChange={set('canonicalUrl')} placeholder="https://yoursite.com" T={T} /></Field>
        <Field label="Robots" T={T}>
          <Select value={form.robotsTxt} onChange={set('robotsTxt')} T={T} options={[
            { value: 'index, follow', label: 'Index + Follow' },
            { value: 'noindex, nofollow', label: 'No Index, No Follow' },
            { value: 'index, nofollow', label: 'Index, No Follow' },
          ]} />
        </Field>
      </Grid2>
      <Field label="OG Description" T={T}>
        <Input value={form.ogDescription} onChange={set('ogDescription')} placeholder="Description for social shares…" T={T} multiline rows={3} />
      </Field>
      <Field label="OG Image URL" hint="1200×630px recommended" T={T}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}><Input value={form.ogImage} onChange={set('ogImage')} placeholder="https://…/og.png" T={T} /></div>
          {form.ogImage && <img src={form.ogImage} alt="OG preview" onError={e => (e.currentTarget.style.display = 'none')} style={{ width: 80, height: 42, objectFit: 'cover', borderRadius: 6, border: `1px solid ${T.border}` }} />}
        </div>
      </Field>
      <SaveBtn onClick={() => onSave({ ...form, metaKeywords: form.metaKeywords.split(',').map((s: string) => s.trim()).filter(Boolean) })} saving={saving} T={T} />
    </div>
  )
}

function ThemeTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    primaryColor:     data?.primaryColor     ?? '#1a73e8',
    secondaryColor:   data?.secondaryColor   ?? '#34a853',
    accentColor:      data?.accentColor      ?? '#ea4335',
    backgroundColor:  data?.backgroundColor  ?? '#ffffff',
    textColor:        data?.textColor        ?? '#202124',
    fontFamily:       data?.fontFamily       ?? 'Inter, sans-serif',
    borderRadius:     data?.borderRadius     ?? '8px',
    darkMode:         data?.darkMode         ?? false,
  })
  const set = (k: string) => (v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <SectionHeader title="Theme & Appearance" description="Visual branding and style preferences" color={G.red} T={T} />

      {/* Live preview */}
      <div style={{ marginBottom: 28, padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, background: form.backgroundColor, fontFamily: form.fontFamily }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Live Preview</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Primary', color: form.primaryColor },
            { label: 'Secondary', color: form.secondaryColor },
            { label: 'Accent', color: form.accentColor },
          ].map(c => (
            <div key={c.label} style={{ padding: '8px 16px', borderRadius: form.borderRadius, background: c.color, color: '#fff', fontSize: 13, fontWeight: 600 }}>{c.label}</div>
          ))}
          <div style={{ padding: '8px 16px', borderRadius: form.borderRadius, border: `1px solid ${form.primaryColor}`, color: form.primaryColor, fontSize: 13, fontWeight: 600 }}>Outlined</div>
        </div>
        <p style={{ color: form.textColor, fontSize: 14, marginTop: 12, marginBottom: 0 }}>Sample text in your chosen font and color.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 24px' }}>
        <ColorInput value={form.primaryColor}    onChange={v => set('primaryColor')(v)}    label="Primary Color"    T={T} />
        <ColorInput value={form.secondaryColor}  onChange={v => set('secondaryColor')(v)}  label="Secondary Color"  T={T} />
        <ColorInput value={form.accentColor}     onChange={v => set('accentColor')(v)}     label="Accent Color"     T={T} />
        <ColorInput value={form.backgroundColor} onChange={v => set('backgroundColor')(v)} label="Background Color" T={T} />
        <ColorInput value={form.textColor}       onChange={v => set('textColor')(v)}       label="Text Color"       T={T} />
      </div>

      <Grid2>
        <Field label="Font Family" T={T}>
          <Select value={form.fontFamily} onChange={set('fontFamily') as any} T={T} options={[
            { value: 'Inter, sans-serif', label: 'Inter' },
            { value: 'Roboto, sans-serif', label: 'Roboto' },
            { value: '"Google Sans", sans-serif', label: 'Google Sans' },
            { value: '"DM Sans", sans-serif', label: 'DM Sans' },
            { value: '"Nunito", sans-serif', label: 'Nunito' },
            { value: 'system-ui, sans-serif', label: 'System UI' },
          ]} />
        </Field>
        <Field label="Border Radius" T={T}>
          <Select value={form.borderRadius} onChange={set('borderRadius') as any} T={T} options={[
            { value: '0px', label: 'Square (0px)' }, { value: '4px', label: 'Subtle (4px)' },
            { value: '8px', label: 'Medium (8px)' }, { value: '12px', label: 'Rounded (12px)' },
            { value: '20px', label: 'Pill (20px)' },
          ]} />
        </Field>
      </Grid2>
      <Toggle checked={form.darkMode} onChange={v => set('darkMode')(v)} label="Enable dark mode by default" T={T} />
      <div style={{ marginTop: 20 }}>
        <SaveBtn onClick={() => onSave(form)} saving={saving} T={T} />
      </div>
    </div>
  )
}

function SystemTab({ data, onSave, saving, T }: { data: any; onSave: (d: any) => void; saving: boolean; T: Tok }) {
  const [form, setForm] = useState({
    timezone:                data?.timezone                ?? 'UTC',
    dateFormat:              data?.dateFormat              ?? 'MM/DD/YYYY',
    timeFormat:              data?.timeFormat              ?? 'hh:mm A',
    currency:                data?.currency                ?? 'USD',
    currencySymbol:          data?.currencySymbol          ?? '$',
    language:                data?.language                ?? 'en',
    defaultRole:             data?.defaultRole             ?? 'user',
    defaultPlan:             data?.defaultPlan             ?? 'trial',
    trialDays:               String(data?.trialDays        ?? 14),
    sessionTimeout:          String(data?.sessionTimeout   ?? 30),
    itemsPerPage:            String(data?.itemsPerPage     ?? 10),
    enableRegistration:      data?.enableRegistration      ?? true,
    enableEmailVerification: data?.enableEmailVerification ?? false,
    enablePhoneVerification: data?.enablePhoneVerification ?? false,
    enableTwoFactor:         data?.enableTwoFactor         ?? false,
    enableCaptcha:           data?.enableCaptcha           ?? false,
    maintenanceMode:         data?.maintenanceMode         ?? false,
  })
  const setS = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const setB = (k: string) => (v: boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <SectionHeader title="System Configuration" description="Core application behavior and defaults" color={G.blue} T={T} />

      <p style={{ fontSize: 12, fontWeight: 700, color: T.sub, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 14 }}>Localization</p>
      <Grid2>
        <Field label="Timezone" T={T}>
          <Select value={form.timezone} onChange={setS('timezone')} T={T} options={[
            { value: 'UTC', label: 'UTC' }, { value: 'Asia/Kolkata', label: 'IST (India)' },
            { value: 'America/New_York', label: 'EST (New York)' }, { value: 'America/Los_Angeles', label: 'PST (LA)' },
            { value: 'Europe/London', label: 'GMT (London)' }, { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
          ]} />
        </Field>
        <Field label="Language" T={T}>
          <Select value={form.language} onChange={setS('language')} T={T} options={[
            { value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' },
            { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }, { value: 'ja', label: 'Japanese' },
          ]} />
        </Field>
        <Field label="Date Format" T={T}>
          <Select value={form.dateFormat} onChange={setS('dateFormat')} T={T} options={[
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }, { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
          ]} />
        </Field>
        <Field label="Time Format" T={T}>
          <Select value={form.timeFormat} onChange={setS('timeFormat')} T={T} options={[
            { value: 'hh:mm A', label: '12-hour (hh:mm AM/PM)' }, { value: 'HH:mm', label: '24-hour (HH:mm)' },
          ]} />
        </Field>
        <Field label="Currency" T={T}>
          <Select value={form.currency} onChange={setS('currency')} T={T} options={[
            { value: 'USD', label: 'USD ($)' }, { value: 'INR', label: 'INR (₹)' },
            { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' },
            { value: 'JPY', label: 'JPY (¥)' },
          ]} />
        </Field>
        <Field label="Currency Symbol" T={T}><Input value={form.currencySymbol} onChange={setS('currencySymbol')} placeholder="$" T={T} /></Field>
      </Grid2>

      <div style={{ height: 1, background: T.border, margin: '20px 0' }} />
      <p style={{ fontSize: 12, fontWeight: 700, color: T.sub, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 14 }}>Defaults & Limits</p>
      <Grid2>
        <Field label="Default Role" T={T}>
          <Select value={form.defaultRole} onChange={setS('defaultRole')} T={T} options={[
            { value: 'user', label: 'User' }, { value: 'editor', label: 'Editor' }, { value: 'admin', label: 'Admin' },
          ]} />
        </Field>
        <Field label="Default Plan" T={T}>
          <Select value={form.defaultPlan} onChange={setS('defaultPlan')} T={T} options={[
            { value: 'trial', label: 'Trial' }, { value: 'free', label: 'Free' }, { value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' },
          ]} />
        </Field>
        <Field label="Trial Period (days)" T={T}><Input value={form.trialDays} onChange={setS('trialDays')} placeholder="14" type="number" T={T} /></Field>
        <Field label="Session Timeout (min)" T={T}><Input value={form.sessionTimeout} onChange={setS('sessionTimeout')} placeholder="30" type="number" T={T} /></Field>
        <Field label="Items Per Page" T={T}><Input value={form.itemsPerPage} onChange={setS('itemsPerPage')} placeholder="10" type="number" T={T} /></Field>
      </Grid2>

      <div style={{ height: 1, background: T.border, margin: '20px 0' }} />
      <p style={{ fontSize: 12, fontWeight: 700, color: T.sub, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Feature Flags</p>
      <div style={{ background: T.bgSub, borderRadius: 10, padding: '0 16px', marginBottom: 20 }}>
        <Toggle checked={form.enableRegistration}      onChange={setB('enableRegistration')}      label="Allow new user registration"      T={T} />
        <Toggle checked={form.enableEmailVerification} onChange={setB('enableEmailVerification')} label="Require email verification"        T={T} />
        <Toggle checked={form.enablePhoneVerification} onChange={setB('enablePhoneVerification')} label="Require phone verification"        T={T} />
        <Toggle checked={form.enableTwoFactor}         onChange={setB('enableTwoFactor')}         label="Enable two-factor authentication" T={T} />
        <Toggle checked={form.enableCaptcha}           onChange={setB('enableCaptcha')}           label="Enable CAPTCHA on forms"          T={T} />
      </div>

      {form.maintenanceMode && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 8, background: G.redSoft, border: `1px solid ${G.red}30`, marginBottom: 16 }}>
          <span style={{ color: G.red, marginTop: 1 }}>{Icon.warn}</span>
          <p style={{ fontSize: 13, color: G.red, margin: 0, fontWeight: 500 }}>Maintenance mode is ON. The app is not accessible to regular users.</p>
        </div>
      )}
      <Toggle checked={form.maintenanceMode} onChange={setB('maintenanceMode')} label="🚧 Maintenance Mode" T={T} />

      <div style={{ marginTop: 20 }}>
        <SaveBtn onClick={() => onSave({ ...form, trialDays: Number(form.trialDays), sessionTimeout: Number(form.sessionTimeout), itemsPerPage: Number(form.itemsPerPage) })} saving={saving} T={T} />
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminAboutPage() {
  const theme   = useTheme()
  const dark    = theme.palette.mode === 'dark'
  const T       = tok(dark)

  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [aboutData, setAboutData] = useState<any>(null)
  const [toast,     setToast]     = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res  = await fetch('/api/admin/about')
      const data = await res.json()
      if (data.success) { setAboutData(data.data); showToast('Data loaded', 'info') }
      else showToast(data.message || 'Failed to load', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setLoading(false) }
  }, [showToast])

  const saveSection = useCallback(async (section: string, data: any) => {
    try {
      setSaving(true)
      const res    = await fetch('/api/admin/about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, updates: data }) })
      const result = await res.json()
      if (result.success) { setAboutData((p: any) => ({ ...p, [section]: data })); showToast(`${section} saved!`, 'success'); return true }
      else { showToast(result.message || 'Failed to save', 'error'); return false }
    } catch { showToast('Network error', 'error'); return false }
    finally { setSaving(false) }
  }, [showToast])

  const saveAll = useCallback(async () => {
    if (!aboutData) return
    try {
      setSaving(true)
      const res    = await fetch('/api/admin/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutData) })
      const result = await res.json()
      if (result.success) showToast('All settings saved!', 'success')
      else showToast(result.message || 'Failed', 'error')
    } catch { showToast('Network error', 'error') }
    finally { setSaving(false) }
  }, [aboutData, showToast])

  useEffect(() => { fetchData() }, [fetchData])

  const tabs = [
    { label: 'Company',  icon: Icon.building, key: 'company',     color: G.blue   },
    { label: 'Contact',  icon: Icon.contacts, key: 'contact',     color: G.green  },
    { label: 'Social',   icon: Icon.share,    key: 'socialMedia', color: G.red    },
    { label: 'Labels',   icon: Icon.text,     key: 'labels',      color: G.yellow },
    { label: 'SEO',      icon: Icon.search,   key: 'seo',         color: G.green  },
    { label: 'Theme',    icon: Icon.palette,  key: 'theme',       color: G.red    },
    { label: 'System',   icon: Icon.settings, key: 'system',      color: G.blue   },
  ]

  const renderContent = () => {
    if (!aboutData) return null
    const tab = tabs[activeTab]
    const props = { saving, T }
    switch (tab.key) {
      case 'company':    return <CompanyTab  data={aboutData}                   onSave={d => saveSection('company', d)}    {...props} />
      case 'contact':    return <ContactTab  data={aboutData.contact    ?? {}}  onSave={d => saveSection('contact', d)}    {...props} />
      case 'socialMedia':return <SocialTab   data={aboutData.socialMedia ?? {}} onSave={d => saveSection('socialMedia', d)} {...props} />
      case 'labels':     return <LabelsTab   data={aboutData.labels     ?? {}}  onSave={d => saveSection('labels', d)}     {...props} />
      case 'seo':        return <SeoTab      data={aboutData.seo        ?? {}}  onSave={d => saveSection('seo', d)}        {...props} />
      case 'theme':      return <ThemeTab    data={aboutData.theme      ?? {}}  onSave={d => saveSection('theme', d)}      {...props} />
      case 'system':     return <SystemTab   data={aboutData.system     ?? {}}  onSave={d => saveSection('system', d)}     {...props} />
      default:           return null
    }
  }

  // ── Loading ──
  if (loading && !aboutData) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: T.bg }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTopColor: G.blue, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: T.sub, fontSize: 14 }}>Loading settings…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, padding: '28px 24px', transition: 'background .25s' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
        * { box-sizing: border-box; }
        textarea, input, select { font-family: inherit; }
        .tab-btn:hover { background: ${T.bgSub} !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${G.blue}, ${G.green})`,
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16,
            }}>⚙</span>
            About & Settings
          </h1>
          <p style={{ fontSize: 14, color: T.sub, margin: '6px 0 0 46px' }}>Manage company info, appearance, and system configuration</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Refresh */}
          <button onClick={fetchData} disabled={loading || saving} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bgE, color: T.sub,
            cursor: loading || saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 500,
            opacity: loading || saving ? .6 : 1, transition: 'all .15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = G.blue)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
          >
            <span style={{ display: 'inline-block', animation: loading ? 'spin .8s linear infinite' : 'none' }}>{Icon.refresh}</span> Refresh
          </button>
          {/* Save all */}
          <button onClick={saveAll} disabled={saving || loading || !aboutData} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8,
            border: 'none', background: G.blue, color: '#fff',
            cursor: saving || loading || !aboutData ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 600, opacity: saving ? .7 : 1, transition: 'background .15s',
          }}
            onMouseEnter={e => !saving && !loading && ((e.currentTarget as HTMLButtonElement).style.background = '#1557b0')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = G.blue)}
          >
            {saving ? <span style={{ width: 14, height: 14, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> : Icon.save}
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{ background: T.bgS, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: T.shadow, overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `1px solid ${T.border}`, padding: '0 8px' }}>
          {tabs.map((tab, i) => {
            const active = activeTab === i
            return (
              <button key={i} onClick={() => setActiveTab(i)} className="tab-btn" style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '14px 18px', border: 'none', cursor: 'pointer',
                background: active ? T.bgSub : 'transparent',
                color: active ? tab.color : T.sub,
                fontWeight: active ? 700 : 400, fontSize: 14,
                borderBottom: `2px solid ${active ? tab.color : 'transparent'}`,
                transition: 'all .15s', whiteSpace: 'nowrap', borderRadius: '8px 8px 0 0',
              }}>
                <span style={{ color: active ? tab.color : T.muted }}>{tab.icon}</span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div style={{ padding: '28px 28px 32px' }}>
          {aboutData ? renderContent() : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.sub }}>
              <p style={{ fontSize: 15 }}>No settings data found.</p>
              <button onClick={fetchData} style={{ marginTop: 12, padding: '10px 22px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: G.blue, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                Load Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}