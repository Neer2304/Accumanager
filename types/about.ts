// types/about.ts
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  supportHours: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  github: string;
}

export interface Labels {
  appName: string;
  dashboard: string;
  profile: string;
  settings: string;
  logout: string;
  login: string;
  register: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  welcomeMessage: string;
  totalUsers: string;
  totalRevenue: string;
  activeSubscriptions: string;
  recentActivities: string;
  createNew: string;
  viewDetails: string;
  downloadReport: string;
  exportData: string;
  importData: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  draft: string;
  [key: string]: string; // Allow additional dynamic labels
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface System {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  language: string;
  defaultRole: string;
  defaultPlan: string;
  trialDays: number;
  sessionTimeout: number;
  itemsPerPage: number;
  enableRegistration: boolean;
  enableEmailVerification: boolean;
  enablePhoneVerification: boolean;
  enableTwoFactor: boolean;
  enableCaptcha: boolean;
  maintenanceMode: boolean;
}

export interface About {
  _id: string;
  companyName: string;
  companyDescription?: string;
  companyLogo?: string;
  contact: ContactInfo;
  socialMedia: SocialMedia;
  labels: Labels;
  seo: SEO;
  theme: Theme;
  system: System;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicAbout {
  companyName: string;
  companyDescription?: string;
  companyLogo?: string;
  contact: ContactInfo;
  socialMedia: SocialMedia;
  labels: Labels;
  seo: SEO;
  theme: Theme;
  system: {
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    currencySymbol: string;
    language: string;
  };
}

export type AboutSection = 
  | 'company'
  | 'contact'
  | 'socialMedia'
  | 'labels'
  | 'seo'
  | 'theme'
  | 'system';

export interface UpdateSectionPayload {
  section: AboutSection;
  updates: Record<string, any>;
}