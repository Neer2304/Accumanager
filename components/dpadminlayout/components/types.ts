// components/dpadminlayout/components/types.ts
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  mobileText?: string;
}

export const dpColors = {
  primary: '#dc2626',
  red: '#dc2626',
  redHov: '#b91c1c',
  redSoft: 'rgba(220,38,38,0.12)',
  redGlow: 'rgba(220,38,38,0.25)',
  bg: '#0d0000',
  bgLight: '#fff5f5',
  surface: '#1a0505',
  surfaceLight: '#ffffff',
  border: '#4a1010',
  borderLight: '#fecaca',
  ink: '#f5e0e0',
  inkSub: '#b08080',
  inkMuted: '#7a4040',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#dc2626',
  gold: '#fbbf24',
};