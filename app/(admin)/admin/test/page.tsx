'use client'

// app/admin/label-tester/page.tsx
// Drop this file in your Next.js app and visit /admin/label-tester
// Type any label key + value → see it live on the mock user page instantly

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'

// ─── Types ─────────────────────────────────────────────────────────────────

interface LabelRow {
  id: number
  key: string
  value: string
}

type ViewTab = 'dashboard' | 'form' | 'status'

// ─── Google colors (fixed, not theme dependent) ─────────────────────────────

const G = {
  blue:    '#1a73e8',
  green:   '#1e8e3e',
  yellow:  '#f9ab00',
  red:     '#d93025',
  blueSoft:'rgba(26,115,232,0.09)',
}

// ─── Default starter labels (matches your About.labels schema) ──────────────

const DEFAULTS: LabelRow[] = [
  { id: 1,  key: 'appName',              value: 'My App' },
  { id: 2,  key: 'dashboard',            value: 'Dashboard' },
  { id: 3,  key: 'profile',              value: 'Profile' },
  { id: 4,  key: 'settings',             value: 'Settings' },
  { id: 5,  key: 'logout',               value: 'Logout' },
  { id: 6,  key: 'welcomeMessage',       value: 'Welcome back!' },
  { id: 7,  key: 'totalUsers',           value: 'Total Users' },
  { id: 8,  key: 'totalRevenue',         value: 'Total Revenue' },
  { id: 9,  key: 'activeSubscriptions',  value: 'Active Subscriptions' },
  { id: 10, key: 'recentActivities',     value: 'Recent Activities' },
  { id: 11, key: 'save',                 value: 'Save' },
  { id: 12, key: 'cancel',               value: 'Cancel' },
  { id: 13, key: 'delete',               value: 'Delete' },
  { id: 14, key: 'edit',                 value: 'Edit' },
  { id: 15, key: 'createNew',            value: 'Create New' },
  { id: 16, key: 'active',               value: 'Active' },
  { id: 17, key: 'pending',              value: 'Pending' },
  { id: 18, key: 'inactive',             value: 'Inactive' },
  { id: 19, key: 'completed',            value: 'Completed' },
  { id: 20, key: 'draft',                value: 'Draft' },
]

// ─── Helper: get label with fallback ───────────────────────────────────────

function L(labels: Record<string, string>, key: string, fallback: string) {
  return labels[key] || fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Animated label span (flashes on change) ──────────────────────────────────

function LiveLabel({
  labels, labelKey, fallback, style, className,
}: {
  labels: Record<string, string>
  labelKey: string
  fallback: string
  style?: React.CSSProperties
  className?: string
}) {
  const [flash, setFlash] = useState(false)
  const text = L(labels, labelKey, fallback)
  const prev = useRef(text)

  useEffect(() => {
    if (prev.current !== text) {
      prev.current = text
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 600)
      return () => clearTimeout(t)
    }
  }, [text])

  return (
    <span
      className={className}
      style={{
        borderRadius: 4,
        transition: 'background .3s',
        background: flash ? G.blueSoft : 'transparent',
        padding: flash ? '0 2px' : '0',
        ...style,
      }}
    >
      {text}
    </span>
  )
}

// ── Dashboard view ───────────────────────────────────────────────────────────

