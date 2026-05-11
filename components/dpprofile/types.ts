/* eslint-disable @typescript-eslint/no-unused-vars */
// components/dpprofile/types.ts
import { alpha } from '@mui/material';

export interface UserProfile {
  id: string; name: string; email: string; phone: string; avatar?: string; role: string; businessName: string; gstNumber?: string; businessAddress?: string; createdAt: string; isActive: boolean;
  preferences: { emailNotifications: boolean; smsNotifications: boolean; lowStockAlerts: boolean; monthlyReports: boolean; };
  subscription?: { plan: 'trial' | 'monthly' | 'quarterly' | 'yearly'; status: 'trial' | 'active' | 'expired' | 'cancelled'; trialEndsAt?: string; currentPeriodStart: string; currentPeriodEnd: string; autoRenew: boolean; features: any; };
  usage?: { products: number; customers: number; invoices: number; storageMB: number; };
}

export interface BusinessData { id: string; businessName: string; address: string; city: string; state: string; pincode: string; country: string; gstNumber: string; phone: string; email: string; logo: string; }
export interface SubscriptionStatus { plan: string; isActive: boolean; currentPeriodEnd?: string; daysRemaining?: number; limits: { products: number; customers: number; invoices: number; storageMB: number; }; }
export interface ProfileFormData { name: string; email: string; phone: string; businessName: string; gstNumber: string; businessAddress: string; }
export interface BusinessFormData { businessName: string; address: string; city: string; state: string; pincode: string; country: string; gstNumber: string; phone: string; email: string; }
export interface PasswordData { currentPassword: string; newPassword: string; confirmPassword: string; }
export interface SnackbarState { open: boolean; message: string; severity: 'success' | 'error'; }

export const dpColors = {
  primary: '#dc2626', red: '#dc2626', redHov: '#b91c1c', redSoft: 'rgba(220,38,38,0.12)', redGlow: 'rgba(220,38,38,0.25)',
  bg: '#0d0000', surface: '#1a0505', surface2: '#260a0a', border: '#4a1010', borderHot: '#dc2626',
  ink: '#f5e0e0', inkSub: '#b08080', inkMuted: '#7a4040', success: '#4ade80', error: '#f87171', gold: '#fbbf24',
};

export const PRICING_PLANS: Record<string, any> = {
  trial: { name: 'Free Trial', price: 0, duration: 14, features: ['Up to 50 products', 'Up to 100 customers', 'Basic inventory management', 'Email support', '14-day free trial'], limits: { products: 50, customers: 100, invoices: 200, storageMB: 100 } },
  monthly: { name: 'Monthly Pro', price: 999, duration: 30, features: ['Up to 500 products', 'Up to 1000 customers', 'Advanced inventory management', 'GST billing & reporting', 'Priority email support', 'Basic analytics'], limits: { products: 500, customers: 1000, invoices: 5000, storageMB: 500 } },
  quarterly: { name: 'Quarterly Business', price: 2599, duration: 90, features: ['Up to 2000 products', 'Up to 5000 customers', 'Advanced analytics & reports', 'Multi-user access (up to 3)', 'Phone + email support', 'Custom branding'], limits: { products: 2000, customers: 5000, invoices: 15000, storageMB: 2000 }, popular: true },
  yearly: { name: 'Yearly Enterprise', price: 8999, duration: 365, features: ['Unlimited products', 'Unlimited customers', 'Advanced AI analytics', 'Multi-user access (up to 10)', '24/7 priority support', 'Custom integrations', 'Dedicated account manager'], limits: { products: 10000, customers: 25000, invoices: 50000, storageMB: 5000 } }
};

export const getPlanColor = (plan: string): string => {
  switch (plan) { case 'trial': return dpColors.inkSub; case 'monthly': return dpColors.red; case 'quarterly': return dpColors.gold; case 'yearly': return dpColors.gold; default: return dpColors.inkSub; }
};

export const getProgressColor = (percentage: number): string => {
  if (percentage > 90) return dpColors.error;
  if (percentage > 75) return dpColors.gold;
  return '#34a853';
};