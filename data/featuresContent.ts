import React from 'react'
import {
  Analytics,
  Inventory,
  People,
  Receipt,
  Security,
  Speed,
  Category,
  LocalShipping,
  Payment,
  Dashboard,
  Report,
  Notifications,
  Settings,
  CheckCircle,
  TrendingUp,
  Smartphone,
  Sync,
  SvgIconComponent
} from '@mui/icons-material'

// Create an icon map
export const iconMap = {
  inventory: Inventory,
  analytics: Analytics,
  people: People,
  receipt: Receipt,
  security: Security,
  speed: Speed,
  category: Category,
  local_shipping: LocalShipping,
  payment: Payment,
  dashboard: Dashboard,
  report: Report,
  notifications: Notifications,
  settings: Settings,
  check_circle: CheckCircle,
  trending_up: TrendingUp,
  smartphone: Smartphone,
  sync: Sync
} as const

export type IconName = keyof typeof iconMap

export interface Feature {
  id: string
  title: string
  description: string
  iconName: IconName
  color?: string
  highlight?: boolean
}

export interface Integrations {
  chips: Array<{ label: string; color: string }>
  apiFeatures: Array<{ title: string; description: string }>
  benefits: string[]
}

export interface FeatureCategory {
  id: string
  title: string
  iconName: IconName
  description: string
  features: Feature[]
  color?: string
  gradient?: string
}

export interface Benefit {
  id: string
  title: string
  description: string
  iconName: IconName
  color: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'secondary'
  gradient?: string
}

export interface IntegrationItem {
  title: string
  description: string
  iconName: IconName
}

