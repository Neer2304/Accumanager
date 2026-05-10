/**
 * AppCommon.tsx — Accumanager shared design system
 *
 * Exports:
 *   useAppColors()     — theme-aware color tokens
 *   APP_COLORS         — static color constants (brand, semantic)
 *   AppLogo            — red logo component
 *   PillBtn            — pill-shaped button (blue primary / red cancel)
 *   AppAlert           — yellow warning / green info / red error alerts
 *   GS                 — Google Sans font stack
 */

'use client';

import React from 'react';
import { useTheme, alpha, Typography, Box, Avatar } from '@mui/material';
import {
  CheckCircle,
  Warning,
  Info,
  Error as ErrorIcon,
  Inventory,
} from '@mui/icons-material';

// ─── Font ─────────────────────────────────────────────────────────────────────

export const GS = '"Google Sans", Roboto, system-ui, sans-serif';

// ─── Static brand / semantic colors ──────────────────────────────────────────

export const APP_COLORS = {
  // Brand
  logoRed:    '#ea4335',   // logo is ALWAYS this red
  btnBlue:    '#1a73e8',   // primary buttons ALWAYS this blue
  btnBlueDark:'#8ab4f8',   // primary buttons in dark mode
  cancelRed:  '#d93025',   // cancel/destructive buttons ALWAYS red

  // Semantic (light)
  alertYellow:      '#b06000',
  alertYellowBg:    'rgba(176,96,0,0.08)',
  alertYellowBorder:'rgba(176,96,0,0.2)',
  infoGreen:        '#137333',
  infoGreenBg:      'rgba(19,115,51,0.08)',
  infoGreenBorder:  'rgba(19,115,51,0.2)',
  errorRed:         '#d93025',
  errorRedBg:       'rgba(217,48,37,0.08)',
  errorRedBorder:   'rgba(217,48,37,0.2)',

  // Semantic (dark)
  alertYellowDark:      '#fde293',
  alertYellowBgDark:    'rgba(253,226,147,0.1)',
  alertYellowBorderDark:'rgba(253,226,147,0.2)',
  infoGreenDark:        '#81c995',
  infoGreenBgDark:      'rgba(129,201,149,0.1)',
  infoGreenBorderDark:  'rgba(129,201,149,0.2)',
  errorRedDark:         '#f28b82',
  errorRedBgDark:       'rgba(242,139,130,0.1)',
  errorRedBorderDark:   'rgba(242,139,130,0.2)',
} as const;

// ─── Theme-aware color tokens ─────────────────────────────────────────────────

export function useAppColors() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  return {
    // surfaces
    bg:         dark ? '#202124' : '#f8f9fa',
    surface:    dark ? '#2d2e30' : '#ffffff',
    border:     dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderHov:  dark ? '#8ab4f8' : '#1a73e8',

    // text
    ink:        dark ? '#e8eaed' : '#202124',
    inkSub:     dark ? '#9aa0a6' : '#5f6368',
    inkMuted:   dark ? '#5f6368' : '#9aa0a6',

    // brand — always use these, never ad-hoc colors
    logo:       APP_COLORS.logoRed,
    btn:        dark ? APP_COLORS.btnBlueDark : APP_COLORS.btnBlue,
    btnHov:     dark ? '#aecbfa' : '#1765cc',
    btnSoft:    dark ? 'rgba(138,180,248,0.1)' : 'rgba(26,115,232,0.08)',
    btnBorder:  dark ? 'rgba(138,180,248,0.2)' : 'rgba(26,115,232,0.2)',
    cancel:     dark ? APP_COLORS.errorRedDark : APP_COLORS.cancelRed,
    cancelSoft: dark ? APP_COLORS.errorRedBgDark : APP_COLORS.errorRedBg,

    // semantic
    alert:        dark ? APP_COLORS.alertYellowDark       : APP_COLORS.alertYellow,
    alertBg:      dark ? APP_COLORS.alertYellowBgDark      : APP_COLORS.alertYellowBg,
    alertBorder:  dark ? APP_COLORS.alertYellowBorderDark  : APP_COLORS.alertYellowBorder,
    info:         dark ? APP_COLORS.infoGreenDark          : APP_COLORS.infoGreen,
    infoBg:       dark ? APP_COLORS.infoGreenBgDark        : APP_COLORS.infoGreenBg,
    infoBorder:   dark ? APP_COLORS.infoGreenBorderDark    : APP_COLORS.infoGreenBorder,
    error:        dark ? APP_COLORS.errorRedDark           : APP_COLORS.errorRed,
    errorBg:      dark ? APP_COLORS.errorRedBgDark         : APP_COLORS.errorRedBg,
    errorBorder:  dark ? APP_COLORS.errorRedBorderDark     : APP_COLORS.errorRedBorder,

    // extended palette (for category chips etc.)
    blue:   dark ? '#8ab4f8' : '#1a73e8',
    green:  dark ? '#81c995' : '#137333',
    amber:  dark ? '#fde293' : '#b06000',
    red:    dark ? '#f28b82' : '#d93025',
    purple: dark ? '#d7adff' : '#9334e6',
    pink:   dark ? '#f8b4d4' : '#d81b60',

    isDark: dark,
  } as const;
}

// ─── AppLogo — always red ─────────────────────────────────────────────────────

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  textVariant?: 'h4' | 'h5' | 'h6' | 'body1';
}

