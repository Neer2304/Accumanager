// components/proadmindashboard/components/types.ts
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