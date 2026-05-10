// models/About.ts
import mongoose, { Schema, Document } from 'mongoose'
import { 
  IAbout, 
  IContact, 
  ISocialMedia, 
  ILabels, 
  ISeo, 
  ITheme, 
  ISystem 
} from '@/types/about'

const ContactSchema = new Schema<IContact>({
  email: { type: String, default: 'contact@company.com' },
  phone: { type: String, default: '+1 (555) 123-4567' },
  address: { type: String, default: '123 Main Street, City, Country' },
  workingHours: { type: String, default: 'Mon-Fri, 9AM-6PM' },
  supportHours: { type: String, default: '24/7' },
  salesEmail: { type: String, default: 'sales@company.com' },
  supportEmail: { type: String, default: 'support@company.com' },
  faxNumber: { type: String, default: '' }
})

const SocialMediaSchema = new Schema<ISocialMedia>({
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  youtube: { type: String, default: '' },
  github: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  discord: { type: String, default: '' }
})

const LabelsSchema = new Schema<ILabels>({
  // General
  appName: { type: String, default: 'Admin Dashboard' },
  dashboard: { type: String, default: 'Dashboard' },
  profile: { type: String, default: 'Profile' },
  settings: { type: String, default: 'Settings' },
  logout: { type: String, default: 'Logout' },
  login: { type: String, default: 'Login' },
  register: { type: String, default: 'Register' },
  save: { type: String, default: 'Save' },
  cancel: { type: String, default: 'Cancel' },
  delete: { type: String, default: 'Delete' },
  edit: { type: String, default: 'Edit' },
  view: { type: String, default: 'View' },
  
  // Dashboard
  welcomeMessage: { type: String, default: 'Welcome back!' },
  totalUsers: { type: String, default: 'Total Users' },
  totalRevenue: { type: String, default: 'Total Revenue' },
  activeSubscriptions: { type: String, default: 'Active Subscriptions' },
  recentActivities: { type: String, default: 'Recent Activities' },
  
  // Buttons
  createNew: { type: String, default: 'Create New' },
  viewDetails: { type: String, default: 'View Details' },
  downloadReport: { type: String, default: 'Download Report' },
  exportData: { type: String, default: 'Export Data' },
  importData: { type: String, default: 'Import Data' },
  
  // Forms
  name: { type: String, default: 'Name' },
  email: { type: String, default: 'Email' },
  password: { type: String, default: 'Password' },
  confirmPassword: { type: String, default: 'Confirm Password' },
  phone: { type: String, default: 'Phone' },
  address: { type: String, default: 'Address' },
  
  // Status
  active: { type: String, default: 'Active' },
  inactive: { type: String, default: 'Inactive' },
  pending: { type: String, default: 'Pending' },
  completed: { type: String, default: 'Completed' },
  draft: { type: String, default: 'Draft' },
  
  // Navigation
  home: { type: String, default: 'Home' },
  about: { type: String, default: 'About' },
  services: { type: String, default: 'Services' },
  contact: { type: String, default: 'Contact' },
  help: { type: String, default: 'Help' },
  support: { type: String, default: 'Support' },
  
  // Messages
  loading: { type: String, default: 'Loading...' },
  error: { type: String, default: 'Error' },
  success: { type: String, default: 'Success' },
  warning: { type: String, default: 'Warning' },
  info: { type: String, default: 'Info' },
  confirm: { type: String, default: 'Confirm' },
  
  // Search & Filter
  search: { type: String, default: 'Search' },
  filter: { type: String, default: 'Filter' },
  sort: { type: String, default: 'Sort' },
  reset: { type: String, default: 'Reset' },
  apply: { type: String, default: 'Apply' },
  clear: { type: String, default: 'Clear' },
  
  // Pagination
  previous: { type: String, default: 'Previous' },
  next: { type: String, default: 'Next' },
  first: { type: String, default: 'First' },
  last: { type: String, default: 'Last' },
  showing: { type: String, default: 'Showing' },
  of: { type: String, default: 'of' },
  results: { type: String, default: 'results' },
  
  // Table headers
  id: { type: String, default: 'ID' },
  status: { type: String, default: 'Status' },
  actions: { type: String, default: 'Actions' },
  createdAt: { type: String, default: 'Created At' },
  updatedAt: { type: String, default: 'Updated At' },
  
  // Dark mode
  lightMode: { type: String, default: 'Light Mode' },
  darkMode: { type: String, default: 'Dark Mode' }
})

