// components/googleprofile/types.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  businessName: string;
  gstNumber?: string;
  businessAddress?: string;
  createdAt: string;
  isActive: boolean;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    monthlyReports: boolean;
  };
  subscription?: {
    plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
    status: 'trial' | 'active' | 'expired' | 'cancelled';
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    autoRenew: boolean;
    features: any;
  };
  usage?: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

export interface BusinessData {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber: string;
  phone: string;
  email: string;
  logo: string;
}

export interface SubscriptionStatus {
  plan: string;
  isActive: boolean;
  currentPeriodEnd?: string;
  daysRemaining?: number;
  limits: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

export interface PricingPlan {
  name: string;
  price: number;
  duration: number;
  features: string[];
  limits: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
  popular?: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  gstNumber: string;
  businessAddress: string;
}

export interface BusinessFormData {
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber: string;
  phone: string;
  email: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  darkMode?: boolean;
}