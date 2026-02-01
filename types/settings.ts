export interface BusinessSettings {
  name: string;
  taxRate: number;
  invoicePrefix: string;
  gstNumber: string;
  businessAddress: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  salesAlerts: boolean;
  lowStockAlerts: boolean;
  newCustomerAlerts: boolean;
  billingReminders: boolean;
  monthlyReports: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordChangeRequired: boolean;
  loginAlerts: boolean;
  ipWhitelist: string[];
}

export interface AppearanceSettings {
  language: string;
  dateFormat: string;
  compactMode: boolean;
  dashboardLayout: string;
  primaryColor: string;
}

export interface SettingsData {
  business: BusinessSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: string;
  features: any;
  limits: {
    products: number;
    customers: number;
    employees: number;
    storageMB: number;
  };
  usage: {
    products: number;
    customers: number;
    employees: number;
    storageMB: number;
  };
  currentPeriodEnd: string;
  daysRemaining: number;
  nextBillingAmount: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  popular?: boolean;
}