const SeoSchema = new Schema<ISeo>({
  metaTitle: { type: String, default: 'Admin Dashboard' },
  metaDescription: { type: String, default: 'Manage your application' },
  metaKeywords: { type: [String], default: ['admin', 'dashboard'] },
  ogTitle: { type: String, default: 'Admin Dashboard' },
  ogDescription: { type: String, default: 'Manage your application' },
  ogImage: { type: String, default: '/og-image.png' },
  twitterCard: { type: String, default: 'summary_large_image' },
  canonicalUrl: { type: String, default: '' },
  robotsTxt: { type: String, default: 'index, follow' }
})

const ThemeSchema = new Schema<ITheme>({
  primaryColor: { type: String, default: '#1a73e8' },
  secondaryColor: { type: String, default: '#34a853' },
  accentColor: { type: String, default: '#ea4335' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#202124' },
  textSecondary: { type: String, default: '#5f6368' },
  textMuted: { type: String, default: '#80868b' },
  borderColor: { type: String, default: '#e8eaed' },
  successColor: { type: String, default: '#34a853' },
  warningColor: { type: String, default: '#f9ab00' },
  errorColor: { type: String, default: '#ea4335' },
  infoColor: { type: String, default: '#1a73e8' },
  fontFamily: { type: String, default: 'Inter, sans-serif' },
  fontSizeBase: { type: String, default: '14px' },
  fontSizeLg: { type: String, default: '16px' },
  fontSizeSm: { type: String, default: '12px' },
  borderRadius: { type: String, default: '8px' },
  borderRadiusLg: { type: String, default: '12px' },
  borderRadiusSm: { type: String, default: '4px' },
  boxShadow: { type: String, default: '0 1px 2px rgba(0,0,0,0.05)' },
  boxShadowLg: { type: String, default: '0 4px 12px rgba(0,0,0,0.1)' },
  headerHeight: { type: String, default: '64px' },
  sidebarWidth: { type: String, default: '250px' },
  darkMode: { type: Boolean, default: false }
})

const SystemSchema = new Schema<ISystem>({
  timezone: { type: String, default: 'UTC' },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  timeFormat: { type: String, default: 'hh:mm A' },
  currency: { type: String, default: 'USD' },
  currencySymbol: { type: String, default: '$' },
  language: { type: String, default: 'en' },
  supportedLanguages: { type: [String], default: ['en'] },
  defaultRole: { type: String, default: 'user' },
  defaultPlan: { type: String, default: 'free' },
  trialDays: { type: Number, default: 14 },
  sessionTimeout: { type: Number, default: 30 },
  itemsPerPage: { type: Number, default: 10 },
  enableRegistration: { type: Boolean, default: true },
  enableEmailVerification: { type: Boolean, default: false },
  enablePhoneVerification: { type: Boolean, default: false },
  enableTwoFactor: { type: Boolean, default: false },
  enableCaptcha: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  cacheEnabled: { type: Boolean, default: true },
  cacheDuration: { type: Number, default: 3600 },
  enableCompression: { type: Boolean, default: true },
  rateLimit: { type: Number, default: 100 },
  rateLimitWindow: { type: Number, default: 15 },
  maxLoginAttempts: { type: Number, default: 5 },
  lockoutDuration: { type: Number, default: 15 }
})

const AboutSchema = new Schema<IAbout>({
  companyName: { type: String, default: 'Admin Dashboard' },
  companySlogan: { type: String, default: 'Building Amazing Products' },
  companyDescription: { type: String, default: 'We build amazing products' },
  companyLogo: { type: String, default: '/logo.png' },
  companyFavicon: { type: String, default: '/favicon.ico' },
  foundedYear: { type: Number, default: () => new Date().getFullYear() },
  employeeCount: { type: String, default: '10-50' },
  industry: { type: String, default: 'Technology' },
  companyWebsite: { type: String, default: '' },
  companyEmail: { type: String, default: '' },
  
  contact: { type: ContactSchema, default: () => ({}) },
  socialMedia: { type: SocialMediaSchema, default: () => ({}) },
  labels: { type: LabelsSchema, default: () => ({}) },
  seo: { type: SeoSchema, default: () => ({}) },
  theme: { type: ThemeSchema, default: () => ({}) },
  system: { type: SystemSchema, default: () => ({}) },
  
  createdBy: { type: Schema.Types.Mixed, default: 'system' },
  updatedBy: { type: Schema.Types.Mixed, default: 'system' }
}, {
  timestamps: true
})

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema)