// components/googleadminsettings/components/types.ts
export interface PricingSettings {
  monthly: number;
  quarterly: number;
  yearly: number;
}

export interface SecuritySettings {
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
}

export interface AppSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  enableRegistration: boolean;
  trialDays: number;
  pricing: PricingSettings;
  security: SecuritySettings;
}

export interface SettingsState {
  settings: AppSettings;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
}