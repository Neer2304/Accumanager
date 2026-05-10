// components/dpadmindashboard/components/types.ts
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

export const dpColors = {
  primary: '#dc2626',
  red: '#dc2626',
  redHov: '#b91c1c',
  redSoft: 'rgba(220,38,38,0.12)',
  redGlow: 'rgba(220,38,38,0.25)',
  bg: '#0d0000',
  surface: '#1a0505',
  border: '#4a1010',
  ink: '#f5e0e0',
  inkSub: '#b08080',
  inkMuted: '#7a4040',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  gold: '#fbbf24',
};