function DashboardView({ labels, theme }: { labels: Record<string, string>; theme: any }) {
  const isDark = theme.palette.mode === 'dark'
  
  const colors = {
    bg: isDark ? '#202124' : '#ffffff',
    surface: isDark ? '#303134' : '#f8f9fa',
    border: isDark ? '#3c4043' : '#dadce0',
    text: isDark ? '#e8eaed' : '#202124',
    sub: isDark ? '#9aa0a6' : '#5f6368',
    muted: isDark ? '#5f6368' : '#9aa0a6',
  }

  const navItems = [
    { key: 'dashboard', fallback: 'Dashboard' },
    { key: 'profile',   fallback: 'Profile' },
    { key: 'settings',  fallback: 'Settings' },
    { key: 'logout',    fallback: 'Logout' },
  ]

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(60,64,67,.12)', background: colors.bg }}>
      {/* App top bar */}
      <div style={{ background: G.blue, color: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>
          <LiveLabel labels={labels} labelKey="appName" fallback="My App" />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <LiveLabel labels={labels} labelKey="profile" fallback="Profile" />
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>N</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', minHeight: 380 }}>
        {/* Sidebar */}
        <div style={{ width: 175, background: colors.surface, borderRight: `1px solid ${colors.border}`, padding: '12px 8px', flexShrink: 0 }}>
          {navItems.map((item, i) => (
            <div key={item.key} style={{
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              background: i === 0 ? G.blueSoft : 'transparent',
              color: i === 0 ? G.blue : colors.sub,
              fontWeight: i === 0 ? 700 : 400, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'default',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
              <LiveLabel labels={labels} labelKey={item.key} fallback={item.fallback} />
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: colors.text }}>
            <LiveLabel labels={labels} labelKey="welcomeMessage" fallback="Welcome back!" />
          </div>
          <div style={{ fontSize: 13, color: colors.sub, marginBottom: 20 }}>Here's what's happening today.</div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { key: 'totalUsers',           fallback: 'Total Users',           value: '1,250' },
              { key: 'totalRevenue',         fallback: 'Total Revenue',         value: '₹4.5L' },
              { key: 'activeSubscriptions',  fallback: 'Active Subscriptions',  value: '342' },
            ].map(stat => (
              <div key={stat.key} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                  <LiveLabel labels={labels} labelKey={stat.key} fallback={stat.fallback} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: colors.text }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
            <LiveLabel labels={labels} labelKey="recentActivities" fallback="Recent Activities" />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'createNew',      fallback: 'Create New',      style: { background: G.blue, color: '#fff' } },
              { key: 'edit',           fallback: 'Edit',            style: { background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text } },
              { key: 'downloadReport', fallback: 'Download Report', style: { background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text } },
              { key: 'exportData',     fallback: 'Export Data',     style: { background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text } },
            ].map(btn => (
              <button key={btn.key} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'default', border: 'none', fontFamily: 'inherit', ...btn.style }}>
                <LiveLabel labels={labels} labelKey={btn.key} fallback={btn.fallback} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Form view ────────────────────────────────────────────────────────────────

function FormView({ labels, theme }: { labels: Record<string, string>; theme: any }) {
  const isDark = theme.palette.mode === 'dark'
  
  const colors = {
    bg: isDark ? '#202124' : '#ffffff',
    surface: isDark ? '#303134' : '#f8f9fa',
    border: isDark ? '#3c4043' : '#dadce0',
    text: isDark ? '#e8eaed' : '#202124',
    sub: isDark ? '#9aa0a6' : '#5f6368',
    muted: isDark ? '#5f6368' : '#9aa0a6',
  }

  const fields = [
    { key: 'name',            fallback: 'Name',             placeholder: 'Neer Mehta' },
    { key: 'email',           fallback: 'Email',            placeholder: 'neer@example.com' },
    { key: 'password',        fallback: 'Password',         placeholder: '••••••••' },
    { key: 'confirmPassword', fallback: 'Confirm Password', placeholder: '••••••••' },
    { key: 'phone',           fallback: 'Phone',            placeholder: '+91 98765 43210' },
    { key: 'address',         fallback: 'Address',          placeholder: 'Ahmedabad, Gujarat' },
  ]

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(60,64,67,.12)', background: colors.bg }}>
      <div style={{ background: G.blue, color: '#fff', padding: '14px 20px', fontWeight: 700, fontSize: 16 }}>
        <LiveLabel labels={labels} labelKey="appName" fallback="My App" />
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: colors.text }}>
          <LiveLabel labels={labels} labelKey="register" fallback="Register" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.sub, marginBottom: 5 }}>
                <LiveLabel labels={labels} labelKey={f.key} fallback={f.fallback} />
              </div>
              <div style={{ padding: '9px 12px', border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.surface, fontSize: 13, color: colors.muted }}>
                {f.placeholder}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={{ padding: '9px 22px', borderRadius: 8, background: G.blue, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'default', fontFamily: 'inherit' }}>
            <LiveLabel labels={labels} labelKey="save" fallback="Save" />
          </button>
          <button style={{ padding: '9px 22px', borderRadius: 8, background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, fontSize: 13, fontWeight: 600, cursor: 'default', fontFamily: 'inherit' }}>
            <LiveLabel labels={labels} labelKey="cancel" fallback="Cancel" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status view ──────────────────────────────────────────────────────────────

function StatusView({ labels, theme }: { labels: Record<string, string>; theme: any }) {
  const isDark = theme.palette.mode === 'dark'
  
  const colors = {
    bg: isDark ? '#202124' : '#ffffff',
    surface: isDark ? '#303134' : '#f8f9fa',
    border: isDark ? '#3c4043' : '#dadce0',
    text: isDark ? '#e8eaed' : '#202124',
  }

  const statusItems = [
    { name: 'Order #1042 — Neer Mehta', statusKey: 'active',    chip: { bg: 'rgba(30,142,62,.1)', color: '#1e8e3e' } },
    { name: 'Invoice #2891',            statusKey: 'pending',   chip: { bg: 'rgba(249,171,0,.12)', color: '#f9ab00' } },
    { name: 'User: admin@test.com',     statusKey: 'inactive',  chip: { bg: 'rgba(217,48,37,.09)', color: '#d93025' } },
    { name: 'Blog post',                statusKey: 'draft',     chip: { bg: 'rgba(95,99,104,.1)',   color: isDark ? '#9aa0a6' : '#5f6368' } },
    { name: 'Payment processed',        statusKey: 'completed', chip: { bg: 'rgba(30,142,62,.1)',   color: '#1e8e3e' } },
  ]

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(60,64,67,.12)', background: colors.bg }}>
      <div style={{ background: G.blue, color: '#fff', padding: '14px 20px', fontWeight: 700, fontSize: 16 }}>
        <LiveLabel labels={labels} labelKey="appName" fallback="My App" />
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: colors.text }}>
          <LiveLabel labels={labels} labelKey="recentActivities" fallback="Recent Activities" />
        </div>
        {statusItems.map(item => (
          <div key={item.statusKey + item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 9, border: `1px solid ${colors.border}`, background: colors.surface, marginBottom: 8, fontSize: 13, color: colors.text }}>
            <span>{item.name}</span>
            <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: item.chip.bg, color: item.chip.color }}>
              <LiveLabel labels={labels} labelKey={item.statusKey} fallback={item.statusKey} />
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {[
            { key: 'edit',   fallback: 'Edit',   style: {} },
            { key: 'view',   fallback: 'View',   style: {} },
            { key: 'delete', fallback: 'Delete', style: { color: G.red, background: 'rgba(217,48,37,.08)', border: `1px solid rgba(217,48,37,.2)` } },
          ].map(btn => (
            <button key={btn.key} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'default', background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, fontFamily: 'inherit', ...btn.style }}>
              <LiveLabel labels={labels} labelKey={btn.key} fallback={btn.fallback} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LabelTesterPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  // Theme-based colors
  const colors = {
    bg: isDark ? '#202124' : '#f0f4f9',
    panel: isDark ? '#303134' : '#ffffff',
    surface: isDark ? '#3c4043' : '#f8f9fa',
    border: isDark ? '#5f6368' : '#dadce0',
    text: isDark ? '#e8eaed' : '#202124',
    sub: isDark ? '#9aa0a6' : '#5f6368',
    muted: isDark ? '#5f6368' : '#9aa0a6',
  }

  const [rows, setRows] = useState<LabelRow[]>(DEFAULTS)
  const [view, setView] = useState<ViewTab>('dashboard')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingAPI, setLoadingAPI] = useState(false)
  const [apiMsg, setApiMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const nextId = useRef(DEFAULTS.length + 1)

  // Build labels map from rows
  const labels: Record<string, string> = {}
  rows.forEach(r => { if (r.key.trim()) labels[r.key.trim()] = r.value })

  // Filtered rows for search
  const visibleRows = search.trim()
    ? rows.filter(r => r.key.toLowerCase().includes(search.toLowerCase()) || r.value.toLowerCase().includes(search.toLowerCase()))
    : rows

  const addRow = () => {
    const id = nextId.current++
    setRows(prev => [...prev, { id, key: '', value: '' }])
  }

  const updateRow = (id: number, field: 'key' | 'value', val: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r))
  }

  const removeRow = (id: number) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const copyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(labels, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Load from real API
  const loadFromAPI = async () => {
    setLoadingAPI(true)
    setApiMsg(null)
    try {
      const res  = await fetch('/api/admin/about')
      const data = await res.json()
      if (data.success && data.data?.labels) {
        const loaded = Object.entries(data.data.labels).map(([k, v], i) => ({
          id: nextId.current++,
          key: k,
          value: String(v),
        }))
        setRows(loaded)
        setApiMsg({ text: `Loaded ${loaded.length} labels from API`, ok: true })
      } else {
        setApiMsg({ text: data.message || 'No labels found', ok: false })
      }
    } catch {
      setApiMsg({ text: 'Could not reach API', ok: false })
    } finally {
      setLoadingAPI(false)
      setTimeout(() => setApiMsg(null), 3000)
    }
  }

  // Save to real API
  const saveToAPI = async () => {
    setLoadingAPI(true)
    setApiMsg(null)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'labels', updates: labels }),
      })
      const data = await res.json()
      setApiMsg({ text: data.success ? 'Saved to API ✓' : (data.message || 'Failed'), ok: data.success })
    } catch {
      setApiMsg({ text: 'Could not reach API', ok: false })
    } finally {
      setLoadingAPI(false)
      setTimeout(() => setApiMsg(null), 3000)
    }
  }

  const viewTabs: { key: ViewTab; label: string }[] = [
    { key: 'dashboard', label: '🏠 Dashboard' },
    { key: 'form',      label: '📋 Form' },
    { key: 'status',    label: '🔖 Status' },
  ]

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      background: colors.bg, 
      fontFamily: "'Google Sans', sans-serif", 
      overflow: 'hidden',
      color: colors.text,
      transition: 'background-color 0.3s ease',
    }}>

      {/* ── Global keyframe styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        input::placeholder { color: ${colors.muted}; }
      `}</style>

      {/* ════ TOP BAR ════ */}
      <div style={{ 
        background: colors.panel, 
        borderBottom: `1px solid ${colors.border}`, 
        height: 54, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 20px', 
        flexShrink: 0, 
        boxShadow: '0 1px 4px rgba(0,0,0,.07)',
        transition: 'background-color 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: G.blue, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '.04em' }}>ADMIN</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>Label Live Tester</span>
          <span style={{ fontSize: 12, color: colors.muted }}>— type a label key + value, watch it update instantly →</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme indicator */}
          <span style={{ fontSize: 12, color: colors.sub, background: colors.surface, padding: '4px 10px', borderRadius: 20 }}>
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </span>
          
          {/* API message */}
          {apiMsg && (
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              color: apiMsg.ok ? G.green : G.red, 
              background: apiMsg.ok ? 'rgba(30,142,62,.09)' : 'rgba(217,48,37,.09)', 
              padding: '4px 10px', 
              borderRadius: 20, 
              animation: 'slideDown .2s ease' 
            }}>
              {apiMsg.text}
            </span>
          )}
          
          {/* Load from API */}
          <button 
            onClick={loadFromAPI} 
            disabled={loadingAPI} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '7px 14px', 
              borderRadius: 8, 
              border: `1px solid ${colors.border}`, 
              background: colors.panel, 
              color: colors.sub, 
              fontSize: 13, 
              fontWeight: 500, 
              cursor: loadingAPI ? 'not-allowed' : 'pointer', 
              fontFamily: 'inherit', 
              opacity: loadingAPI ? .6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!loadingAPI) (e.currentTarget as HTMLButtonElement).style.borderColor = G.blue }}
            onMouseLeave={e => { if (!loadingAPI) (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ animation: loadingAPI ? 'spin .8s linear infinite' : 'none' }}>
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Load from API
          </button>
          
          {/* Save to API */}
          <button 
            onClick={saveToAPI} 
            disabled={loadingAPI} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '7px 14px', 
              borderRadius: 8, 
              border: 'none', 
              background: G.blue, 
              color: '#fff', 
              fontSize: 13, 
              fontWeight: 600, 
              cursor: loadingAPI ? 'not-allowed' : 'pointer', 
              fontFamily: 'inherit', 
              opacity: loadingAPI ? .6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!loadingAPI) (e.currentTarget as HTMLButtonElement).style.background = '#1557b0' }}
            onMouseLeave={e => { if (!loadingAPI) (e.currentTarget as HTMLButtonElement).style.background = G.blue }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Save to API
          </button>
          
          {/* Live dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: G.green }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block', animation: 'blink 1.4s infinite' }} />
            LIVE
          </div>
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }`}</style>
        </div>
      </div>

      {/* ════ BODY ════ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', overflow: 'hidden' }}>

        {/* ══ LEFT: EDITOR ══ */}
        <div style={{ 
          background: colors.panel, 
          borderRight: `1px solid ${colors.border}`, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          transition: 'background-color 0.3s ease',
        }}>

          {/* Panel header */}
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: `1px solid ${colors.border}`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexShrink: 0 
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.sub, letterSpacing: '.07em', textTransform: 'uppercase' }}>
              ✏️ Label Editor
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: 'rgba(30,142,62,.1)', color: G.green }}>
              {Object.keys(labels).length} labels
            </span>
          </div>

          {/* Search */}
          <div style={{ padding: '10px 16px 6px', flexShrink: 0 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search labels…"
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: `1px solid ${colors.border}`, 
                borderRadius: 8, 
                fontSize: 13, 
                fontFamily: 'inherit', 
                color: colors.text, 
                background: colors.bg, 
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => { 
                e.currentTarget.style.borderColor = G.blue; 
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,115,232,.1)';
              }}
              onBlur={e  => { 
                e.currentTarget.style.borderColor = colors.border; 
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: 6, padding: '6px 16px 4px', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Key</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Value (shown to user)</span>
            <span></span>
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 8px' }}>
            {visibleRows.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: colors.muted, fontSize: 13 }}>
                {search ? 'No labels match your search' : 'No labels yet'}
              </div>
            )}
            {visibleRows.map(row => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: 6, alignItems: 'center', marginBottom: 6, animation: 'fadeIn .18s ease' }}>
                {/* Key */}
                <input
                  value={row.key}
                  onChange={e => updateRow(row.id, 'key', e.target.value)}
                  placeholder="e.g. save"
                  style={{ 
                    padding: '7px 10px', 
                    border: `1px solid ${colors.border}`, 
                    borderRadius: 7, 
                    fontFamily: "'Roboto Mono', monospace", 
                    fontSize: 12.5, 
                    color: G.blue, 
                    fontWeight: 500, 
                    background: colors.bg, 
                    outline: 'none', 
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => { 
                    e.currentTarget.style.borderColor = G.blue; 
                    e.currentTarget.style.background = isDark ? '#3c4043' : '#fff'; 
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,115,232,.1)';
                  }}
                  onBlur={e  => { 
                    e.currentTarget.style.borderColor = colors.border; 
                    e.currentTarget.style.background = colors.bg; 
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {/* Value */}
                <input
                  value={row.value}
                  onChange={e => updateRow(row.id, 'value', e.target.value)}
                  placeholder="e.g. Save Changes"
                  style={{ 
                    padding: '7px 10px', 
                    border: `1px solid ${colors.border}`, 
                    borderRadius: 7, 
                    fontFamily: "'Roboto Mono', monospace", 
                    fontSize: 12.5, 
                    color: G.green, 
                    background: colors.bg, 
                    outline: 'none', 
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => { 
                    e.currentTarget.style.borderColor = G.green; 
                    e.currentTarget.style.background = isDark ? '#3c4043' : '#fff'; 
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,142,62,.1)';
                  }}
                  onBlur={e  => { 
                    e.currentTarget.style.borderColor = colors.border; 
                    e.currentTarget.style.background = colors.bg; 
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {/* Delete */}
                <button 
                  onClick={() => removeRow(row.id)} 
                  style={{ 
                    width: 28, 
                    height: 28, 
                    border: 'none', 
                    borderRadius: 6, 
                    background: 'transparent', 
                    color: colors.muted, 
                    cursor: 'pointer', 
                    fontSize: 16, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0, 
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { 
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(217,48,37,.1)'; 
                    (e.currentTarget as HTMLButtonElement).style.color = G.red;
                  }}
                  onMouseLeave={e => { 
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; 
                    (e.currentTarget as HTMLButtonElement).style.color = colors.muted;
                  }}
                >×</button>
              </div>
            ))}
          </div>

          {/* Add row */}
          <button 
            onClick={addRow} 
            style={{ 
              margin: '4px 16px 10px', 
              padding: '9px', 
              border: `2px dashed ${colors.border}`, 
              borderRadius: 9, 
              background: 'transparent', 
              color: colors.sub, 
              fontSize: 13, 
              fontFamily: 'inherit', 
              fontWeight: 500, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 6, 
              transition: 'all .15s', 
              flexShrink: 0 
            }}
            onMouseEnter={e => { 
              (e.currentTarget as HTMLButtonElement).style.borderColor = G.blue; 
              (e.currentTarget as HTMLButtonElement).style.color = G.blue; 
              (e.currentTarget as HTMLButtonElement).style.background = G.blueSoft;
            }}
            onMouseLeave={e => { 
              (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border; 
              (e.currentTarget as HTMLButtonElement).style.color = colors.sub; 
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Label
          </button>

          {/* JSON output */}
          <div style={{ 
            borderTop: `1px solid ${colors.border}`, 
            padding: '12px 16px', 
            background: colors.surface, 
            flexShrink: 0,
            transition: 'background-color 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>JSON Output</span>
              <button 
                onClick={copyJSON} 
                style={{ 
                  padding: '3px 9px', 
                  borderRadius: 5, 
                  border: `1px solid ${colors.border}`, 
                  background: copied ? G.green : colors.panel, 
                  color: copied ? '#fff' : colors.sub, 
                  fontSize: 11, 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  fontFamily: 'inherit', 
                  transition: 'all .2s' 
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre style={{ 
              background: isDark ? '#0c0d10' : '#1a1b26', 
              color: isDark ? '#e8eaed' : '#a9b1d6', 
              fontFamily: "'Roboto Mono', monospace", 
              fontSize: 11.5, 
              lineHeight: 1.6, 
              padding: '10px 12px', 
              borderRadius: 8, 
              maxHeight: 130, 
              overflowY: 'auto', 
              margin: 0 
            }}>
              {JSON.stringify(labels, null, 2)}
            </pre>
          </div>
        </div>

        {/* ══ RIGHT: PREVIEW ══ */}
        <div style={{ 
          overflowY: 'auto', 
          padding: 20, 
          background: colors.bg,
          transition: 'background-color 0.3s ease',
        }}>
          {/* Header + view switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.sub, letterSpacing: '.07em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/>
              </svg>
              User-Side Preview
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {viewTabs.map(tab => (
                <button 
                  key={tab.key} 
                  onClick={() => setView(tab.key)}
                  style={{ 
                    padding: '5px 14px', 
                    borderRadius: 20, 
                    border: `1px solid ${view === tab.key ? G.blue : colors.border}`, 
                    background: view === tab.key ? G.blue : colors.panel, 
                    color: view === tab.key ? '#fff' : colors.sub, 
                    fontSize: 12, 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    fontFamily: 'inherit', 
                    transition: 'all .15s' 
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active view - pass theme to each view */}
          {view === 'dashboard' && <DashboardView labels={labels} theme={theme} />}
          {view === 'form'      && <FormView      labels={labels} theme={theme} />}
          {view === 'status'    && <StatusView    labels={labels} theme={theme} />}

          {/* Legend */}
          <div style={{ 
            marginTop: 16, 
            padding: '10px 14px', 
            borderRadius: 10, 
            background: colors.panel, 
            border: `1px solid ${colors.border}`, 
            fontSize: 12, 
            color: colors.sub, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            transition: 'background-color 0.3s ease',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={G.blue}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Elements with a <span style={{ background: G.blueSoft, padding: '1px 4px', borderRadius: 3, fontWeight: 600, color: G.blue }}>blue flash</span> are bound to your labels. Change any value on the left to see it update instantly here.
          </div>
        </div>
      </div>
    </div>
  )
}