'use client'

// app/about/page.tsx
// Public user-facing page — fetches GET /api/admin/about and renders
// company info, contact details, social links, and applies SEO meta from the API.
// Now with full dark mode support using MUI theme.

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'

// ─── Types matching the public GET /api/admin/about response ─────────────────

interface Contact {
  email?: string
  phone?: string
  address?: string
  workingHours?: string
  supportHours?: string
  supportEmail?: string
  salesEmail?: string
}

interface SocialMedia {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  github?: string
  tiktok?: string
  discord?: string
}

interface Labels {
  [key: string]: string
}

interface Seo {
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

interface Theme {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  borderRadius?: string
}

interface AboutData {
  companyName?: string
  companyDescription?: string
  companyLogo?: string
  companyWebsite?: string
  companyEmail?: string
  foundedYear?: string
  employeeCount?: string
  industry?: string
  contact?: Contact
  socialMedia?: SocialMedia
  labels?: Labels
  seo?: Seo
  theme?: Theme
  system?: {
    timezone?: string
    language?: string
    currency?: string
    currencySymbol?: string
  }
}

// ─── Social platform config ───────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  {
    key: 'facebook',  label: 'Facebook',
    color: '#1877f2', bg: 'rgba(24,119,242,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    key: 'twitter',   label: 'X / Twitter',
    color: '#000000', bg: 'rgba(0,0,0,0.07)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    key: 'instagram', label: 'Instagram',
    color: '#e1306c', bg: 'rgba(225,48,108,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    key: 'linkedin',  label: 'LinkedIn',
    color: '#0a66c2', bg: 'rgba(10,102,194,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    key: 'youtube',   label: 'YouTube',
    color: '#ff0000', bg: 'rgba(255,0,0,0.08)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    key: 'github',    label: 'GitHub',
    color: '#24292e', bg: 'rgba(36,41,46,0.08)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  },
  {
    key: 'tiktok',    label: 'TikTok',
    color: '#010101', bg: 'rgba(1,1,1,0.07)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>,
  },
  {
    key: 'discord',   label: 'Discord',
    color: '#5865f2', bg: 'rgba(88,101,242,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>,
  },
]

// ─── Icon set ─────────────────────────────────────────────────────────────────

const Icon = {
  mail:    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  phone:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
  pin:     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
  clock:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  support: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>,
  web:     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
  building:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  users:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  industry:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12h-4l-3-9L9 21l-3-6H3"/></svg>,
  external:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>,
  refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>,
}

// ─── Theme-based colors helper ────────────────────────────────────────────────

