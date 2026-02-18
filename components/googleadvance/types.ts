// components/googleadvance/types.ts

import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// Google Colors Type
export interface GoogleColorSet {
  blue: string;
  green: string;
  yellow: string;
  red: string;
}

export interface GoogleThemeColors {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  card: string;
  chipBackground: string;
  header: string;
  sidebar: string;
  hover: string;
  active: string;
}

export interface GoogleColors {
  blue: string;
  green: string;
  yellow: string;
  red: string;
  light: GoogleThemeColors;
  dark: GoogleThemeColors;
}

// Common Props
export interface BaseComponentProps {
  currentColors: GoogleThemeColors;
  isMobile?: boolean;
  isTablet?: boolean;
  mode?: 'light' | 'dark';
}

export interface MetricCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export interface StatsCardProps extends BaseComponentProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  status?: string;
  color?: string;
}

export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export interface UnderDevelopmentBannerProps extends BaseComponentProps {
  message?: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// AI Analytics Types
export interface Prediction {
  id: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  actionItems: string[];
  timestamp: string;
}

// Marketing Types
export interface MarketingCampaign {
  _id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  segment: string;
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  completedAt?: string;
  metadata?: any;
}

export interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  completedCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  totalRevenue: number;
  totalRecipients: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  topPerforming: MarketingCampaign[];
  recentCampaigns: MarketingCampaign[];
}

export interface CustomerSegment {
  _id: string;
  name: string;
  type: 'static' | 'dynamic';
  customerCount: number;
  criteria: any[];
  lastUpdated: string;
}

export interface CreateCampaignData {
  name: string;
  type: 'email' | 'sms' | 'push';
  segment: string;
  template?: string;
  scheduleType: 'immediate' | 'scheduled';
  scheduledDate?: string;
  content?: string;
  subject?: string;
}

// Field Service Types
export interface Technician {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'available' | 'busy' | 'on-break' | 'offline';
  specialization?: string[];
  department?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  totalJobsCompleted?: number;
  currentJob?: string;
  skills?: string[];
  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
}

export interface FieldVisit {
  _id: string;
  title: string;
  description?: string;
  type: 'installation' | 'repair' | 'maintenance' | 'delivery' | 'consultation';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  scheduledDate: string;
  estimatedDuration?: number;
  actualDuration?: number;
  technicianId?: string;
  technicianName?: string;
  parts?: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  notes?: string[];
  attachments?: string[];
  signature?: string;
  completionNotes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldServiceStats {
  activeTechnicians: number;
  todaysJobs: number;
  avgResponseTime: string;
  completionRate: number;
  customerRating: number;
  totalRevenue?: number;
}

// Subscription Analytics Types
export interface RevenueByMethod {
  method: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  month: string;
  revenue: number;
  customers: number;
  orders: number;
  subscriptionActive: boolean;
  avgOrderValue: number;
}

export interface ForecastItem {
  month: string;
  year: number;
  revenue: number;
  customers: number;
  growth: number;
  subscriptionValue: number;
}

export interface SubscriptionData {
  currentSubscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    autoRenew: boolean;
    features?: string[];
    trialEndsAt?: string;
  };
  subscriptionMetrics: {
    mrr: number;
    arr: number;
    totalPaid: number;
    monthlyAmount: number;
    daysRemaining: number;
    trialDaysRemaining: number;
    isTrial: boolean;
    totalOrders: number;
  };
  customerMetrics: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    totalOrders: number;
    totalSpent: number;
    avgCustomerValue: number;
    customerSegments: Record<string, number>;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    avgOrderValue: number;
    revenueGrowth: number;
    revenueByMethod: RevenueByMethod[];
    totalOrders: number;
  };
  retentionMetrics: {
    retentionRate: string;
    churnRisk: string;
    churnProbability: number;
    customerLifetime: number;
    repeatPurchaseRate: string;
    avgDaysBetweenOrders: number;
    totalPurchases: number;
  };
  healthMetrics: {
    status: string;
    score: number;
    issues: string[];
    recommendations: string[];
  };
  monthlyTrend: MonthlyTrendItem[];
  forecast: ForecastItem[];
  period: {
    startDate: string;
    endDate: string;
  };
}

// Subscription Billing Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  method: string;
  invoiceId?: string;
  description?: string;
}

export interface BillingCycle {
  id: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'upcoming';
  plan: string;
}