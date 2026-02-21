// components/googleadmindashboard/components/types.ts
import { ReactNode } from 'react';

export interface AdminCardItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;  // Changed from React.ReactElement to ReactNode
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