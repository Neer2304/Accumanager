// components/googleadminusers/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  shopName?: string;
  isActive: boolean;
  subscription?: {
    plan?: string;
    status?: string;
    currentPeriodEnd?: string;
  };
  usage?: {
    products?: number;
    customers?: number;
    invoices?: number;
    storageMB?: number;
  };
  createdAt?: string;
}

export interface UsersStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  expiredUsers: number;
  recentSignups: number;
  byRole: {
    admin: number;
    staff: number;
    user: number;
  };
  byPlan: {
    trial: number;
    monthly: number;
    quarterly: number;
    yearly: number;
    none: number;
  };
  revenueStats?: {
    monthly: number;
    total: number;
  };
}

export interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}