import { NextRequest, NextResponse } from 'next/server';

const PRICING_PLANS = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    originalPrice: 299,
    period: '14 days',
    description: 'Perfect for trying out all features',
    popular: false,
    features: {
      included: [
        { name: 'Basic Inventory Management', icon: 'Package', description: 'Track up to 100 products', category: 'Inventory' },
        { name: 'Customer Management', icon: 'Users', description: 'Manage up to 50 customers', category: 'Customers' },
        { name: 'Invoice Generation', icon: 'Receipt', description: 'Create GST-compliant invoices', category: 'Billing' },
        { name: 'Basic Dashboard', icon: 'BarChart', description: 'Overview of key metrics', category: 'Analytics' },
        { name: 'Email Support', icon: 'Mail', description: 'Basic email support', category: 'Support' },
        { name: 'Mobile Access', icon: 'Smartphone', description: 'Responsive mobile interface', category: 'Mobile' },
        { name: 'Data Backup', icon: 'Cloud', description: 'Daily automated backups', category: 'Security' },
      ],
      excluded: [
        'Advanced Analytics',
        'Priority Support',
        'API Access',
        'Bulk Operations',
        'Custom Reports'
      ]
    },
    limits: {
      customers: 50,
      products: 100,
      invoices: 50,
      storageMB: 100,
      users: 1,
      supportHours: 24
    },
    highlights: [
      'No credit card required',
      'Full feature access',
      'Perfect for testing'
    ]
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 999,
    originalPrice: 1299,
    period: 'per month',
    description: 'Perfect for small businesses',
    popular: false,
    features: {
      included: [
        { name: 'Advanced Inventory', icon: 'Package', description: 'Unlimited products with batch tracking', category: 'Inventory' },
        { name: 'Sales Analytics Pro', icon: 'BarChart3', description: 'Advanced sales trends and forecasting', category: 'Analytics' },
        { name: 'Customer CRM', icon: 'Users', description: 'Complete customer lifecycle management', category: 'Customers' },
        { name: 'Advanced Billing', icon: 'Receipt', description: 'Recurring billing and payment tracking', category: 'Billing' },
        { name: 'Priority Support', icon: 'MessageSquare', description: '24-hour response time', category: 'Support' },
        { name: 'Mobile App', icon: 'SmartphoneCharging', description: 'Dedicated mobile application', category: 'Mobile' },
        { name: 'Advanced Security', icon: 'Shield', description: 'Enhanced security features', category: 'Security' },
        { name: 'Basic API Access', icon: 'Globe', description: 'Limited API access', category: 'API' },
      ],
      excluded: [
        'Custom Development',
        'Dedicated Account Manager',
        'White-label Solution',
        'Advanced API Access'
      ]
    },
    limits: {
      customers: 1000,
      products: 5000,
      invoices: 5000,
      storageMB: 1024,
      users: 3,
      supportHours: 12
    },
    highlights: [
      'Most flexible option',
      'Cancel anytime',
      'All core features included'
    ],
    savingPercentage: 23
  },
  {
    id: 'quarterly',
    name: 'Quarterly Business',
    price: 2699,
    originalPrice: 2997,
    period: 'for 3 months',
    description: 'Great for growing businesses',
    popular: true,
    features: {
      included: [
        { name: 'Enterprise Inventory', icon: 'Database', description: 'Multi-warehouse management', category: 'Inventory' },
        { name: 'AI-Powered Analytics', icon: 'TrendingUp', description: 'Predictive analytics and insights', category: 'Analytics' },
        { name: 'Advanced CRM', icon: 'UserCheck', description: 'Customer segmentation and marketing', category: 'Customers' },
        { name: 'Automated Billing', icon: 'CreditCard', description: 'Automated invoicing and reminders', category: 'Billing' },
        { name: '24/7 Priority Support', icon: 'Video', description: 'Video call support available', category: 'Support' },
        { name: 'Native Mobile Apps', icon: 'Smartphone', description: 'iOS and Android apps', category: 'Mobile' },
        { name: 'Enterprise Security', icon: 'Shield', description: 'Advanced security and compliance', category: 'Security' },
        { name: 'Full API Access', icon: 'Globe', description: 'Complete API integration', category: 'API' },
        { name: 'Custom Workflows', icon: 'Workflow', description: 'Build custom business processes', category: 'API' },
        { name: 'Bulk Operations', icon: 'Database', description: 'Handle large data operations', category: 'Inventory' },
      ],
      excluded: [
        'Custom Development Hours',
        'Dedicated Infrastructure'
      ]
    },
    limits: {
      customers: 5000,
      products: 10000,
      invoices: 15000,
      storageMB: 2048,
      users: 5,
      supportHours: 6
    },
    highlights: [
      'Most popular choice',
      'Best value for money',
      'Advanced features included'
    ],
    savingPercentage: 10
  },
  {
    id: 'yearly',
    name: 'Enterprise',
    price: 8999,
    originalPrice: 11988,
    period: 'per year',
    description: 'Complete solution for established businesses',
    popular: false,
    features: {
      included: [
        { name: 'Unlimited Inventory', icon: 'Database', description: 'Enterprise-grade inventory system', category: 'Inventory' },
        { name: 'Executive Dashboard', icon: 'FileBarChart', description: 'Customizable executive dashboards', category: 'Analytics' },
        { name: 'Enterprise CRM', icon: 'Users', description: 'Advanced customer analytics', category: 'Customers' },
        { name: 'Automated Tax Filing', icon: 'Receipt', description: 'GST filing automation', category: 'Billing' },
        { name: 'Dedicated Support', icon: 'Video', description: 'Dedicated account manager', category: 'Support' },
        { name: 'Custom Mobile Apps', icon: 'Smartphone', description: 'Branded mobile applications', category: 'Mobile' },
        { name: 'Bank-grade Security', icon: 'Shield', description: 'Highest security standards', category: 'Security' },
        { name: 'Unlimited API Access', icon: 'Globe', description: 'Full API with custom endpoints', category: 'API' },
        { name: 'Custom Integrations', icon: 'Settings', description: 'Custom third-party integrations', category: 'API' },
        { name: 'Training & Onboarding', icon: 'HelpCircle', description: 'Custom training sessions', category: 'Support' },
        { name: 'SLA Guarantee', icon: 'BadgeCheck', description: '99.9% uptime SLA', category: 'Support' },
        { name: 'Custom Development', icon: 'Cpu', description: 'Custom feature development', category: 'API' },
      ],
      excluded: []
    },
    limits: {
      customers: 10000,
      products: 50000,
      invoices: 50000,
      storageMB: 5120,
      users: 10,
      supportHours: 2
    },
    highlights: [
      'Maximum savings',
      'Highest priority support',
      'Custom features available'
    ],
    savingPercentage: 25
  }
];

export async function GET(request: NextRequest) {
  try {
    // Add cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    return NextResponse.json({
      success: true,
      data: PRICING_PLANS,
      currency: 'INR',
      timestamp: new Date().toISOString()
    }, { headers });
  } catch (error: any) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}