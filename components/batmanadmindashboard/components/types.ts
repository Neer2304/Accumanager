// components/batmanadmindashboard/components/types.ts
import { ReactNode } from 'react';

export interface AdminCardItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color: string;
  stats?: string | number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingTasks: number;
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