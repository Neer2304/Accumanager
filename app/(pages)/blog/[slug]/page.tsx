'use client';

// app/blog/[slug]/page.tsx
// Theme: MUI useTheme for dark/light detection
// Rendering: zero MUI components — pure React + inline styles

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { MainLayout } from '@/components/Layout/MainLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RelatedPost {
  id: string; title: string; slug: string;
  excerpt: string; readTime: number; coverImage: string;
}
interface Post {
  id: string; title: string; slug: string; excerpt: string; content: string;
  author: { name: string; role: string; avatar?: string };
  category: { id: string; name: string; slug: string };
  tags: string[]; coverImage: string; readTime: number;
  featured: boolean; publishedAt: string;
  views: number; likes: number; relatedPosts: RelatedPost[];
}

// ─── Google colors (fixed, not theme dependent) ─────────────────────────────

const G = {
  blue:        '#1a73e8',
  green:       '#1e8e3e',
  yellow:      '#f9ab00',
  red:         '#d93025',
  blueSoft:    'rgba(26,115,232,0.09)',
  greenSoft:   'rgba(30,142,62,0.09)',
  yellowSoft:  'rgba(249,171,0,0.11)',
  redSoft:     'rgba(217,48,37,0.09)',
};

// ─── Design tokens based on MUI theme ───────────────────────────────────────

function useTokens() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return {
    // Use MUI theme colors directly
    bg: theme.palette.background.default,
    bgSurface: theme.palette.background.paper,
    bgElevated: isDark ? '#26282c' : '#ffffff',
    bgSubtle: isDark ? '#2d3034' : '#f1f3f4',
    border: theme.palette.divider,
    text: theme.palette.text.primary,
    textSub: theme.palette.text.secondary,
    textMuted: isDark ? '#5f6368' : '#80868b',
    shadow: isDark 
      ? '0 1px 3px rgba(0,0,0,.55), 0 4px 10px rgba(0,0,0,.4)'
      : '0 1px 2px rgba(60,64,67,.15), 0 2px 6px rgba(60,64,67,.10)',
    shadowHover: isDark
      ? '0 4px 12px rgba(0,0,0,.65), 0 12px 28px rgba(0,0,0,.45)'
      : '0 4px 12px rgba(60,64,67,.22), 0 8px 24px rgba(60,64,67,.14)',
  };
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const Ico = {
  back:  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  chev:  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>,
  home:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  book:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>,
  clock: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  eye:   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>,
  heart: (f: boolean) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">{f ? <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/> : <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>}</svg>,
  save:  (f: boolean) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">{f ? <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/> : <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>}</svg>,
  link:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 000 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 000-10z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  email: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  dl:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>,
  print: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>,
  up:    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>,
  star:  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  tag:   <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7a2 2 0 00.59 1.42l9 9A2 2 0 0013 22a2 2 0 001.41-.59l7-7A2 2 0 0022 13a2 2 0 00-.59-1.42zM5.5 7A1.5 1.5 0 117 5.5 1.5 1.5 0 015.5 7z"/></svg>,
  toc:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/></svg>,
  x:     <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  li:    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  fb:    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  wa:    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

// ─── Detect if content is HTML ────────────────────────────────────────────────

const isHTML = (s: string) => /<[a-z][\s\S]*>/i.test(s);

// Strip HTML tags to count words for read-time
const stripHTML = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// ─── Reading progress bar ─────────────────────────────────────────────────────

function ReadingBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const u = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setPct(dh > 0 ? Math.min((window.scrollY / dh) * 100, 100) : 0);
    };
    window.addEventListener('scroll', u, { passive: true });
    return () => window.removeEventListener('scroll', u);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, pointerEvents: 'none' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: `linear-gradient(90deg,${G.blue},${G.green},${G.yellow},${G.red})`,
        transition: 'width 80ms linear',
      }} />
    </div>
  );
}

// ─── Scroll to top ────────────────────────────────────────────────────────────

