// components/googleadminanalytics/components/types.ts
export interface StatsData {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  trialUsers: number;
  totalUsers: number;
  paymentCount: number;
  conversionRate: number;
  avgRevenuePerUser: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  users: number;
  payments: number;
  activeUsers: number;
  uniqueUsers: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
}

export interface TopUser {
  name: string;
  email: string;
  plan: string;
  status: string;
  joined: string;
  revenue: number;
  paymentCount: number;
  lastPayment: string;
}

export interface AnalyticsData {
  stats: StatsData;
  monthlyData: MonthlyData[];
  planDistribution: PlanDistribution[];
  topUsers: TopUser[];
}