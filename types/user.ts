// types/user.ts
export interface UserSubscription {
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'inactive' | 'expired' | 'trial' | 'cancelled';
  trialEndsAt: Date | string;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  upiTransactionId?: string;
  lastPaymentDate?: Date | string;
  autoRenew: boolean;
  features: string[];
}

export interface LegalAcceptance {
  timestamp: Date | string;
  version: string;
  ipAddress: string;
  userAgent: string;
  method: string;
}

export interface UserLegal {
  accepted: boolean;
  acceptedAt: Date | string;
  acceptedVersion: string;
  lastAccepted: LegalAcceptance;
  acceptanceHistory: LegalAcceptance[];
}

export interface UserUsage {
  products: number;
  customers: number;
  invoices: number;
  storageMB: number;
}

export interface DailyScreenTime {
  date: string;
  hours: number;
  sessions: number;
}

export interface HourlyDistribution {
  hour: number;
  hours: number;
}

export interface UserScreenTime {
  totalHours: number;
  lastActive: Date | string;
  dailyStats: DailyScreenTime[];
  hourlyDistribution: HourlyDistribution[];
  weeklyAverage: number;
  last7Days: number[];
  peakHour: number;
  avgSessionLength: number;
  lastSessionDuration: number;
}

export interface ActivityLog {
  timestamp: Date | string;
  page: string;
  duration: number;
  action?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  shopName?: string;
  businessName?: string;
  gstNumber?: string;
  businessAddress?: string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  
  // Subscription
  subscription?: UserSubscription;
  
  // Legal
  legal?: UserLegal;
  
  // Usage
  usage?: UserUsage;
  
  // Screen Time
  screenTime?: UserScreenTime;
  
  // Activity Logs
  activityLogs?: ActivityLog[];
  
  // Preferences
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    monthlyReports: boolean;
  };
  
  // Avatar
  avatar?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  shopName?: string;
  businessName?: string;
  gstNumber?: string;
  businessAddress?: string;
}

export interface PreferencesData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  lowStockAlerts?: boolean;
  monthlyReports?: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Screen Time specific types
export interface ScreenTimeUpdateData {
  page: string;
  duration: number;
  action?: string;
}

export interface ScreenTimeStats {
  totalHours: number;
  weeklyAverage: number;
  last7Days: number[];
  peakHour: number;
  avgSessionLength: number;
  today: {
    hours: number;
    sessions: number;
  };
}

// Subscription specific types
export interface SubscriptionUpdateData {
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'inactive' | 'expired' | 'trial' | 'cancelled';
  upiTransactionId?: string;
  autoRenew?: boolean;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: UserSubscription;
}

// Legal specific types
export interface LegalAcceptanceData {
  version: string;
  ipAddress: string;
  userAgent: string;
  method: string;
}

export interface LegalResponse {
  accepted: boolean;
  message: string;
  legal?: UserLegal;
}