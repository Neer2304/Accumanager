// components/live-activity/types.ts
export interface LiveEmployee {
  _id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  status: 'online' | 'offline' | 'meeting' | 'break' | 'focus' | 'away';
  device: 'desktop' | 'mobile' | 'tablet';
  location: 'office' | 'remote' | 'hybrid';
  currentActivity: string;
  lastActive: string;
  productivity: number;
}

export interface RealTimeEvent {
  _id: string;
  employeeId: string;
  employeeName: string;
  type: 'login' | 'logout' | 'meeting_start' | 'meeting_end' | 'break_start' | 'break_end' | 'task_start' | 'task_complete' | 'status_change';
  description: string;
  createdAt: string;
}

export interface ActivityStats {
  onlineCount: number;
  inMeetingCount: number;
  onBreakCount: number;
  avgProductivity: number;
  totalEmployees: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: string;
  features: any;
  limits: {
    employees: number;
    activityHistory: number;
    realTimeTracking: boolean;
  };
}

export interface PricingPlan {
  name: string;
  price: number;
  features: string[];
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  monthly: {
    name: 'Monthly Pro',
    price: 999,
    features: [
      'Up to 50 employees tracking',
      '30 days activity history',
      'Real-time monitoring',
      'Productivity analytics',
      'Team distribution insights'
    ]
  },
  quarterly: {
    name: 'Quarterly Business',
    price: 2599,
    features: [
      'Up to 200 employees tracking',
      '90 days activity history',
      'Advanced analytics',
      'Custom reports',
      'Priority support'
    ]
  },
  yearly: {
    name: 'Yearly Enterprise',
    price: 8999,
    features: [
      'Unlimited employees tracking',
      '1 year activity history',
      'AI-powered insights',
      'Custom integrations',
      'Dedicated support'
    ]
  }
};