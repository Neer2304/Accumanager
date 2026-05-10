// components/newUiProfessional/theme.ts
// Professional UI theme - Google-inspired, clean, responsive

export const ProTheme = {
  // ── Dark Mode (Material You Dark) ────────────────────────────────────────
  dark: {
    bg:        '#202124',          // Main background
    surface:   '#303134',          // Card surface
    surface2:  '#3c4043',          // Hover/raised elements
    border:    '#5f6368',          // Subtle borders
    borderHot: '#8ab4f8',          // Focus state (Google Blue)
    ink:       '#e8eaed',          // Primary text
    inkSub:    '#9aa0a6',          // Secondary text
    inkMuted:  '#80868b',          // Placeholder/disabled
    primary:   '#8ab4f8',          // Google Blue
    primaryHov: '#aecbfa',         // Blue hover
    primarySoft: 'rgba(138,180,248,0.12)', // Blue tint
    error:     '#f28b82',          // Error red
    errorSoft: 'rgba(242,139,130,0.12)',
    success:   '#81c995',          // Success green
    warning:   '#fdd663',          // Warning yellow
  },
  // ── Light Mode (Google Material Light) ───────────────────────────────────
  light: {
    bg:        '#ffffff',
    surface:   '#ffffff',
    surface2:  '#f8f9fa',
    border:    '#dadce0',
    borderHot: '#1a73e8',
    ink:       '#202124',
    inkSub:    '#5f6368',
    inkMuted:  '#80868b',
    primary:   '#1a73e8',          // Google Blue
    primaryHov: '#1557b0',         // Blue hover
    primarySoft: 'rgba(26,115,232,0.08)',
    error:     '#d93025',
    errorSoft: 'rgba(217,48,37,0.08)',
    success:   '#188038',
    warning:   '#e37400',
  },
} as const;

export type ProMode = 'dark' | 'light';
export const usePro = (dark: boolean) => dark ? ProTheme.dark : ProTheme.light;