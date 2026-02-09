import mongoose, { Schema, Document } from 'mongoose'

interface ILabels {
  // General
  appName: string
  dashboard: string
  profile: string
  settings: string
  logout: string
  login: string
  register: string
  save: string
  cancel: string
  delete: string
  edit: string
  view: string
  
  // Dashboard
  welcomeMessage: string
  totalUsers: string
  totalRevenue: string
  activeSubscriptions: string
  recentActivities: string
  
  // Buttons
  createNew: string
  viewDetails: string
  downloadReport: string
  exportData: string
  importData: string
  
  // Forms
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  
  // Status
  active: string
  inactive: string
  pending: string
  completed: string
  draft: string
}

interface IContact {
  email: string
  phone: string
  address: string
  workingHours: string
  supportHours: string
}

interface ISocialMedia {
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
  youtube: string
  github: string
}

interface ISeo {
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage: string
}

interface ITheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  borderRadius: string
}

interface ISystem {
  timezone: string
  dateFormat: string
  timeFormat: string
  currency: string
  currencySymbol: string
  language: string
  itemsPerPage: number
  enableRegistration: boolean
  maintenanceMode: boolean
}

export interface IAbout extends Document {
  companyName: string
  companySlogan: string
  companyDescription: string
  companyLogo: string
  companyFavicon: string
  foundedYear: number
  
  contact: IContact
  socialMedia: ISocialMedia
  labels: ILabels
  seo: ISeo
  theme: ITheme
  system: ISystem
  
  createdBy: mongoose.Types.ObjectId | string
  updatedBy: mongoose.Types.ObjectId | string
  createdAt: Date
  updatedAt: Date
}

const AboutSchema = new Schema<IAbout>({
  companyName: { type: String, default: 'Admin Dashboard' },
  companySlogan: { type: String, default: 'Building Amazing Products' },
  companyDescription: { type: String, default: 'We build amazing products' },
  companyLogo: { type: String, default: '/logo.png' },
  companyFavicon: { type: String, default: '/favicon.ico' },
  foundedYear: { type: Number, default: () => new Date().getFullYear() },
  
  contact: {
    email: { type: String, default: 'contact@company.com' },
    phone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Main Street, City, Country' },
    workingHours: { type: String, default: 'Mon-Fri, 9AM-6PM' },
    supportHours: { type: String, default: '24/7' }
  },
  
  socialMedia: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  
  labels: {
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
    draft: { type: String, default: 'Draft' }
  },
  
  seo: {
    metaTitle: { type: String, default: 'Admin Dashboard' },
    metaDescription: { type: String, default: 'Manage your application' },
    metaKeywords: { type: [String], default: ['admin', 'dashboard'] },
    ogTitle: { type: String, default: 'Admin Dashboard' },
    ogDescription: { type: String, default: 'Manage your application' },
    ogImage: { type: String, default: '/og-image.png' }
  },
  
  theme: {
    primaryColor: { type: String, default: '#4285f4' },
    secondaryColor: { type: String, default: '#34a853' },
    accentColor: { type: String, default: '#ea4335' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#333333' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    borderRadius: { type: String, default: '8px' }
  },
  
  system: {
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    timeFormat: { type: String, default: 'hh:mm A' },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    language: { type: String, default: 'en' },
    itemsPerPage: { type: Number, default: 10 },
    enableRegistration: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  
  createdBy: { type: Schema.Types.Mixed, default: 'system' },
  updatedBy: { type: Schema.Types.Mixed, default: 'system' }
}, {
  timestamps: true
})

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema)