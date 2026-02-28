'use client'

// app/support/page.tsx
// User-facing support page. Zero MUI. Pure React + inline styles.
// Features:
// - Create new ticket (subject, category, priority, message)
// - View own tickets list
// - Open ticket thread and add replies
// - See status badges and real-time reply thread
// Calls: POST /api/support, GET /api/support, GET /api/support/[id], POST /api/support/[id]/reply

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useTheme } from '@mui/material/styles'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reply {
  message: string
  isAdmin: boolean
  createdAt: string
}

interface SupportTicket {
  _id: string
  ticketNumber?: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  category?: string
  replies: Reply[]
  createdAt: string
  updatedAt: string
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
    border: isDark ? '#3c4043' : '#dadce0',
    text: isDark ? '#e8eaed' : '#202124',
    sub: isDark ? '#9aa0a6' : '#5f6368',
    muted: isDark ? '#5f6368' : '#80868b',
    inputBg: isDark ? '#3c4043' : '#ffffff',
    inputBorder: isDark ? '#5f6368' : '#dadce0',
    shadow: isDark 
      ? '0 4px 20px rgba(0,0,0,.5)' 
      : '0 4px 20px rgba(60,64,67,.15)',
    cardShadow: isDark
      ? '0 1px 3px rgba(0,0,0,.5)'
      : '0 1px 3px rgba(60,64,67,.08)',
    hoverShadow: isDark
      ? '0 4px 12px rgba(0,0,0,.6)'
      : '0 4px 12px rgba(60,64,67,.2)',
    skeletonBg: isDark ? '#3c4043' : '#f0f0f0',
    skeletonHighlight: isDark ? '#5f6368' : '#e0e0e0',
  }
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function statusColor(s: string) {
  return { open: '#1a73e8', 'in-progress': '#f9ab00', resolved: '#34a853', closed: '#5f6368' }[s] ?? '#5f6368'
}
function statusBg(s: string) {
  return {
    open: 'rgba(26,115,232,0.10)',
    'in-progress': 'rgba(249,171,0,0.12)',
    resolved: 'rgba(52,168,83,0.10)',
    closed: 'rgba(95,99,104,0.10)',
  }[s] ?? 'rgba(95,99,104,0.10)'
}
function priorityColor(p: string) {
  return { urgent: '#ea4335', high: '#f57c00', medium: '#f9ab00', low: '#34a853' }[p] ?? '#5f6368'
}
function priorityBg(p: string) {
  return {
    urgent: 'rgba(234,67,53,0.10)',
    high:   'rgba(245,124,0,0.10)',
    medium: 'rgba(249,171,0,0.12)',
    low:    'rgba(52,168,83,0.10)',
  }[p] ?? 'rgba(95,99,104,0.10)'
}
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = {
  plus:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  back:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  send:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>,
  chat:    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>,
  check:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  warn:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  close:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  clock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  support: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>,
  filter:  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>,
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose, colors }: { msg: string; type: 'success' | 'error'; onClose: () => void; colors: ReturnType<typeof useThemeColors> }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const c = type === 'success' ? '#34a853' : '#ea4335'
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 24, 
      right: 24, 
      background: colors.surface, 
      border: `1px solid ${c}40`, 
      borderLeft: `4px solid ${c}`, 
      borderRadius: 12, 
      padding: '14px 20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      zIndex: 9999, 
      boxShadow: colors.shadow, 
      animation: 'slideInRight .2s ease', 
      minWidth: 300, 
      maxWidth: 400,
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ color: c, display: 'flex', alignItems: 'center' }}>{type === 'success' ? Ico.check : Ico.warn}</span>
      <span style={{ fontSize: 14, color: colors.text, flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.muted, padding: 0, display: 'flex', opacity: 0.7, transition: 'opacity .15s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
      >{Ico.close}</button>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const icons: Record<string, string> = { 
    open: '🟢', 
    'in-progress': '🟡', 
    resolved: '✅', 
    closed: '🔴' 
  }
  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 6, 
      padding: '4px 12px', 
      borderRadius: 30, 
      background: statusBg(status), 
      color: statusColor(status), 
      fontSize: 12, 
      fontWeight: 600, 
      textTransform: 'capitalize',
      letterSpacing: '0.3px',
    }}>
      <span style={{ fontSize: 14 }}>{icons[status] ?? '⚪'}</span> 
      {status.replace('-', ' ')}
    </span>
  )
}

// ─── Priority badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: string }) {
  const icons: Record<string, string> = { 
    low: '🟢', 
    medium: '🟡', 
    high: '🟠', 
    urgent: '🔴' 
  }
  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 6, 
      padding: '4px 12px', 
      borderRadius: 30, 
      background: priorityBg(priority), 
      color: priorityColor(priority), 
      fontSize: 12, 
      fontWeight: 600, 
      textTransform: 'capitalize',
    }}>
      <span style={{ fontSize: 14 }}>{icons[priority]}</span> {priority}
    </span>
  )
}

// ─── Create Ticket Form ───────────────────────────────────────────────────────

function CreateTicketForm({ onSuccess, onCancel, colors }: { onSuccess: (t: SupportTicket) => void; onCancel: () => void; colors: ReturnType<typeof useThemeColors> }) {
  const [form, setForm]   = useState({ subject: '', message: '', category: 'general', priority: 'medium' })
  const [submitting, setSub] = useState(false)
  const [errors, setErrors]  = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.subject.trim()) e.subject = 'Subject is required'
    else if (form.subject.length < 5) e.subject = 'Subject must be at least 5 characters'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.length < 20) e.message = 'Please describe your issue in at least 20 characters'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSub(true)
    try {
      const res  = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create ticket')
      onSuccess(data.ticket)
    } catch (e: any) { setErrors({ submit: e.message }) }
    finally { setSub(false) }
  }

  const field = (key: string) => (value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: 12,
    border: `1px solid ${colors.inputBorder}`, 
    background: colors.inputBg,
    fontSize: 14, 
    color: colors.text, 
    outline: 'none', 
    fontFamily: 'inherit',
    transition: 'all .2s ease', 
    boxSizing: 'border-box',
  }
  const errorStyle: React.CSSProperties = { fontSize: 12, color: '#ea4335', marginTop: 6, marginLeft: 4 }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: colors.sub, marginBottom: 6 }

  return (
    <div style={{ 
      background: colors.surface, 
      border: `1px solid ${colors.border}`, 
      borderRadius: 20, 
      overflow: 'hidden', 
      boxShadow: colors.shadow,
      animation: 'fadeUp .3s ease',
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)', 
        padding: '24px 28px' 
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
          Create Support Ticket
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', marginTop: 6, lineHeight: 1.5 }}>
          Describe your issue and we'll get back to you within 24 hours
        </p>
      </div>

      <div style={{ padding: '28px' }}>
        {errors.submit && (
          <div style={{ 
            background: 'rgba(234,67,53,.08)', 
            border: '1px solid rgba(234,67,53,.3)', 
            borderRadius: 12, 
            padding: '14px 18px', 
            marginBottom: 24, 
            fontSize: 14, 
            color: '#ea4335', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10 
          }}>
            {Ico.warn} {errors.submit}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Subject *</label>
          <input
            value={form.subject} onChange={e => field('subject')(e.target.value)}
            placeholder="Brief summary of your issue"
            maxLength={200}
            style={{ 
              ...inputStyle, 
              borderColor: errors.subject ? '#ea4335' : colors.inputBorder,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = errors.subject ? '#ea4335' : '#1a73e8'
              e.currentTarget.style.boxShadow = `0 0 0 3px ${errors.subject ? 'rgba(234,67,53,0.1)' : 'rgba(26,115,232,0.1)'}`
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = errors.subject ? '#ea4335' : colors.inputBorder
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
          <p style={{ fontSize: 11, color: colors.muted, marginTop: 6, textAlign: 'right' }}>{form.subject.length}/200</p>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <select 
              value={form.category} 
              onChange={e => field('category')(e.target.value)}
              style={inputStyle}
            >
              <option value="general">General Inquiry</option>
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Support</option>
              <option value="account">Account Issues</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Priority</label>
            <select 
              value={form.priority} 
              onChange={e => field('priority')(e.target.value)}
              style={inputStyle}
            >
              <option value="low">🟢 Low - General question</option>
              <option value="medium">🟡 Medium - Need assistance</option>
              <option value="high">🟠 High - Blocking work</option>
              <option value="urgent">🔴 Urgent - Critical issue</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Message *</label>
          <textarea
            value={form.message} onChange={e => field('message')(e.target.value)}
            placeholder="Describe your issue in detail. Include steps to reproduce if applicable…"
            rows={6} maxLength={5000}
            style={{ 
              ...inputStyle, 
              resize: 'vertical', 
              minHeight: 140,
              borderColor: errors.message ? '#ea4335' : colors.inputBorder,
              lineHeight: 1.6,
            } as React.CSSProperties}
            onFocus={e => {
              e.currentTarget.style.borderColor = errors.message ? '#ea4335' : '#1a73e8'
              e.currentTarget.style.boxShadow = `0 0 0 3px ${errors.message ? 'rgba(234,67,53,0.1)' : 'rgba(26,115,232,0.1)'}`
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = errors.message ? '#ea4335' : colors.inputBorder
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {errors.message && <p style={errorStyle}>{errors.message}</p>}
          <p style={{ fontSize: 11, color: colors.muted, marginTop: 6, textAlign: 'right' }}>{form.message.length}/5000</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              padding: '12px 28px', 
              borderRadius: 40, 
              border: 'none', 
              background: submitting ? colors.muted : '#1a73e8', 
              color: '#fff', 
              fontSize: 15, 
              fontWeight: 600, 
              cursor: submitting ? 'not-allowed' : 'pointer', 
              fontFamily: 'inherit', 
              transition: 'all .2s',
              opacity: submitting ? 0.7 : 1,
            }}
            onMouseEnter={e => !submitting && (e.currentTarget.style.background = '#1557b0')}
            onMouseLeave={e => !submitting && (e.currentTarget.style.background = '#1a73e8')}
          >
            {submitting
              ? <><span style={{ width: 16, height: 16, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> Submitting…</>
              : <>{Ico.send} Submit Ticket</>
            }
          </button>
          <button 
            onClick={onCancel} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: 40, 
              border: `1px solid ${colors.border}`, 
              background: 'transparent', 
              color: colors.sub, 
              fontSize: 15, 
              fontWeight: 500, 
              cursor: 'pointer', 
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = colors.surfaceHover
              e.currentTarget.style.borderColor = colors.sub
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = colors.border
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Ticket Thread View ───────────────────────────────────────────────────────

function TicketThread({ ticket, onBack, onUpdate, colors }: { ticket: SupportTicket; onBack: () => void; onUpdate: (t: SupportTicket) => void; colors: ReturnType<typeof useThemeColors> }) {
  const [reply,    setReply]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket.replies.length])

  const handleSend = async () => {
    if (!reply.trim() || sending || ticket.status === 'closed') return
    setSending(true); setError('')
    try {
      const res  = await fetch(`/api/support/${ticket._id}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: reply }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send reply')
      setReply('')
      onUpdate(data.ticket)
    } catch (e: any) { setError(e.message) }
    finally { setSending(false) }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 180px)', 
      background: colors.surface, 
      border: `1px solid ${colors.border}`, 
      borderRadius: 20, 
      overflow: 'hidden',
      boxShadow: colors.shadow,
    }}>
      {/* Thread header */}
      <div style={{ 
        background: colors.surfaceHover, 
        borderBottom: `1px solid ${colors.border}`, 
        padding: '16px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 14 
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            background: 'none', 
            border: 'none', 
            color: '#1a73e8', 
            cursor: 'pointer', 
            fontSize: 14, 
            fontWeight: 500, 
            padding: '6px 12px',
            borderRadius: 30,
            transition: 'all .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,115,232,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          {Ico.back} Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: colors.muted, letterSpacing: '0.5px' }}>
              {ticket.ticketNumber || `#${ticket._id.slice(-8).toUpperCase()}`}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{ticket.subject}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 16,
        background: colors.bg,
      }}>
        {/* Original message */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            background: 'rgba(26,115,232,0.1)', 
            color: '#1a73e8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: 14, 
            fontWeight: 600, 
            flexShrink: 0 
          }}>
            Y
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>You</span>
              <span style={{ fontSize: 11, color: colors.muted }}>· {timeAgo(ticket.createdAt)}</span>
            </div>
            <div style={{ 
              background: colors.surface, 
              border: `1px solid ${colors.border}`, 
              borderRadius: '16px 16px 16px 4px', 
              padding: '16px 20px', 
              fontSize: 14, 
              color: colors.text, 
              lineHeight: 1.7, 
              whiteSpace: 'pre-wrap',
              boxShadow: colors.cardShadow,
            }}>
              {ticket.message}
            </div>
          </div>
        </div>

        {/* Replies */}
        {ticket.replies.map((r, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            flexDirection: r.isAdmin ? 'row-reverse' : 'row', 
            gap: 12, 
            alignItems: 'flex-start' 
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: r.isAdmin ? 'rgba(52,168,83,0.1)' : 'rgba(26,115,232,0.1)',
              color: r.isAdmin ? '#34a853' : '#1a73e8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {r.isAdmin ? 'S' : 'Y'}
            </div>
            <div style={{ flex: 1, maxWidth: '80%' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                marginBottom: 4,
                justifyContent: r.isAdmin ? 'flex-end' : 'flex-start',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
                  {r.isAdmin ? 'Support Team' : 'You'}
                </span>
                <span style={{ fontSize: 11, color: colors.muted }}>· {timeAgo(r.createdAt)}</span>
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: r.isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: r.isAdmin ? 'rgba(52,168,83,0.05)' : colors.surface,
                border: `1px solid ${r.isAdmin ? 'rgba(52,168,83,0.2)' : colors.border}`,
                fontSize: 14, 
                color: colors.text, 
                lineHeight: 1.7, 
                whiteSpace: 'pre-wrap',
                boxShadow: colors.cardShadow,
              }}>
                {r.message}
              </div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* Reply input */}
      <div style={{ 
        background: colors.surface, 
        borderTop: `1px solid ${colors.border}`, 
        padding: '20px 24px' 
      }}>
        {ticket.status === 'closed' ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '16px', 
            fontSize: 14, 
            color: colors.muted, 
            background: colors.bg,
            borderRadius: 12,
            border: `1px dashed ${colors.border}`,
          }}>
            This ticket is closed. Open a new ticket if you need further help.
          </div>
        ) : (
          <>
            {error && <div style={{ 
              fontSize: 13, 
              color: '#ea4335', 
              marginBottom: 12, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              padding: '8px 12px',
              background: 'rgba(234,67,53,0.05)',
              borderRadius: 8,
            }}>
              {Ico.warn} {error}
            </div>}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <textarea
                value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend() }}
                placeholder={ticket.status === 'resolved' ? "This ticket is resolved. Your reply will reopen it." : "Type your reply… (Ctrl+Enter to send)"}
                rows={3}
                style={{ 
                  flex: 1, 
                  padding: '14px 18px', 
                  borderRadius: 16, 
                  border: `1px solid ${colors.inputBorder}`, 
                  background: colors.inputBg, 
                  color: colors.text, 
                  fontSize: 14, 
                  fontFamily: 'inherit', 
                  lineHeight: 1.6, 
                  resize: 'none', 
                  outline: 'none', 
                  transition: 'all .2s',
                } as React.CSSProperties}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1a73e8'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = colors.inputBorder
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button 
                onClick={handleSend} 
                disabled={!reply.trim() || sending}
                style={{ 
                  padding: '14px 24px', 
                  borderRadius: 40, 
                  border: 'none', 
                  background: !reply.trim() || sending ? colors.muted : '#1a73e8', 
                  color: '#fff', 
                  fontSize: 15, 
                  fontWeight: 600, 
                  cursor: !reply.trim() || sending ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  fontFamily: 'inherit', 
                  transition: 'all .2s',
                  opacity: !reply.trim() || sending ? 0.7 : 1,
                }}
              >
                {sending
                  ? <span style={{ width: 16, height: 16, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
                  : Ico.send
                }
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Ticket list card ─────────────────────────────────────────────────────────

function TicketCard({ ticket, onClick, colors }: { ticket: SupportTicket; onClick: () => void; colors: ReturnType<typeof useThemeColors> }) {
  const hasUnread = ticket.replies.length > 0 && ticket.replies[ticket.replies.length - 1].isAdmin
  
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '20px',
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all .2s ease',
        boxShadow: colors.cardShadow,
        borderLeft: `4px solid ${statusColor(ticket.status)}`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = colors.hoverShadow
        el.style.transform = 'translateY(-2px)'
        el.style.background = colors.surfaceHover
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = colors.cardShadow
        el.style.transform = 'none'
        el.style.background = colors.surface
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.muted, letterSpacing: '0.5px' }}>
              {ticket.ticketNumber || `#${ticket._id.slice(-8).toUpperCase()}`}
            </span>
            {hasUnread && (
              <span style={{ 
                padding: '2px 10px', 
                borderRadius: 30, 
                background: '#1a73e8', 
                color: '#fff', 
                fontSize: 10, 
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
            {ticket.subject}
          </div>
          <div style={{ 
            fontSize: 13, 
            color: colors.sub, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
            marginBottom: 12,
          }}>
            {ticket.message}
          </div>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <PriorityBadge priority={ticket.priority} />
        {ticket.category && (
          <span style={{ 
            fontSize: 12, 
            color: colors.sub, 
            background: colors.bg,
            padding: '4px 10px',
            borderRadius: 30,
          }}>
            {ticket.category}
          </span>
        )}
        <span style={{ fontSize: 12, color: colors.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
          {Ico.clock} {timeAgo(ticket.createdAt)}
        </span>
        {ticket.replies.length > 0 && (
          <span style={{ fontSize: 12, color: colors.sub, display: 'flex', alignItems: 'center', gap: 4 }}>
            {Ico.chat} {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function UserSupportPage() {
  const colors = useThemeColors()
  const [view,     setView]     = useState<'list' | 'create' | 'thread'>('list')
  const [tickets,  setTickets]  = useState<SupportTicket[]>([])
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('')
  const [toast,    setToast]    = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type }), [])

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/support')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to load')
      setTickets(data.tickets || [])
    } catch (e: any) { showToast(e.message || 'Failed to load tickets', 'error') }
    finally { setLoading(false) }
  }, [showToast])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const openTicket = (ticket: SupportTicket) => {
    setSelected(ticket)
    setView('thread')
  }

  const handleCreated = (ticket: SupportTicket) => {
    setTickets(prev => [ticket, ...prev])
    showToast(`Ticket ${ticket.ticketNumber || ''} created successfully!`)
    setSelected(ticket)
    setView('thread')
  }

  const handleUpdated = (ticket: SupportTicket) => {
    setTickets(prev => prev.map(t => t._id === ticket._id ? ticket : t))
    setSelected(ticket)
  }

  const filtered = filter
    ? tickets.filter(t => t.status === filter)
    : tickets

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  }

  const filterOptions = [
    { label: 'All', value: '', count: stats.total },
    { label: 'Open', value: 'open', count: stats.open },
    { label: 'In Progress', value: 'in-progress', count: stats.inProgress },
    { label: 'Resolved', value: 'resolved', count: stats.resolved },
  ]

  const content = (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        input, textarea, select, button { font-family: 'Google Sans', sans-serif; }
      `}</style>

      {/* Hero header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)', 
        padding: '40px 24px 48px', 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '0 0 30px 30px',
        marginBottom: 24,
      }}>
        <div style={{ 
          position: 'absolute', 
          top: -60, 
          right: -60, 
          width: 300, 
          height: 300, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,.05)', 
          pointerEvents: 'none' 
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: -80, 
          left: '20%', 
          width: 250, 
          height: 250, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,.04)', 
          pointerEvents: 'none' 
        }} />
        
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 16 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 20, 
                background: 'rgba(255,255,255,.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff',
                fontSize: 28,
              }}>
                {Ico.support}
              </div>
              <div>
                <h1 style={{ 
                  fontSize: 28, 
                  fontWeight: 800, 
                  color: '#fff', 
                  letterSpacing: '-0.02em', 
                  marginBottom: 4 
                }}>
                  Support Center
                </h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,.85)' }}>
                  We usually respond within 24 hours
                </p>
              </div>
            </div>
            
            {view === 'list' && (
              <button 
                onClick={() => setView('create')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: '12px 24px', 
                  borderRadius: 40, 
                  border: 'none', 
                  background: '#fff', 
                  color: '#1a73e8', 
                  fontSize: 15, 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 12px rgba(0,0,0,.15)', 
                  transition: 'all .2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.15)'
                }}
              >
                {Ico.plus} New Ticket
              </button>
            )}
          </div>

          {/* Filter tabs */}
          {view === 'list' && (
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              marginTop: 32, 
              flexWrap: 'wrap',
              borderBottom: '1px solid rgba(255,255,255,.2)',
              paddingBottom: 8,
            }}>
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 40,
                    border: 'none',
                    background: filter === option.value ? '#fff' : 'rgba(255,255,255,.15)',
                    color: filter === option.value ? '#1a73e8' : '#fff',
                    fontSize: 14,
                    fontWeight: filter === option.value ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all .2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span style={{
                      background: filter === option.value ? 'rgba(26,115,232,0.1)' : 'rgba(255,255,255,.3)',
                      padding: '2px 8px',
                      borderRadius: 30,
                      fontSize: 12,
                    }}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 40px' }}>

        {/* Create form */}
        {view === 'create' && (
          <CreateTicketForm
            onSuccess={handleCreated}
            onCancel={() => setView('list')}
            colors={colors}
          />
        )}

        {/* Thread view */}
        {view === 'thread' && selected && (
          <TicketThread
            ticket={selected}
            onBack={() => setView('list')}
            onUpdate={handleUpdated}
            colors={colors}
          />
        )}

        {/* Ticket list */}
        {view === 'list' && (
          <>
            {/* List header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: 20 
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>
                Your Tickets
                {filter && (
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: 400, 
                    color: colors.sub, 
                    marginLeft: 10 
                  }}>
                    · Filtered by {filter.replace('-', ' ')}
                  </span>
                )}
              </h2>
              <button 
                onClick={fetchTickets} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  background: 'none', 
                  border: 'none', 
                  color: '#1a73e8', 
                  cursor: 'pointer', 
                  fontSize: 14, 
                  fontWeight: 500, 
                  padding: '6px 12px',
                  borderRadius: 30,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,115,232,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {Ico.refresh} Refresh
              </button>
            </div>

            {/* Loading skeletons - FIXED THE BACKGROUND ERROR */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => (
                  <div 
                    key={i} 
                    style={{ 
                      height: 140, 
                      borderRadius: 16, 
                      backgroundImage: `linear-gradient(90deg, ${colors.skeletonBg} 25%, ${colors.skeletonHighlight} 50%, ${colors.skeletonBg} 75%)`,
                      backgroundSize: '200% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '0 0',
                      animation: 'shimmer 1.5s infinite',
                    }} 
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ 
                background: colors.surface, 
                border: `1px solid ${colors.border}`, 
                borderRadius: 24, 
                padding: '80px 24px', 
                textAlign: 'center', 
                boxShadow: colors.cardShadow,
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎫</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 8 }}>
                  {filter ? `No ${filter.replace('-', ' ')} tickets` : 'No tickets yet'}
                </h3>
                <p style={{ fontSize: 15, color: colors.sub, marginBottom: 24, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 24px' }}>
                  {filter 
                    ? 'Try changing the filter above.' 
                    : 'Having an issue? Create a support ticket and our team will help you out.'
                  }
                </p>
                {!filter && (
                  <button 
                    onClick={() => setView('create')}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: '12px 28px', 
                      borderRadius: 40, 
                      border: 'none', 
                      background: '#1a73e8', 
                      color: '#fff', 
                      fontSize: 15, 
                      fontWeight: 600, 
                      cursor: 'pointer', 
                      transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1557b0'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,115,232,0.3)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#1a73e8'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {Ico.plus} Create Your First Ticket
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(ticket => (
                  <TicketCard 
                    key={ticket._id} 
                    ticket={ticket} 
                    onClick={() => openTicket(ticket)} 
                    colors={colors} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} colors={colors} />}
    </>
  )

  return (
    <MainLayout title="Support Center">
      {content}
    </MainLayout>
  )
}