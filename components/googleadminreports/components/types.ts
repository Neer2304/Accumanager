// components/googlereports/components/types.ts
export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface UserGrowth {
  month: string;
  users: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface Metrics {
  totalRevenue: number;
  activeUsers: number;
  newUsers: number;
  conversionRate: number;
  churnRate: number;
  avgRevenuePerUser: number;
}

export interface ReportData {
  monthlyRevenue: MonthlyRevenue[];
  userGrowth: UserGrowth[];
  planDistribution: PlanDistribution[];
  paymentStatus: StatusDistribution[];
  subscriptionStatus: StatusDistribution[];
  metrics: Metrics;
}

export interface StatusItem {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

export interface Trend {
  value: number;
  direction: 'up' | 'down';
  label?: string;
}