function useThemeColors() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  return {
    isDark,
    bg: isDark ? '#202124' : '#f8f9fa',
    surface: isDark ? '#303134' : '#ffffff',
    surfaceHover: isDark ? '#3c4043' : '#f1f3f4',
    border: isDark ? '#3c4043' : '#e8eaed',
    text: isDark ? '#e8eaed' : '#202124',
    sub: isDark ? '#9aa0a6' : '#5f6368',
    muted: isDark ? '#5f6368' : '#9aa0a6',
    shadow: isDark 
      ? '0 2px 8px rgba(0,0,0,.3)' 
      : '0 2px 8px rgba(60,64,67,.12)',
    skeletonFrom: isDark ? '#3c4043' : '#f0f0f0',
    skeletonTo: isDark ? '#5f6368' : '#e8e8e8',
  }
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h, r = 8, colors }: { w?: string | number; h: number; r?: number; colors: ReturnType<typeof useThemeColors> }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: `linear-gradient(90deg, ${colors.skeletonFrom} 25%, ${colors.skeletonTo} 50%, ${colors.skeletonFrom} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.6s ease-in-out infinite',
    }} />
  )
}

// ─── Contact card ─────────────────────────────────────────────────────────────

function ContactCard({ icon, label, value, href, accent, colors }: {
  icon: React.ReactNode; label: string; value: string; href?: string; accent: string; colors: ReturnType<typeof useThemeColors>
}) {
  const content = (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '18px 20px', borderRadius: 14,
      background: colors.surface, border: `1px solid ${colors.border}`,
      transition: 'box-shadow .2s, transform .2s, background .2s',
      cursor: href ? 'pointer' : 'default',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        if (href) { 
          el.style.boxShadow = colors.shadow
          el.style.transform = 'translateY(-2px)'
          el.style.background = colors.surfaceHover
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
        el.style.background = colors.surface
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}15`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: 5 }}>
          {value}
          {href && <span style={{ color: accent, opacity: .7 }}>{Icon.external}</span>}
        </div>
      </div>
    </div>
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  return content
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, subtitle, accent, colors, children }: {
  title: string; subtitle?: string; accent: string; colors: ReturnType<typeof useThemeColors>; children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: 52 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 4, height: 24, borderRadius: 2, background: accent }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
        </div>
        {subtitle && <p style={{ fontSize: 14, color: colors.sub, margin: '0 0 0 14px', lineHeight: 1.55 }}>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const colors = useThemeColors()
  const [data,    setData]    = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchAbout = async () => {
    setLoading(true); setError(null)
    try {
      const res    = await fetch('/api/admin/about')
      const result = await res.json()
      if (result.success) setData(result.data)
      else setError(result.message || 'Failed to load')
    } catch { setError('Could not reach server') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAbout() }, [])

  // Derive theme values (fall back to Google blue palette)
  const primary   = data?.theme?.primaryColor   || '#1a73e8'
  const secondary = data?.theme?.secondaryColor  || '#1e8e3e'
  const accent    = data?.theme?.accentColor     || '#d93025'
  const yellow    = '#f9ab00'

  // Social links that actually have a value
  const activeSocials = SOCIAL_PLATFORMS.filter(p => data?.socialMedia?.[p.key as keyof SocialMedia])

  // ── Loading skeleton ──
  if (loading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <Skeleton w={80} h={80} r={16} colors={colors} />
        <div style={{ flex: 1 }}>
          <Skeleton w="60%" h={32} r={6} colors={colors} /><div style={{ marginTop: 8 }} />
          <Skeleton w="40%" h={18} r={6} colors={colors} />
        </div>
      </div>
      {[1,2,3].map(i => (
        <div key={i} style={{ marginBottom: 40 }}>
          <Skeleton w="30%" h={26} r={6} colors={colors} />
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Skeleton h={80} r={14} colors={colors} /><Skeleton h={80} r={14} colors={colors} />
            <Skeleton h={80} r={14} colors={colors} /><Skeleton h={80} r={14} colors={colors} />
          </div>
        </div>
      ))}
    </div>
  )

  // ── Error state ──
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24, background: colors.bg }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: accent, marginBottom: 10 }}>Failed to load</h2>
        <p style={{ fontSize: 14, color: colors.sub, marginBottom: 24 }}>{error}</p>
        <button onClick={fetchAbout} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 8, background: primary, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
          {Icon.refresh} Try Again
        </button>
      </div>
    </div>
  )

  if (!data) return null

  return (
    <>
      {/* ── Dynamic SEO head ── */}
      <Head>
        <title>{data.seo?.metaTitle || data.companyName || 'About Us'}</title>
        {data.seo?.metaDescription && <meta name="description" content={data.seo.metaDescription} />}
        {data.seo?.metaKeywords?.length && <meta name="keywords" content={data.seo.metaKeywords.join(', ')} />}
        {data.seo?.ogTitle       && <meta property="og:title"       content={data.seo.ogTitle} />}
        {data.seo?.ogDescription && <meta property="og:description" content={data.seo.ogDescription} />}
        {data.seo?.ogImage       && <meta property="og:image"       content={data.seo.ogImage} />}
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Google Sans', sans-serif; background: ${colors.bg}; color: ${colors.text}; }
        a { text-decoration: none; }
      `}</style>

      <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: "'Google Sans', sans-serif", transition: 'background-color 0.3s ease' }}>

        {/* ════ HERO HEADER ════ */}
        <div style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          padding: '56px 24px 64px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeUp .5s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* Logo */}
              {data.companyLogo ? (
                <img src={data.companyLogo} alt={data.companyName} style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 16, background: 'rgba(255,255,255,.95)', padding: 8 }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {(data.companyName || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  {data.companyName || 'About Us'}
                </h1>
                {data.companyDescription && (
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,.85)', lineHeight: 1.65, maxWidth: 600 }}>
                    {data.companyDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Quick stats row */}
            {(data.foundedYear || data.employeeCount || data.industry || data.companyWebsite) && (
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 32 }}>
                {data.foundedYear && (
                  <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>Founded</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{data.foundedYear}</div>
                  </div>
                )}
                {data.employeeCount && (
                  <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>Team Size</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{data.employeeCount}</div>
                  </div>
                )}
                {data.industry && (
                  <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>Industry</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{data.industry}</div>
                  </div>
                )}
                {data.companyWebsite && (
                  <a href={data.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 16px', color: '#fff', transition: 'background .15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.25)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.15)')}
                  >
                    {Icon.web}
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Visit Website</span>
                    {Icon.external}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ════ MAIN CONTENT ════ */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }}>

          {/* ── Contact ── */}
          {data.contact && Object.values(data.contact).some(Boolean) && (
            <Section title="Get in Touch" subtitle="Multiple ways to reach our team" accent={primary} colors={colors}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {data.contact.email && (
                  <ContactCard icon={Icon.mail} label="Primary Email" value={data.contact.email} href={`mailto:${data.contact.email}`} accent={primary} colors={colors} />
                )}
                {data.contact.supportEmail && (
                  <ContactCard icon={Icon.support} label="Support Email" value={data.contact.supportEmail} href={`mailto:${data.contact.supportEmail}`} accent={secondary} colors={colors} />
                )}
                {data.contact.salesEmail && (
                  <ContactCard icon={Icon.mail} label="Sales Email" value={data.contact.salesEmail} href={`mailto:${data.contact.salesEmail}`} accent={accent} colors={colors} />
                )}
                {data.contact.phone && (
                  <ContactCard icon={Icon.phone} label="Phone" value={data.contact.phone} href={`tel:${data.contact.phone}`} accent={primary} colors={colors} />
                )}
                {data.contact.address && (
                  <ContactCard icon={Icon.pin} label="Address" value={data.contact.address} accent={secondary} colors={colors} />
                )}
                {data.contact.workingHours && (
                  <ContactCard icon={Icon.clock} label="Working Hours" value={data.contact.workingHours} accent={yellow} colors={colors} />
                )}
                {data.contact.supportHours && (
                  <ContactCard icon={Icon.support} label="Support Hours" value={data.contact.supportHours} accent={secondary} colors={colors} />
                )}
              </div>
            </Section>
          )}

          {/* ── Social media ── */}
          {activeSocials.length > 0 && (
            <Section title="Follow Us" subtitle="Stay connected on social media" accent={secondary} colors={colors}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {activeSocials.map(platform => {
                  const url = data.socialMedia![platform.key as keyof SocialMedia]!
                  return (
                    <a key={platform.key} href={url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 50, background: colors.surface, border: `1px solid ${colors.border}`, color: platform.color, fontSize: 14, fontWeight: 600, transition: 'all .18s', textDecoration: 'none' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = platform.bg
                        el.style.borderColor = platform.color + '40'
                        el.style.transform = 'translateY(-2px)'
                        el.style.boxShadow = `0 4px 12px ${platform.color}25`
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = colors.surface
                        el.style.borderColor = colors.border
                        el.style.transform = 'none'
                        el.style.boxShadow = 'none'
                      }}
                    >
                      {platform.icon}
                      {platform.label}
                    </a>
                  )
                })}
              </div>
            </Section>
          )}

          {/* ── Company facts ── */}
          {(data.companyName || data.industry || data.foundedYear || data.companyEmail) && (
            <Section title="About the Company" accent={accent} colors={colors}>
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden' }}>
                {[
                  data.companyName    && { icon: Icon.building, label: 'Company',       value: data.companyName },
                  data.industry       && { icon: Icon.industry,  label: 'Industry',      value: data.industry },
                  data.foundedYear    && { icon: Icon.clock,     label: 'Founded',       value: data.foundedYear },
                  data.employeeCount  && { icon: Icon.users,     label: 'Team Size',     value: data.employeeCount },
                  data.companyEmail   && { icon: Icon.mail,      label: 'Business Email',value: data.companyEmail, href: `mailto:${data.companyEmail}` },
                  data.companyWebsite && { icon: Icon.web,       label: 'Website',       value: data.companyWebsite, href: data.companyWebsite },
                ].filter(Boolean).map((item: any, i, arr) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <span style={{ color: primary, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.muted, width: 120, flexShrink: 0 }}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: primary, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {item.value} {Icon.external}
                      </a>
                    ) : (
                      <span style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Theme preview (for dev reference) ── */}
          {data.theme && (
            <Section title="Brand Colors" subtitle="Current theme applied across the app" accent={yellow} colors={colors}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'Primary',    color: data.theme.primaryColor    || primary },
                  { label: 'Secondary',  color: data.theme.secondaryColor  || secondary },
                  { label: 'Accent',     color: data.theme.accentColor     || accent },
                  { label: 'Background', color: data.theme.backgroundColor || colors.surface },
                  { label: 'Text',       color: data.theme.textColor       || colors.text },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: c.color, border: '2px solid rgba(0,0,0,.08)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>{c.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{c.color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Refresh button ── */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <button onClick={fetchAbout} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.sub, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', transition: 'all .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = primary; (e.currentTarget as HTMLButtonElement).style.color = primary }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border; (e.currentTarget as HTMLButtonElement).style.color = colors.sub }}
            >
              {Icon.refresh} Refresh
            </button>
          </div>

        </div>
      </div>
    </>
  )
}