// Features with different colors and styles
export const featureCategories: FeatureCategory[] = [
  {
    id: 'inventory',
    title: 'Inventory Management',
    iconName: 'inventory',
    description: 'Complete control over your stock with real-time tracking',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    features: [
      {
        id: 'stock-tracking',
        title: 'Stock Tracking',
        description: 'Real-time tracking of inventory levels across locations',
        iconName: 'category',
        color: '#4CAF50'
      },
      {
        id: 'batch-management',
        title: 'Batch Management',
        description: 'Track batches, expiry dates, and manufacturing details',
        iconName: 'local_shipping',
        color: '#4CAF50'
      },
      {
        id: 'low-stock-alerts',
        title: 'Low Stock Alerts',
        description: 'Automated notifications when stock runs low',
        iconName: 'notifications',
        color: '#FF9800',
        highlight: true
      },
      {
        id: 'inventory-reports',
        title: 'Inventory Reports',
        description: 'Detailed reports on stock movement and turnover',
        iconName: 'report',
        color: '#4CAF50'
      }
    ]
  },
  {
    id: 'sales',
    title: 'Sales & Analytics',
    iconName: 'analytics',
    description: 'Powerful analytics to drive your business decisions',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
    features: [
      {
        id: 'sales-dashboard',
        title: 'Sales Dashboard',
        description: 'Real-time insights into revenue, orders, and trends',
        iconName: 'dashboard',
        color: '#2196F3'
      },
      {
        id: 'revenue-tracking',
        title: 'Revenue Tracking',
        description: 'Track daily, weekly, and monthly revenue with charts',
        iconName: 'trending_up',
        color: '#2196F3',
        highlight: true
      },
      {
        id: 'customer-analytics',
        title: 'Customer Analytics',
        description: 'Understand customer behavior and purchase patterns',
        iconName: 'people',
        color: '#2196F3'
      },
      {
        id: 'product-performance',
        title: 'Product Performance',
        description: 'Identify top-selling products and categories',
        iconName: 'check_circle',
        color: '#2196F3'
      }
    ]
  },
  {
    id: 'customers',
    title: 'Customer CRM',
    iconName: 'people',
    description: 'Build lasting relationships with your customers',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
    features: [
      {
        id: 'customer-profiles',
        title: 'Customer Profiles',
        description: 'Complete customer information and purchase history',
        iconName: 'people',
        color: '#9C27B0'
      },
      {
        id: 'contact-management',
        title: 'Contact Management',
        description: 'Organize and segment your customer database',
        iconName: 'category',
        color: '#9C27B0'
      },
      {
        id: 'communication-tools',
        title: 'Communication Tools',
        description: 'Email and SMS integration for customer outreach',
        iconName: 'notifications',
        color: '#FF9800',
        highlight: true
      },
      {
        id: 'loyalty-programs',
        title: 'Loyalty Programs',
        description: 'Create and manage customer loyalty programs',
        iconName: 'check_circle',
        color: '#9C27B0'
      }
    ]
  },
  {
    id: 'billing',
    title: 'Invoice & Billing',
    iconName: 'receipt',
    description: 'Professional invoicing and payment management',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
    features: [
      {
        id: 'create-invoices',
        title: 'Create Invoices',
        description: 'Generate professional invoices in seconds',
        iconName: 'receipt',
        color: '#FF5722'
      },
      {
        id: 'payment-tracking',
        title: 'Payment Tracking',
        description: 'Track payments and outstanding amounts',
        iconName: 'payment',
        color: '#FF5722'
      },
      {
        id: 'gst-compliance',
        title: 'GST Compliance',
        description: 'Automated GST calculations and reporting',
        iconName: 'check_circle',
        color: '#4CAF50',
        highlight: true
      },
      {
        id: 'payment-reminders',
        title: 'Payment Reminders',
        description: 'Automated reminders for pending payments',
        iconName: 'notifications',
        color: '#FF5722'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    iconName: 'security',
    description: 'Enterprise-grade security for your business data',
    color: '#607D8B',
    gradient: 'linear-gradient(135deg, #607D8B 0%, #37474F 100%)',
    features: [
      {
        id: 'data-encryption',
        title: 'Data Encryption',
        description: 'End-to-end encryption for all sensitive data',
        iconName: 'security',
        color: '#607D8B'
      },
      {
        id: 'user-permissions',
        title: 'User Permissions',
        description: 'Role-based access control for team members',
        iconName: 'settings',
        color: '#607D8B'
      },
      {
        id: 'audit-logs',
        title: 'Audit Logs',
        description: 'Complete audit trail of all system activities',
        iconName: 'report',
        color: '#607D8B'
      },
      {
        id: 'gdpr-compliance',
        title: 'GDPR Compliance',
        description: 'Built-in compliance with data protection regulations',
        iconName: 'check_circle',
        color: '#4CAF50',
        highlight: true
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile & Access',
    iconName: 'smartphone',
    description: 'Access your business from anywhere, anytime',
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #00BCD4 0%, #00838F 100%)',
    features: [
      {
        id: 'mobile-app',
        title: 'Mobile App',
        description: 'Full-featured mobile app for on-the-go management',
        iconName: 'smartphone',
        color: '#00BCD4'
      },
      {
        id: 'real-time-sync',
        title: 'Real-time Sync',
        description: 'Instant sync across all devices and platforms',
        iconName: 'sync',
        color: '#00BCD4',
        highlight: true
      },
      {
        id: 'offline-mode',
        title: 'Offline Mode',
        description: 'Work offline with automatic sync when connected',
        iconName: 'speed',
        color: '#00BCD4'
      },
      {
        id: 'multi-device-access',
        title: 'Multi-device Access',
        description: 'Access from any device - desktop, tablet, or mobile',
        iconName: 'check_circle',
        color: '#00BCD4'
      }
    ]
  }
]

export const benefits: Benefit[] = [
  {
    id: 'faster-operations',
    title: '3x Faster Operations',
    description: 'Automate repetitive tasks and save hours every day',
    iconName: 'speed',
    color: 'primary',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'increase-revenue',
    title: 'Increase Revenue',
    description: 'Data-driven insights to boost sales and profitability',
    iconName: 'trending_up',
    color: 'success',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
  },
  {
    id: 'reduce-errors',
    title: 'Reduce Errors',
    description: 'Automated systems eliminate manual data entry mistakes',
    iconName: 'security',
    color: 'info',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)'
  },
  {
    id: 'real-time-updates',
    title: 'Real-time Updates',
    description: 'Always work with the latest data across all devices',
    iconName: 'sync',
    color: 'warning',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #EF6C00 100%)'
  },
  {
    id: 'cost-effective',
    title: 'Cost Effective',
    description: 'Save up to 60% compared to using multiple tools',
    iconName: 'receipt',
    color: 'secondary',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)'
  },
  {
    id: 'scalable-growth',
    title: 'Scalable Growth',
    description: 'Grow your business without changing your tools',
    iconName: 'analytics',
    color: 'error',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)'
  }
]

export const integrations: Integrations = {
  chips: [
    { label: 'Payment Gateways', color: 'primary' },
    { label: 'Accounting Software', color: 'secondary' },
    { label: 'E-commerce', color: 'success' },
    { label: 'Banking APIs', color: 'info' },
    { label: 'Shipping Services', color: 'warning' },
    { label: 'CRM Systems', color: 'error' }
  ],
  apiFeatures: [
    {
      title: 'Full REST API',
      description: 'Comprehensive REST API with detailed documentation'
    },
    {
      title: 'Webhook Support',
      description: 'Real-time notifications and event-driven integrations'
    },
    {
      title: 'SDK Libraries',
      description: 'Pre-built SDKs for popular programming languages'
    }
  ],
  benefits: [
    'Seamless data flow between systems',
    'Automated workflows and processes',
    'Real-time synchronization',
    'Custom integration options'
  ]
}

export const heroContent = {
  title: 'Everything You Need to Run Your Business',
  subtitle: 'AccumaManage combines all essential business tools into one powerful platform. No more switching between multiple apps.',
  chipLabel: 'Premium Features',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  overlay: 'rgba(0, 0, 0, 0.3)'
}

export const featuresListContent = {
  title: 'Explore Our Powerful Features',
  subtitle: 'Organized by category for easy navigation',
  filterLabel: 'Filter by Category:',
  viewAllLabel: 'View All Features',
  viewCategoryLabel: 'View Category Details'
}

export const benefitsContent = {
  title: 'Why Businesses Love AccumaManage',
  subtitle: 'More than just features - real benefits for your business growth',
  iconSize: 48,
  cardPadding: 3
}

export const integrationContent = {
  title: 'Seamless Integration Ecosystem',
  subtitle: 'Works with your favorite tools and platforms',
  description: 'Connect AccumaManage with payment gateways, accounting software, e-commerce platforms, and more through our robust API and pre-built integrations.',
  apiTitle: 'Powerful API Access',
  apiDescription: 'Build custom integrations and extend AccumaManage\'s functionality with our comprehensive REST API.',
  benefitsTitle: 'Integration Benefits',
  chipVariant: 'filled' as const
}

export const ctaContent = {
  title: 'Ready to Transform Your Business?',
  subtitle: 'Join thousands of successful businesses using AccumaManage',
  trialButton: 'Start Free Trial →',
  pricingButton: 'View Pricing Plans',
  dashboardButton: 'Go to Dashboard',
  trialMessage: 'No credit card required • 14-day free trial • Cancel anytime',
  gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  buttonVariant: 'contained' as const
}

export const metaContent = {
  title: 'Features - AccumaManage Business Management Platform',
  description: 'Explore all features of AccumaManage - Inventory management, Sales analytics, Customer CRM, Invoicing, Security, and Mobile access in one platform.',
  keywords: 'business management, inventory, CRM, invoicing, analytics, mobile app'
}

// Helper function to get icon component by name
export const getIconComponent = (iconName: IconName, fontSize?: number, color?: string) => {
  const Icon = iconMap[iconName]
  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in iconMap`)
    return null
  }
  return 0;
}