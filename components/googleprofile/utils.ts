// components/googleprofile/utils.ts
import { alpha } from '@mui/material'

export const PRICING_PLANS: Record<string, any> = {
  trial: {
    name: 'Free Trial',
    price: 0,
    duration: 14,
    features: [
      'Up to 50 products',
      'Up to 100 customers',
      'Basic inventory management',
      'Email support',
      '14-day free trial'
    ],
    limits: {
      products: 50,
      customers: 100,
      invoices: 200,
      storageMB: 100
    }
  },
  monthly: {
    name: 'Monthly Pro',
    price: 999,
    duration: 30,
    features: [
      'Up to 500 products',
      'Up to 1000 customers',
      'Advanced inventory management',
      'GST billing & reporting',
      'Priority email support',
      'Basic analytics'
    ],
    limits: {
      products: 500,
      customers: 1000,
      invoices: 5000,
      storageMB: 500
    }
  },
  quarterly: {
    name: 'Quarterly Business',
    price: 2599,
    duration: 90,
    features: [
      'Up to 2000 products',
      'Up to 5000 customers',
      'Advanced analytics & reports',
      'Multi-user access (up to 3)',
      'Phone + email support',
      'Custom branding'
    ],
    limits: {
      products: 2000,
      customers: 5000,
      invoices: 15000,
      storageMB: 2000
    },
    popular: true
  },
  yearly: {
    name: 'Yearly Enterprise',
    price: 8999,
    duration: 365,
    features: [
      'Unlimited products',
      'Unlimited customers',
      'Advanced AI analytics',
      'Multi-user access (up to 10)',
      '24/7 priority support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      products: 10000,
      customers: 25000,
      invoices: 50000,
      storageMB: 5000
    }
  }
}

export const getPlanColor = (plan: string): string => {
  switch (plan) {
    case 'trial': return '#9aa0a6';
    case 'monthly': return '#4285f4';
    case 'quarterly': return '#34a853';
    case 'yearly': return '#fbbc04';
    default: return '#9aa0a6';
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return '#34a853';
    case 'inactive': return '#9aa0a6';
    case 'trial': return '#4285f4';
    case 'expired': return '#ea4335';
    case 'cancelled': return '#5f6368';
    default: return '#9aa0a6';
  }
}

export const getStatusBackgroundColor = (status: string, darkMode: boolean): string => {
  switch (status) {
    case 'active': return darkMode ? '#0d652d' : '#d9f0e1';
    case 'inactive': return darkMode ? '#3c4043' : '#f5f5f5';
    case 'trial': return darkMode ? '#0d3064' : '#e3f2fd';
    case 'expired': return darkMode ? '#420000' : '#fce8e6';
    case 'cancelled': return darkMode ? '#3c4043' : '#f5f5f5';
    default: return darkMode ? '#3c4043' : '#f5f5f5';
  }
}

export const getProgressColor = (percentage: number): string => {
  if (percentage > 90) return '#ea4335';
  if (percentage > 75) return '#fbbc04';
  return '#34a853';
}