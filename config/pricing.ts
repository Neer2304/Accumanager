// config/pricing.ts
export const PRICING_PLANS = {
  trial: {
    name: 'Free Trial',
    price: 0,
    duration: 14, // 14 days
    features: [
      'Basic inventory management',
      'Customer management',
      'Invoice generation',
      'GST compliance',
      'Basic reporting'
    ],
    limits: {
      customers: 50,
      products: 100,
      invoices: 50,
      storageMB: 100
    }
  },
  monthly: {
    name: 'Monthly Pro',
    price: 999,
    duration: 30,
    features: [
      'Everything in Trial',
      'Unlimited customers',
      'Unlimited products', 
      'Unlimited invoices',
      'Advanced reporting',
      'Priority support',
      '1GB storage'
    ],
    limits: {
      customers: 1000,
      products: 5000,
      invoices: 5000,
      storageMB: 1024
    }
  },
  quarterly: {
    name: 'Quarterly Pro',
    price: 2699,
    duration: 90,
    features: [
      'Everything in Monthly',
      '2GB storage',
      'Bulk operations',
      'Custom branding'
    ],
    limits: {
      customers: 5000,
      products: 10000,
      invoices: 15000,
      storageMB: 2048
    }
  },
  yearly: {
    name: 'Yearly Pro',
    price: 8999,
    duration: 365,
    features: [
      'Everything in Quarterly',
      '5GB storage',
      'API access',
      'Dedicated account manager',
      'Custom features'
    ],
    limits: {
      customers: 10000,
      products: 50000,
      invoices: 50000,
      storageMB: 5120
    }
  }
};

export const UPI_CONFIG = {
  upiId: 'mehtaneer143-3@okicici', // Replace with your actual UPI ID
  merchantName: 'Neer_Mehta',
  merchantCode: 'ACCUMAMANAGE123'
};