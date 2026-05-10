// types/about.ts
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  supportHours: string;
  salesEmail?: string;
  supportEmail?: string;
  faxNumber?: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  github: string;
  tiktok?: string;
  discord?: string;
}

export interface Labels {
  // General
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
  
  // Dashboard
  welcomeMessage: string;
  totalUsers: string;
  totalRevenue: string;
  activeSubscriptions: string;
  recentActivities: string;
  
  // Buttons
  createNew: string;
  viewDetails: string;
  downloadReport: string;
  exportData: string;
  importData: string;
  
  // Forms
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  
  // Status
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  draft: string;
  
  // Navigation
  home: string;
  about: string;
  services: string;
  contact: string;
  help: string;
  support: string;
  
  // Messages
  loading: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  confirm: string;
  
  // Search & Filter
  search: string;
  filter: string;
  sort: string;
  reset: string;
  apply: string;
  clear: string;
  
  // Pagination
  previous: string;
  next: string;
  first: string;
  last: string;
  showing: string;
  of: string;
  results: string;
  
  // Table headers
  id: string;
  status: string;
  actions: string;
  createdAt: string;
  updatedAt: string;
  
  // Dark mode
  lightMode: string;
  darkMode: string;
  
  [key: string]: string;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robotsTxt?: string;
}

export interface Theme {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  textSecondary?: string;
  textMuted?: string;
  borderColor?: string;
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  infoColor?: string;
  
  // Typography
  fontFamily: string;
  fontSizeBase?: string;
  fontSizeLg?: string;
  fontSizeSm?: string;
  
  // Spacing
  borderRadius: string;
  borderRadiusLg?: string;
  borderRadiusSm?: string;
  
  // Shadows
  boxShadow?: string;
  boxShadowLg?: string;
  
  // Layout
  headerHeight?: string;
  sidebarWidth?: string;
  
  // Dark mode
  darkMode?: boolean;
}

export interface System {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  language: string;
  supportedLanguages?: string[];
  defaultRole: string;
  defaultPlan: string;
  trialDays: number;
  sessionTimeout: number;
  itemsPerPage: number;
  enableRegistration: boolean;
  enableEmailVerification?: boolean;
  enablePhoneVerification?: boolean;
  enableTwoFactor?: boolean;
  enableCaptcha?: boolean;
  maintenanceMode: boolean;
  cacheEnabled?: boolean;
  cacheDuration?: number;
  enableCompression?: boolean;
  rateLimit?: number;
  rateLimitWindow?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

export interface About {
  _id: string;
  companyName: string;
  companySlogan?: string;
  companyDescription?: string;
  companyLogo?: string;
  companyFavicon?: string;
  foundedYear?: number;
  employeeCount?: string;
  industry?: string;
  companyWebsite?: string;
  companyEmail?: string;
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
  updates: Record<string, unknown>;
}