export function AppLogo({ size = 40, showText = true, textVariant = 'h6' }: AppLogoProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar
        sx={{
          width: size,
          height: size,
          borderRadius: `${size * 0.28}px`,
          // Logo background: always use brand red
          bgcolor: alpha(APP_COLORS.logoRed, 0.12),
          color: APP_COLORS.logoRed,
          border: `1.5px solid ${alpha(APP_COLORS.logoRed, 0.25)}`,
        }}
      >
        <Inventory sx={{ fontSize: size * 0.55, color: APP_COLORS.logoRed }} />
      </Avatar>
      {showText && (
        <Typography
          variant={textVariant}
          sx={{
            fontFamily: GS,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            // Logo text: always red
            color: APP_COLORS.logoRed,
          }}
        >
          Accumanager
        </Typography>
      )}
    </Box>
  );
}

// ─── PillBtn — blue primary, red cancel ───────────────────────────────────────

type PillBtnVariant = 'primary' | 'cancel' | 'outline' | 'ghost';
type PillBtnSize    = 'xs' | 'sm' | 'md' | 'lg';

interface PillBtnProps {
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: PillBtnVariant;
  size?: PillBtnSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PillBtn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: PillBtnProps) {
  const c = useAppColors();

  const PAD: Record<PillBtnSize, { px: string; py: string; fs: string }> = {
    xs: { px: '8px',  py: '3px',  fs: '0.68rem' },
    sm: { px: '12px', py: '5px',  fs: '0.76rem' },
    md: { px: '18px', py: '9px',  fs: '0.875rem' },
    lg: { px: '24px', py: '11px', fs: '1rem' },
  };
  const p = PAD[size];

  // Color rules:
  //   primary → always blue
  //   cancel  → always red
  //   outline → blue border/text
  //   ghost   → neutral border
  const STYLES: Record<PillBtnVariant, object> = {
    primary: {
      background: `linear-gradient(135deg, ${c.btnHov}, ${c.btn})`,
      color: '#fff',
      border: 'none',
      boxShadow: `0 2px 8px ${alpha(c.btn, 0.35)}`,
      '&:hover:not(:disabled)': { opacity: 0.9, transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${alpha(c.btn, 0.4)}` },
    },
    cancel: {
      background: `linear-gradient(135deg, ${alpha(c.cancel, 0.9)}, ${c.cancel})`,
      color: '#fff',
      border: 'none',
      boxShadow: `0 2px 8px ${alpha(c.cancel, 0.3)}`,
      '&:hover:not(:disabled)': { opacity: 0.9, transform: 'translateY(-1px)' },
    },
    outline: {
      bgcolor: 'transparent',
      color: c.btn,
      border: `1.5px solid ${c.btn}`,
      '&:hover:not(:disabled)': { bgcolor: c.btnSoft },
    },
    ghost: {
      bgcolor: 'transparent',
      color: c.ink,
      border: `1px solid ${c.border}`,
      '&:hover:not(:disabled)': { bgcolor: alpha(c.ink, 0.06) },
    },
  };

  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        fontFamily: GS,
        fontWeight: 700,
        fontSize: p.fs,
        borderRadius: '100px',
        px: p.px,
        py: p.py,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.55 : 1,
        transition: 'all 0.18s',
        userSelect: 'none',
        width: fullWidth ? '100%' : 'auto',
        ...STYLES[variant],
      }}
    >
      {loading ? (
        <Box
          sx={{
            width: 13,
            height: 13,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin .7s linear infinite',
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }}
        />
      ) : icon}
      {children}
    </Box>
  );
}

// ─── AppAlert — yellow warning / green info / red error ───────────────────────

type AlertSeverity = 'warning' | 'info' | 'error' | 'success';

interface AppAlertProps {
  severity: AlertSeverity;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  sx?: object;
}

export function AppAlert({ severity, title, children, onDismiss, sx = {} }: AppAlertProps) {
  const c = useAppColors();

  // Color map following the rules:
  //   warning / alert → yellow
  //   info / success  → green
  //   error           → red
  const MAP: Record<AlertSeverity, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
    warning: { color: c.alert,  bg: c.alertBg,  border: c.alertBorder,  Icon: Warning       },
    info:    { color: c.info,   bg: c.infoBg,   border: c.infoBorder,   Icon: Info          },
    success: { color: c.info,   bg: c.infoBg,   border: c.infoBorder,   Icon: CheckCircle   },
    error:   { color: c.error,  bg: c.errorBg,  border: c.errorBorder,  Icon: ErrorIcon     },
  };

  const { color, bg, border, Icon } = MAP[severity];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: { xs: 1.5, sm: 2 },
        borderRadius: '12px',
        bgcolor: bg,
        border: `1px solid ${border}`,
        ...sx,
      }}
    >
      <Icon sx={{ fontSize: 18, color, flexShrink: 0, mt: '2px' }} />
      <Box sx={{ flex: 1 }}>
        {title && (
          <Typography sx={{ fontFamily: GS, fontWeight: 600, fontSize: '0.82rem', color, mb: 0.25 }}>
            {title}
          </Typography>
        )}
        <Typography sx={{ fontFamily: GS, fontSize: '0.78rem', color, lineHeight: 1.5 }}>
          {children}
        </Typography>
      </Box>
      {onDismiss && (
        <Box
          component="button"
          onClick={onDismiss}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color,
            opacity: 0.7,
            p: 0,
            fontSize: '1rem',
            lineHeight: 1,
            flexShrink: 0,
            '&:hover': { opacity: 1 },
          }}
        >
          ✕
        </Box>
      )}
    </Box>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 20, color }: { size?: number; color?: string }) {
  const c = useAppColors();
  return (
    <Box
      sx={{
        width: size,
        height: size,
        border: `2px solid ${alpha(color ?? c.btn, 0.2)}`,
        borderTopColor: color ?? c.btn,
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
        '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
      }}
    />
  );
}