function ScrollTop({ T }: { T: ReturnType<typeof useTokens> }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const u = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', u, { passive: true });
    return () => window.removeEventListener('scroll', u);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 999,
        width: 44, height: 44, borderRadius: '50%',
        background: G.blue, color: '#fff',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${G.blue}55`, transition: 'transform .2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >{Ico.up}</button>
  );
}

// ─── Table of contents ────────────────────────────────────────────────────────

function TOC({ content, T }: { content: string; T: ReturnType<typeof useTokens> }) {
  const [active, setActive] = useState('');
  const headings = (content?.split('\n') ?? [])
    .filter(l => /^#{1,3}\s/.test(l))
    .map(h => ({
      level: h.match(/^#+/)?.[0].length ?? 1,
      text:  h.replace(/^#+\s*/, '').trim(),
      id:    h.replace(/^#+\s*/, '').trim().toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-'),
    }));

  useEffect(() => {
    const u = () => {
      const y = window.scrollY + 110;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.offsetTop <= y) { setActive(headings[i].id); break; }
      }
    };
    window.addEventListener('scroll', u, { passive: true });
    return () => window.removeEventListener('scroll', u);
  }, [headings.length]);

  if (!headings.length) return null;

  return (
    <nav style={{
      borderRadius: 12, border: `1px solid ${T.border}`,
      background: T.bgSurface, position: 'sticky', top: 80,
      maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
      padding: '16px 0',
    }}>
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: G.blue }}>{Ico.toc}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.textSub }}>Contents</span>
      </div>
      <div style={{ height: 1, background: T.border, marginBottom: 6 }} />
      {headings.map((h, i) => {
        const on = active === h.id;
        return (
          <button key={i}
            onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              border: 'none', cursor: 'pointer',
              padding: `6px 16px 6px ${16 + (h.level - 1) * 14}px`,
              background: on ? G.blueSoft : 'transparent',
              color: on ? G.blue : T.textSub,
              fontSize: 13, fontWeight: on ? 600 : 400,
              borderLeft: `2px solid ${on ? G.blue : 'transparent'}`,
              transition: 'all .15s', lineHeight: 1.45,
            }}
          >{h.text}</button>
        );
      })}
    </nav>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, avatar, size = 46 }: { name: string; avatar?: string; size?: number }) {
  const palette = [G.blue, G.green, G.red, '#9c27b0', '#e67e22'];
  const bg = palette[name.charCodeAt(0) % palette.length];
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  if (avatar) return <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700,
    }}>{initials}</div>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────

function ShareBtn({ label, color, bgHover, onClick, icon }: {
  label: string; color: string; bgHover: string; onClick: () => void; icon: React.ReactNode;
}) {
  const [h, setH] = useState(false);
  return (
    <button title={label} aria-label={label} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? bgHover : 'transparent', color,
        transition: 'background .15s, transform .15s',
        transform: h ? 'translateY(-2px)' : 'none',
      }}
    >{icon}</button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skel({ h, w = '100%', r = 8, T }: { h: number; w?: string | number; r?: number; T: ReturnType<typeof useTokens> }) {
  return (
    <div style={{
      height: h, 
      width: w, 
      borderRadius: r, 
      marginBottom: 12,
      // Use separate background properties instead of the shorthand
      backgroundImage: `linear-gradient(90deg, ${T.bgSurface} 0%, ${T.bgElevated} 50%, ${T.bgSurface} 100%)`,
      backgroundSize: '200% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 0',
      animation: 'shimmer 1.6s ease-in-out infinite',
    }} />
  );
}

// ─── Content renderer — HTML & Markdown ──────────────────────────────────────

function Content({ content, T, dark }: { content: string; T: ReturnType<typeof useTokens>; dark: boolean }) {
  const [MD, setMD] = useState<React.ComponentType<{ children: string }> | null>(null);

  useEffect(() => {
    if (!isHTML(content)) {
      // Dynamically import to keep bundle lighter
      import('react-markdown').then(m => setMD(() => m.default as any));
    }
  }, [content]);

  if (isHTML(content)) {
    return <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (!MD) return <div style={{ color: T.textSub, padding: 20 }}>Loading…</div>;
  return <div className="blog-content"><MD>{content}</MD></div>;
}

// ─── Main page ────────────────────────────────────────────────────────────────

function BlogPostContent() {
  const params    = useParams();
  const router    = useRouter();
  const theme     = useTheme();
  const dark      = theme.palette.mode === 'dark';
  const T         = useTokens();
  const slug      = params?.slug as string;

  const [post,     setPost]     = useState<Post | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [readTime, setReadTime] = useState(0);

  const loadPost = useCallback(async () => {
    if (!slug) { setError('Invalid post slug'); setLoading(false); return; }
    try {
      setLoading(true); setError(null);
      const res  = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
        const words = stripHTML(data.data.content ?? '').split(/\s+/).filter(Boolean).length;
        setReadTime(Math.max(1, Math.ceil(words / 200)) || data.data.readTime || 5);
      } else {
        setError(data.message || 'Post not found');
      }
    } catch { setError('Failed to load post.'); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { loadPost(); }, [loadPost]);

  const share = async (platform: string) => {
    const url = window.location.href, title = post?.title ?? '';
    const map: Record<string, string> = {
      x:        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      email:    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out: ' + url)}`,
    };
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } else window.open(map[platform], '_blank');
  };

  const download = () => {
    if (!post) return;
    const text = stripHTML(post.content);
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([`# ${post.title}\n\n${post.excerpt}\n\n${text}`], { type: 'text/plain' })),
      download: `${post.slug}.txt`,
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  // ── Shared card style ──
  const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 14, ...extra,
  });

  // ── Loading ──
  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '80px 20px 40px' }}>
      <style>{`@keyframes shimmer{0%,100%{background-position:200% 0}50%{background-position:0 0}}`}</style>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Skel h={18} w={210} T={T} /><Skel h={44} T={T} r={4} /><Skel h={52} T={T} r={4} />
        <Skel h={260} T={T} r={14} />
        {[1,2,3,4,5].map(i => <Skel key={i} h={19} w={`${92-i*7}%`} T={T} />)}
      </div>
    </div>
  );

  // ── Error ──
  if (error || !post) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: G.red, marginBottom: 10 }}>Article Not Found</h2>
        <p style={{ color: T.textSub, marginBottom: 28, lineHeight: 1.65 }}>{error || "This article doesn't exist or was removed."}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => router.back()} style={{ padding: '10px 22px', borderRadius: 24, border: `1px solid ${T.border}`, background: 'transparent', color: T.text, cursor: 'pointer', fontWeight: 500 }}>
            ← Go Back
          </button>
          <Link href="/blog" style={{ padding: '10px 22px', borderRadius: 24, background: G.blue, color: '#fff', textDecoration: 'none', fontWeight: 500 }}>
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <ReadingBar />
      <ScrollTop T={T} />

      {/* ── Global CSS ── */}
      <style>{`
        @keyframes shimmer{0%,100%{background-position:200% 0}50%{background-position:0 0}}

        /* ─ Blog content: handles HTML from rich-text editors AND Markdown ─ */
        .blog-content{
          font-size:1.06rem;line-height:1.85;color:${T.text};
          word-break:break-word;
        }

        /* Headings */
        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4{
          font-weight:700;color:${T.text};scroll-margin-top:90px;
          margin:2rem 0 .9rem;line-height:1.25;
        }
        .blog-content h1{font-size:1.95rem;border-bottom:2px solid ${T.border};padding-bottom:.5rem}
        .blog-content h2{font-size:1.55rem;border-bottom:1px solid ${T.border};padding-bottom:.3rem}
        .blog-content h3{font-size:1.25rem}
        .blog-content h4{font-size:1.05rem;color:${T.textSub}}

        /* Paragraphs — strip empty <p> from editors like Tiptap */
        .blog-content p{margin:0 0 1rem;color:${T.text};line-height:1.85}
        .blog-content p:empty,.blog-content p br:only-child{display:none}

        /* Lists — fix double-bullets from HTML editors */
        .blog-content ul,.blog-content ol{padding-left:1.5rem;margin:0 0 1rem}
        .blog-content li{margin-bottom:.35rem;line-height:1.75;color:${T.text}}
        .blog-content li::marker{color:${G.blue}}
        .blog-content ul>li{list-style-type:disc}
        .blog-content ol>li{list-style-type:decimal}
        /* prevent nested <ul> inside <li><p> from duplicating bullets */
        .blog-content li>p{margin:0;display:inline}

        /* Inline text formatting from rich-text editors */
        .blog-content strong,.blog-content b{font-weight:700;color:${T.text}}
        .blog-content em,.blog-content i{font-style:italic}
        .blog-content u{text-decoration:underline;text-underline-offset:3px}
        .blog-content s,.blog-content strike,.blog-content del{text-decoration:line-through;color:${T.textSub}}
        .blog-content mark{background:${G.yellowSoft};padding:1px 4px;border-radius:3px}
        .blog-content sub{vertical-align:sub;font-size:.8em}
        .blog-content sup{vertical-align:super;font-size:.8em}

        /* Code */
        .blog-content code{
          font-family:'Roboto Mono',monospace;font-size:.88rem;
          background:${T.bgSubtle};border:1px solid ${T.border};
          padding:2px 6px;border-radius:5px;color:${G.red};
        }
        .blog-content pre{
          background:${dark ? '#0c0d10' : '#f8f9fa'};
          border:1px solid ${T.border};border-radius:12px;
          padding:18px;overflow-x:auto;margin:1.5rem 0;
        }
        .blog-content pre code{
          background:none;border:none;padding:0;
          color:${dark ? '#e8eaed' : '#202124'};font-size:.9rem;
        }

        /* Blockquote */
        .blog-content blockquote{
          border-left:3px solid ${G.blue};
          padding:.75rem 1.2rem;margin:1.5rem 0;
          background:${G.blueSoft};border-radius:0 10px 10px 0;
          font-style:italic;color:${T.textSub};
        }
        .blog-content blockquote p{margin:0;color:inherit}

        /* Images */
        .blog-content img{
          max-width:100%;height:auto;border-radius:10px;
          margin:1.25rem 0;border:1px solid ${T.border};display:block;
        }

        /* Links */
        .blog-content a{
          color:${G.blue};text-decoration:none;
          border-bottom:1px solid transparent;transition:border-color .15s;
        }
        .blog-content a:hover{border-bottom-color:${G.blue}}

        /* Tables */
        .blog-content table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.95rem}
        .blog-content th,.blog-content td{border:1px solid ${T.border};padding:10px 13px;text-align:left}
        .blog-content th{background:${T.bgSurface};font-weight:600}
        .blog-content tr:nth-child(even) td{background:${dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.02)'}}

        /* HR */
        .blog-content hr{border:none;height:1px;background:${T.border};margin:2rem 0}

        /* ─ Hover helpers ─ */
        .bc-link:hover{color:${G.blue}!important}
        .tag-pill:hover{background:${G.blueSoft}!important;border-color:${G.blue}!important;color:${G.blue}!important}
        .rel-card:hover{box-shadow:${T.shadowHover};transform:translateY(-3px)}
        .sb-link:hover{background:${T.bgSubtle}!important;transform:translateX(3px)}
        .back-btn:hover{background:${T.bgSurface}!important;color:${T.text}!important}
      `}</style>

      <div style={{ background: T.bg, minHeight: '100vh', paddingBottom: 64, transition: 'background .25s' }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', padding: '16px 20px 0' }}>

          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18, flexWrap: 'wrap' }}>
            {[{ href: '/', icon: Ico.home, label: 'Home' }, { href: '/blog', icon: Ico.book, label: 'Blog' }].map(bc => (
              <span key={bc.href} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link href={bc.href} className="bc-link" style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.textSub, textDecoration: 'none', fontSize: 13, transition: 'color .15s' }}>
                  {bc.icon} {bc.label}
                </Link>
                <span style={{ color: T.textMuted, display: 'flex', alignItems: 'center' }}>{Ico.chev}</span>
              </span>
            ))}
            <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>
              {post.title.length > 45 ? post.title.slice(0, 45) + '…' : post.title}
            </span>
          </nav>

          {/* Back button */}
          <button onClick={() => router.back()} className="back-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginBottom: 22, padding: '7px 14px', borderRadius: 8,
            border: 'none', background: 'transparent', color: T.textSub,
            cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .15s',
          }}>
            {Ico.back} Back to Blog
          </button>

          {/* 3-column layout */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* TOC sidebar */}
            <aside style={{ width: 210, flexShrink: 0 }} className="toc-aside">
              <style>{`.toc-aside{display:none}@media(min-width:1080px){.toc-aside{display:block}}`}</style>
              <TOC content={post.content} T={T} />
            </aside>

            {/* ── Main ── */}
            <main style={{ flex: 1, minWidth: 0 }}>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: G.blueSoft, color: G.blue }}>
                  {Ico.tag} {post.category?.name || 'Uncategorized'}
                </span>
                {post.featured && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: G.yellowSoft, color: G.yellow }}>
                    {Ico.star} Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(1.75rem,3.8vw,2.75rem)',
                fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em',
                marginBottom: 22, color: T.text,
                borderLeft: `4px solid ${G.blue}`, paddingLeft: 18,
              }}>
                {post.title}
              </h1>

              {/* Author bar */}
              <div style={{ ...card({ padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={post.author?.name || 'Author'} avatar={post.author?.avatar} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{post.author?.name || 'Anonymous'}</div>
                    <div style={{ fontSize: 12, color: T.textSub }}>{post.author?.role || 'Author'} · {date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 18 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.textSub }}>
                    <span style={{ color: G.blue }}>{Ico.clock}</span>{readTime} min read
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.textSub }}>
                    <span style={{ color: G.yellow }}>{Ico.eye}</span>{(post.views || 0).toLocaleString()} views
                  </span>
                </div>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 24, border: `1px solid ${T.border}` }}>
                  <img src={post.coverImage} alt={post.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              {/* Excerpt callout */}
              {post.excerpt && (
                <div style={{
                  padding: '14px 18px', borderRadius: 12, marginBottom: 24,
                  background: T.bgSurface, borderLeft: `3px solid ${G.green}`,
                  fontSize: '1.05rem', lineHeight: 1.7, color: T.textSub,
                }}>
                  {post.excerpt}
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 9 }}>Topics</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <button key={tag} className="tag-pill" onClick={() => router.push(`/blog?tag=${tag}`)}
                        style={{
                          padding: '5px 13px', borderRadius: 20, fontSize: 13,
                          background: T.bgSurface, border: `1px solid ${T.border}`,
                          color: T.textSub, cursor: 'pointer', fontWeight: 500, transition: 'all .15s',
                        }}
                      ># {tag}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Content ── */}
              <div style={{ marginBottom: 36 }}>
                <Content content={post.content} T={T} dark={dark} />
              </div>

              {/* Google-color divider */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                {[G.blue, G.red, G.yellow, G.green].map(c => (
                  <div key={c} style={{ flex: 1, height: 3, borderRadius: 2, background: c }} />
                ))}
              </div>

              {/* Engagement */}
              <div style={{ ...card({ padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }) }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setLiked(l => !l)} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 18px', borderRadius: 24, cursor: 'pointer',
                    border: `1px solid ${liked ? G.red : T.border}`,
                    background: liked ? G.redSoft : 'transparent',
                    color: liked ? G.red : T.textSub,
                    fontSize: 13, fontWeight: 500, transition: 'all .15s',
                  }}>
                    {Ico.heart(liked)} {liked ? 'Liked' : 'Like'} · {post.likes || 0}
                  </button>
                  <button onClick={() => setSaved(s => !s)} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 18px', borderRadius: 24, cursor: 'pointer',
                    border: `1px solid ${saved ? G.blue : T.border}`,
                    background: saved ? G.blueSoft : 'transparent',
                    color: saved ? G.blue : T.textSub,
                    fontSize: 13, fontWeight: 500, transition: 'all .15s',
                  }}>
                    {Ico.save(saved)} {saved ? 'Saved' : 'Save'}
                  </button>
                </div>
                <span style={{ fontSize: 12, color: T.textMuted }}>{post.likes || 0} people found this helpful</span>
              </div>

              {/* Share bar */}
              <div style={{ ...card({ padding: '14px 18px', marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }) }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Share</span>
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <ShareBtn label="X / Twitter" color="#000"     bgHover="rgba(0,0,0,.08)"          onClick={() => share('x')}        icon={Ico.x} />
                  <ShareBtn label="LinkedIn"    color="#0a66c2"  bgHover="rgba(10,102,194,.1)"      onClick={() => share('linkedin')} icon={Ico.li} />
                  <ShareBtn label="Facebook"    color="#1877f2"  bgHover="rgba(24,119,242,.1)"      onClick={() => share('facebook')} icon={Ico.fb} />
                  <ShareBtn label="WhatsApp"    color="#25d366"  bgHover="rgba(37,211,102,.1)"      onClick={() => share('whatsapp')} icon={Ico.wa} />
                  <ShareBtn label="Email"       color={G.red}    bgHover={G.redSoft}                onClick={() => share('email')}   icon={Ico.email} />
                  <div style={{ width: 1, height: 18, background: T.border, margin: '0 4px' }} />
                  <ShareBtn label={copied ? 'Copied!' : 'Copy link'} color={copied ? G.green : T.textSub} bgHover={copied ? G.greenSoft : T.bgSurface} onClick={() => share('copy')} icon={copied ? Ico.check : Ico.link} />
                  <ShareBtn label="Download"    color={G.yellow} bgHover={G.yellowSoft}             onClick={download}               icon={Ico.dl} />
                  <ShareBtn label="Print"       color={T.textSub} bgHover={T.bgSurface}             onClick={() => window.print()}   icon={Ico.print} />
                </div>
              </div>

              {/* Mobile related posts */}
              {post.relatedPosts?.length > 0 && (
                <div className="mob-rel">
                  <style>{`.mob-rel{display:block}@media(min-width:1080px){.mob-rel{display:none}}`}</style>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 14 }}>Related Articles</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {post.relatedPosts.map(r => (
                      <Link key={r.id} href={`/blog/${r.slug}`} className="rel-card" style={{
                        flex: '1 1 250px', textDecoration: 'none',
                        borderRadius: 14, border: `1px solid ${T.border}`,
                        background: T.bgElevated, overflow: 'hidden', display: 'block',
                        transition: 'all .2s',
                      }}>
                        {r.coverImage && <img src={r.coverImage} alt={r.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />}
                        <div style={{ padding: 14 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 5, lineHeight: 1.4 }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 8 }}>{r.excerpt?.substring(0, 75)}…</div>
                          <span style={{ fontSize: 11, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {Ico.clock} {r.readTime || 3} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* ── Right sidebar ── */}
            <aside style={{ width: 240, flexShrink: 0 }} className="rel-aside">
              <style>{`.rel-aside{display:none}@media(min-width:1080px){.rel-aside{display:block}}`}</style>
              <div style={{
                borderRadius: 14, border: `1px solid ${T.border}`,
                background: T.bgSurface, position: 'sticky', top: 80,
                maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
              }}>
                <div style={{ padding: '14px 14px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <span style={{ color: G.green }}>{Ico.book}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.textSub }}>Related</span>
                  </div>
                  <div style={{ height: 1, background: T.border }} />
                </div>

                <div style={{ padding: '4px 8px 12px' }}>
                  {post.relatedPosts?.length > 0 ? post.relatedPosts.map(r => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="sb-link" style={{ display: 'block', textDecoration: 'none', borderRadius: 10, padding: 10, transition: 'all .15s', marginBottom: 2 }}>
                      {r.coverImage && <img src={r.coverImage} alt={r.title} style={{ width: '100%', height: 84, objectFit: 'cover', borderRadius: 8, marginBottom: 7, display: 'block' }} />}
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.4, marginBottom: 4 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: T.textSub, marginBottom: 5, lineHeight: 1.4 }}>{r.excerpt?.substring(0, 62)}…</div>
                      <span style={{ fontSize: 11, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: G.blue }}>{Ico.clock}</span>{r.readTime || 3} min
                      </span>
                    </Link>
                  )) : (
                    <p style={{ fontSize: 13, color: T.textMuted, textAlign: 'center', padding: '16px 0' }}>No related articles</p>
                  )}
                </div>

                {/* Newsletter CTA */}
                <div style={{ margin: '0 10px 12px', padding: '14px', borderRadius: 10, background: G.blueSoft, border: `1px solid ${G.blue}25` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.blue, marginBottom: 4 }}>Stay updated</div>
                  <div style={{ fontSize: 11, color: T.textSub, marginBottom: 10, lineHeight: 1.55 }}>Get the latest articles in your inbox</div>
                  <Link href="/newsletter" style={{
                    display: 'block', textAlign: 'center', padding: '8px',
                    borderRadius: 8, background: G.blue, color: '#fff',
                    textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  }}>Subscribe</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SingleBlogPostPage() {
  return (
    <MainLayout title="Blog Post">
      <BlogPostContent />
    </MainLayout>
  );
}