// components/newUiBatman/theme.ts
// Batman theme tokens — Dark Knight aesthetic with gold accents

export const BatmanTheme = {
  // ── Dark Mode (Batman: Black + Gold) ─────────────────────────────────────
  dark: {
    bg:        '#0a0a0a',          // Gotham darkness
    surface:   '#0f0f0f',          // Card surface - bat cave concrete
    surface2:  '#141414',          // Raised elements
    border:    '#1f1f1f',          // Subtle border
    borderHot: '#ffd700',          // Focused / active border (Bat Signal gold)
    ink:       '#e8e8e8',          // Primary text
    inkSub:    '#888888',          // Secondary text
    inkMuted:  '#555555',          // Placeholder / muted
    gold:      '#ffd700',          // Primary accent (Batman gold)
    goldHov:   '#e6c200',          // Hover state
    goldSoft:  'rgba(255,215,0,0.12)', // Tinted backgrounds
    goldGlow:  'rgba(255,215,0,0.25)', // Glow / shadow
    gray:      '#2a2a2a',          // Batmobile gray
    success:   '#00ff88',          // Joker green? No, keep it clean
    error:     '#ff4444',          // Red Hood red
    warning:   '#ffaa00',          // Yellow lantern
  },
  // ── Light Mode (Batman: Light gray + Dark gold) ──────────────────────────
  light: {
    bg:        '#f0f0f0',          // Gotham daylight
    surface:   '#ffffff',
    surface2:  '#fafafa',
    border:    '#e0e0e0',
    borderHot: '#b8860b',          // Dark goldenrod
    ink:       '#1a1a1a',
    inkSub:    '#666666',
    inkMuted:  '#999999',
    gold:      '#b8860b',          // Dark gold for light mode
    goldHov:   '#9a7209',
    goldSoft:  'rgba(184,134,11,0.08)',
    goldGlow:  'rgba(184,134,11,0.15)',
    gray:      '#8b8b8b',
    success:   '#00a86b',
    error:     '#dc2626',
    warning:   '#e6a800',
  },
} as const;

export type BatmanMode = 'dark' | 'light';
export const useBatman = (dark: boolean) => dark ? BatmanTheme.dark : BatmanTheme.light;