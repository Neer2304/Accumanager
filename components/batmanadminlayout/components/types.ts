// components/batmanadminlayout/components/types.ts
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

export const batmanColors = {
  primary: '#ffd700',
  gold: '#ffd700',
  goldHov: '#e6c200',
  goldSoft: 'rgba(255,215,0,0.12)',
  goldGlow: 'rgba(255,215,0,0.25)',
  bg: '#0a0a0a',
  bgLight: '#f0f0f0',
  surface: '#0f0f0f',
  surfaceLight: '#ffffff',
  border: '#1f1f1f',
  borderLight: '#e0e0e0',
  ink: '#e8e8e8',
  inkLight: '#1a1a1a',
  inkSub: '#888888',
  inkSubLight: '#666666',
  inkMuted: '#444444',
  success: '#00ff88',
  error: '#ff4444',
  warning: '#ffaa00',
  info: '#ffd700',
};