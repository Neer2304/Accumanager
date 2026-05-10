// components/newUI/theme.ts
// Deadpool color tokens — import from here in all newUI components

export const DP = {
  // ── Dark mode (Deadpool suit: black + crimson) ─────────────────────────────
  dark: {
    bg:        '#0d0000',          // near-black with red tint
    surface:   '#1a0505',          // card surface
    surface2:  '#260a0a',          // raised elements
    border:    '#4a1010',          // subtle border
    borderHot: '#dc2626',          // focused / active border
    ink:       '#f5e0e0',          // primary text
    inkSub:    '#b08080',          // secondary text
    inkMuted:  '#7a4040',          // placeholder / muted
    red:       '#dc2626',          // primary accent (Deadpool red)
    redHov:    '#b91c1c',          // hover
    redSoft:   'rgba(220,38,38,0.12)', // tinted backgrounds
    redGlow:   'rgba(220,38,38,0.25)', // glow / shadow
    success:   '#4ade80',
    error:     '#f87171',
    gold:      '#fbbf24',          // strength bar "medium"
  },
  // ── Light mode (Deadpool casual: white + light red) ────────────────────────
  light: {
    bg:        '#fff5f5',          // warm white with red hint
    surface:   '#ffffff',
    surface2:  '#fef2f2',
    border:    '#fecaca',
    borderHot: '#dc2626',
    ink:       '#1a0000',
    inkSub:    '#6b2020',
    inkMuted:  '#b08080',
    red:       '#dc2626',
    redHov:    '#b91c1c',
    redSoft:   'rgba(220,38,38,0.07)',
    redGlow:   'rgba(220,38,38,0.18)',
    success:   '#16a34a',
    error:     '#dc2626',
    gold:      '#d97706',
  },
} as const;

export type DPMode = 'dark' | 'light';
export const useDP = (dark: boolean) => dark ? DP.dark : DP.light;