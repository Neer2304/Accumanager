// components/googlesettings/types.ts
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
  themeMode: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  compactMode: boolean;
}

export interface SettingsData {
  business: BusinessSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
}

export interface SubscriptionStatus {
  plan: string;
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
}

export interface SettingsSectionProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  [key: string]: any;
}