import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import AdvanceSettings from '@/models/AdvanceSettings'
import { verifyToken } from '@/lib/jwt'

// GET - Fetch advance settings
export async function GET(request: NextRequest) {
  try {
    console.log('⚙️ GET /api/advance/settings - Starting...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get or create advance settings
    let advanceSettings = await AdvanceSettings.findOne({ userId: user._id })
    
    if (!advanceSettings) {
      // Create default settings if none exist
      advanceSettings = new AdvanceSettings({
        userId: user._id,
        preferences: getDefaultPreferences(user),
        notifications: getDefaultNotifications(),
        integrations: getDefaultIntegrations(),
        billing: getDefaultBilling(),
        security: getDefaultSecurity(),
        appearance: getDefaultAppearance(),
        analytics: getDefaultAnalytics(),
        customization: getDefaultCustomization(),
        lastUpdated: new Date(),
        version: '1.0.0'
      })
      await advanceSettings.save()
    }

    console.log('✅ Advance settings fetched successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance settings fetched successfully',
      data: advanceSettings
    })

  } catch (error: any) {
    console.error('❌ Advance Settings GET error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// PUT - Update advance settings
export async function PUT(request: NextRequest) {
  try {
    console.log('⚙️ PUT /api/advance/settings - Starting...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Parse request body
    const body = await request.json()
    const { 
      preferences,
      notifications,
      integrations,
      billing,
      security,
      appearance,
      analytics,
      customization,
      section 
    } = body

    if (!section) {
      return NextResponse.json({
        success: false,
        message: 'Section is required to update settings'
      }, { status: 400 })
    }

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get advance settings
    let advanceSettings = await AdvanceSettings.findOne({ userId: user._id })
    
    if (!advanceSettings) {
      // Create new settings if none exist
      advanceSettings = new AdvanceSettings({
        userId: user._id,
        preferences: getDefaultPreferences(user),
        notifications: getDefaultNotifications(),
        integrations: getDefaultIntegrations(),
        billing: getDefaultBilling(),
        security: getDefaultSecurity(),
        appearance: getDefaultAppearance(),
        analytics: getDefaultAnalytics(),
        customization: getDefaultCustomization(),
        lastUpdated: new Date(),
        version: '1.0.0'
      })
    }

    // Update specific section
    switch (section) {
      case 'preferences':
        advanceSettings.preferences = { ...advanceSettings.preferences, ...preferences }
        break
      case 'notifications':
        advanceSettings.notifications = { ...advanceSettings.notifications, ...notifications }
        break
      case 'integrations':
        advanceSettings.integrations = { ...advanceSettings.integrations, ...integrations }
        break
      case 'billing':
        advanceSettings.billing = { ...advanceSettings.billing, ...billing }
        break
      case 'security':
        advanceSettings.security = { ...advanceSettings.security, ...security }
        break
      case 'appearance':
        advanceSettings.appearance = { ...advanceSettings.appearance, ...appearance }
        break
      case 'analytics':
        advanceSettings.analytics = { ...advanceSettings.analytics, ...analytics }
        break
      case 'customization':
        advanceSettings.customization = { ...advanceSettings.customization, ...customization }
        break
      case 'all':
        // Update all sections
        if (preferences) advanceSettings.preferences = preferences
        if (notifications) advanceSettings.notifications = notifications
        if (integrations) advanceSettings.integrations = integrations
        if (billing) advanceSettings.billing = billing
        if (security) advanceSettings.security = security
        if (appearance) advanceSettings.appearance = appearance
        if (analytics) advanceSettings.analytics = analytics
        if (customization) advanceSettings.customization = customization
        break
      default:
        return NextResponse.json({
          success: false,
          message: `Invalid section: ${section}`
        }, { status: 400 })
    }

    // Update metadata
    advanceSettings.lastUpdated = new Date()
    
    // Validate and save
    await advanceSettings.save()

    console.log(`✅ Advance settings updated successfully for section: ${section}`)

    return NextResponse.json({
      success: true,
      message: 'Advance settings updated successfully',
      data: advanceSettings
    })

  } catch (error: any) {
    console.error('❌ Advance Settings PUT error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// PATCH - Update specific settings fields
export async function PATCH(request: NextRequest) {
  try {
    console.log('⚙️ PATCH /api/advance/settings - Starting...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Parse request body
    const updates = await request.json()

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No updates provided'
      }, { status: 400 })
    }

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Get advance settings
    let advanceSettings = await AdvanceSettings.findOne({ userId: user._id })
    
    if (!advanceSettings) {
      // Create new settings if none exist
      advanceSettings = new AdvanceSettings({
        userId: user._id,
        preferences: getDefaultPreferences(user),
        notifications: getDefaultNotifications(),
        integrations: getDefaultIntegrations(),
        billing: getDefaultBilling(),
        security: getDefaultSecurity(),
        appearance: getDefaultAppearance(),
        analytics: getDefaultAnalytics(),
        customization: getDefaultCustomization(),
        lastUpdated: new Date(),
        version: '1.0.0'
      })
    }

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      // Handle nested updates using dot notation
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.')
        if (advanceSettings[parentKey] && typeof advanceSettings[parentKey] === 'object') {
          advanceSettings[parentKey][childKey] = value
        }
      } else if (advanceSettings[key] !== undefined) {
        advanceSettings[key] = value
      }
    }

    // Update metadata
    advanceSettings.lastUpdated = new Date()
    
    // Save
    await advanceSettings.save()

    console.log('✅ Advance settings patched successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance settings updated successfully',
      data: advanceSettings
    })

  } catch (error: any) {
    console.error('❌ Advance Settings PATCH error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// POST - Reset settings to defaults
export async function POST(request: NextRequest) {
  try {
    console.log('⚙️ POST /api/advance/settings/reset - Starting...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()

    // Get user
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'User not found' 
      }, { status: 404 })
    }

    // Create or replace with default settings
    const advanceSettings = new AdvanceSettings({
      userId: user._id,
      preferences: getDefaultPreferences(user),
      notifications: getDefaultNotifications(),
      integrations: getDefaultIntegrations(),
      billing: getDefaultBilling(),
      security: getDefaultSecurity(),
      appearance: getDefaultAppearance(),
      analytics: getDefaultAnalytics(),
      customization: getDefaultCustomization(),
      lastUpdated: new Date(),
      version: '1.0.0'
    })

    // Save (this will replace existing settings due to unique userId)
    await AdvanceSettings.findOneAndUpdate(
      { userId: user._id },
      advanceSettings,
      { upsert: true, new: true }
    )

    console.log('✅ Advance settings reset to defaults successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance settings reset to defaults successfully',
      data: advanceSettings
    })

  } catch (error: any) {
    console.error('❌ Advance Settings POST error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete advance settings
export async function DELETE(request: NextRequest) {
  try {
    console.log('⚙️ DELETE /api/advance/settings - Starting...')
    
    // Authentication
    const token = await getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    await connectToDatabase()

    // Delete settings
    const result = await AdvanceSettings.findOneAndDelete({ userId: userId })

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'No advance settings found to delete'
      }, { status: 404 })
    }

    console.log('✅ Advance settings deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Advance settings deleted successfully',
      data: null
    })

  } catch (error: any) {
    console.error('❌ Advance Settings DELETE error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ 
        success: false,
        message: 'Authentication required' 
      }, { status: 401 })
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Internal server error',
        data: null
      },
      { status: 500 }
    )
  }
}

// Helper function to extract token from request
async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookies
  const authToken = request.cookies.get('auth_token')?.value
  if (authToken) {
    return authToken
  }
  
  return null
}

// Default settings generators
function getDefaultPreferences(user: any) {
  return {
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
    firstDayOfWeek: 0, // Sunday
    decimalPlaces: 2,
    numberFormat: '1,234.56',
    autoSave: true,
    autoSaveInterval: 60, // seconds
    defaultView: 'dashboard',
    enableAnimations: true,
    keyboardShortcuts: true,
    tooltips: true,
    confirmationDialogs: true,
    dataRetention: 365, // days
    exportFormat: 'excel',
    backupFrequency: 'daily',
    backupLocation: 'cloud',
    themeSync: true
  }
}

function getDefaultNotifications() {
  return {
    email: {
      enabled: true,
      frequency: 'instant',
      types: {
        billing: true,
        security: true,
        updates: true,
        promotions: false,
        newsletters: false
      }
    },
    push: {
      enabled: true,
      types: {
        important: true,
        reminders: true,
        updates: false
      }
    },
    inApp: {
      enabled: true,
      sound: true,
      types: {
        all: true
      }
    },
    sms: {
      enabled: false,
      types: {
        critical: true,
        otp: true
      }
    },
    webhook: {
      enabled: false,
      url: ''
    },
    rules: [
      {
        id: 'invoice_paid',
        name: 'Invoice Paid',
        enabled: true,
        channel: 'email'
      },
      {
        id: 'subscription_renewal',
        name: 'Subscription Renewal',
        enabled: true,
        channel: 'email'
      },
      {
        id: 'security_alert',
        name: 'Security Alert',
        enabled: true,
        channel: ['email', 'push']
      }
    ],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      days: ['Saturday', 'Sunday']
    }
  }
}

function getDefaultIntegrations() {
  return {
    paymentGateways: {
      razorpay: {
        enabled: false,
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        sandbox: true
      },
      stripe: {
        enabled: false,
        publishableKey: '',
        secretKey: '',
        webhookSecret: ''
      },
      paypal: {
        enabled: false,
        clientId: '',
        secret: '',
        sandbox: true
      }
    },
    accounting: {
      quickbooks: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        companyId: ''
      },
      tally: {
        enabled: false,
        path: '',
        autoSync: false
      },
      zohoBooks: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        organizationId: ''
      }
    },
    ecommerce: {
      shopify: {
        enabled: false,
        storeUrl: '',
        accessToken: '',
        apiVersion: '2024-01'
      },
      woocommerce: {
        enabled: false,
        storeUrl: '',
        consumerKey: '',
        consumerSecret: ''
      }
    },
    shipping: {
      shiprocket: {
        enabled: false,
        email: '',
        password: '',
        token: ''
      },
      delhivery: {
        enabled: false,
        clientId: '',
        clientSecret: ''
      }
    },
    communication: {
      twilio: {
        enabled: false,
        accountSid: '',
        authToken: '',
        phoneNumber: ''
      },
      sendgrid: {
        enabled: false,
        apiKey: '',
        fromEmail: ''
      },
      whatsapp: {
        enabled: false,
        businessId: '',
        accessToken: ''
      }
    },
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: ''
      },
      facebookPixel: {
        enabled: false,
        pixelId: ''
      }
    },
    storage: {
      awsS3: {
        enabled: false,
        accessKeyId: '',
        secretAccessKey: '',
        bucketName: '',
        region: 'ap-south-1'
      },
      googleDrive: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        refreshToken: ''
      }
    },
    api: {
      enabled: false,
      apiKey: '',
      rateLimit: 100,
      allowedOrigins: [],
      webhooks: []
    }
  }
}

function getDefaultBilling() {
  return {
    subscription: {
      plan: 'trial',
      status: 'trial',
      autoRenew: false,
      nextBillingDate: null,
      billingCycle: 'monthly',
      invoicePrefix: 'INV',
      taxInclusive: true
    },
    invoice: {
      autoGenerate: true,
      dueDays: 7,
      lateFee: 2, // percentage
      reminderDays: [3, 7],
      paymentTerms: 'Net 7',
      notes: 'Thank you for your business!',
      footer: 'Terms & Conditions Apply'
    },
    tax: {
      gst: {
        enabled: true,
        number: '',
        rate: 18
      },
      igst: {
        enabled: false,
        rate: 0
      },
      sgst: {
        enabled: false,
        rate: 0
      },
      cgst: {
        enabled: false,
        rate: 0
      }
    },
    currency: {
      primary: 'INR',
      secondary: 'USD',
      exchangeRate: 83.5,
      autoUpdate: false
    },
    payment: {
      methods: ['upi', 'bank_transfer', 'cash'],
      defaultMethod: 'upi',
      upiId: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: ''
      },
      partialPayments: false,
      discount: {
        enabled: false,
        percentage: 0,
        minAmount: 0
      }
    },
    reports: {
      generateMonthly: true,
      generateYearly: true,
      includeTax: true,
      emailReports: false
    }
  }
}

function getDefaultSecurity() {
  return {
    authentication: {
      twoFactor: {
        enabled: false,
        method: 'app', // app, sms, email
        backupCodes: []
      },
      sessionTimeout: 60, // minutes
      maxSessions: 5,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expirationDays: 90
      }
    },
    authorization: {
      roleBasedAccess: true,
      permissions: {
        viewDashboard: true,
        manageProducts: true,
        manageCustomers: true,
        manageInvoices: true,
        manageReports: true,
        manageSettings: true,
        manageUsers: false
      }
    },
    dataProtection: {
      encryption: {
        enabled: true,
        algorithm: 'aes-256-gcm'
      },
      backup: {
        autoBackup: true,
        frequency: 'daily',
        retentionDays: 30,
        location: 'cloud'
      },
      dataRetention: {
        enabled: true,
        deleteAfter: 365, // days
        anonymize: true
      }
    },
    audit: {
      enabled: true,
      logEvents: ['login', 'logout', 'create', 'update', 'delete'],
      retentionDays: 90
    },
    ipRestrictions: {
      enabled: false,
      allowedIPs: [],
      countryRestrictions: []
    },
    apiSecurity: {
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 60
      },
      cors: {
        enabled: true,
        allowedOrigins: []
      }
    }
  }
}

function getDefaultAppearance() {
  return {
    theme: {
      mode: 'light', // light, dark, system
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      fontFamily: 'Roboto, sans-serif',
      borderRadius: 8,
      density: 'comfortable' // compact, standard, comfortable
    },
    dashboard: {
      layout: 'grid',
      widgets: [
        { id: 'revenue', enabled: true, size: 'medium' },
        { id: 'customers', enabled: true, size: 'small' },
        { id: 'orders', enabled: true, size: 'small' },
        { id: 'products', enabled: true, size: 'medium' },
        { id: 'recentActivity', enabled: true, size: 'large' }
      ],
      defaultView: 'overview',
      refreshInterval: 300 // seconds
    },
    navigation: {
      style: 'sidebar', // sidebar, topbar, both
      collapsed: false,
      showLabels: true,
      order: ['dashboard', 'products', 'customers', 'invoices', 'reports', 'settings']
    },
    table: {
      rowsPerPage: 10,
      showFilters: true,
      showSearch: true,
      defaultSort: { field: 'createdAt', order: 'desc' }
    },
    forms: {
      showHelpText: true,
      validationStyle: 'real-time', // real-time, on-submit
      autoComplete: true
    },
    charts: {
      type: 'line', // line, bar, pie
      animation: true,
      showGrid: true,
      showLabels: true
    }
  }
}

function getDefaultAnalytics() {
  return {
    tracking: {
      enabled: true,
      anonymize: true,
      events: ['page_view', 'button_click', 'form_submit']
    },
    dashboards: {
      enabled: true,
      autoRefresh: true,
      refreshInterval: 300, // seconds
      defaultTimeRange: 'monthly',
      comparePeriod: true
    },
    reports: {
      autoGenerate: {
        daily: false,
        weekly: true,
        monthly: true,
        yearly: true
      },
      emailReports: true,
      saveToCloud: true,
      formats: ['pdf', 'excel', 'csv']
    },
    metrics: {
      includeRevenue: true,
      includeCustomers: true,
      includeProducts: true,
      includeInvoices: true,
      includeExpenses: false
    },
    forecasting: {
      enabled: true,
      method: 'linear', // linear, exponential, moving_average
      confidenceInterval: 95,
      periods: 12 // months
    },
    benchmarks: {
      enabled: true,
      industry: 'retail',
      compareToAverage: true
    },
    alerts: {
      enabled: true,
      conditions: [
        { metric: 'revenue', operator: '<', value: 10000, period: 'monthly' },
        { metric: 'customers', operator: '<', value: 10, period: 'monthly' },
        { metric: 'churn_rate', operator: '>', value: 10, period: 'monthly' }
      ],
      notificationChannels: ['email', 'in_app']
    }
  }
}

function getDefaultCustomization() {
  return {
    branding: {
      logo: '',
      favicon: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      website: '',
      taxId: '',
      registrationNumber: ''
    },
    templates: {
      invoice: {
        header: '',
        footer: '',
        colors: {
          primary: '#1976d2',
          secondary: '#f5f5f5',
          text: '#333333'
        },
        layout: 'standard', // standard, modern, minimal
        showLogo: true,
        showQR: true
      },
      email: {
        fromName: '',
        fromEmail: '',
        signature: '',
        templates: {
          welcome: '',
          invoice: '',
          payment: '',
          reminder: ''
        }
      },
      sms: {
        signature: '',
        templates: {
          otp: '',
          payment: '',
          reminder: ''
        }
      }
    },
    workflows: {
      invoice: {
        autoNumbering: true,
        numberPrefix: 'INV',
        defaultTerms: 'Net 7',
        autoSend: false,
        reminders: {
          beforeDue: true,
          afterDue: true,
          interval: 3 // days
        }
      },
      customer: {
        autoAssignId: true,
        welcomeEmail: true,
        followUpDays: 7
      },
      product: {
        lowStockAlert: true,
        threshold: 10,
        autoReorder: false
      }
    },
    automation: {
      rules: [
        {
          id: 'auto_invoice',
          name: 'Auto Generate Invoice',
          enabled: false,
          trigger: 'order_created',
          action: 'create_invoice',
          conditions: []
        },
        {
          id: 'low_stock',
          name: 'Low Stock Alert',
          enabled: true,
          trigger: 'stock_updated',
          action: 'send_alert',
          conditions: [{ field: 'quantity', operator: '<', value: 10 }]
        }
      ]
    },
    fields: {
      customFields: {
        customers: [],
        products: [],
        invoices: [],
        orders: []
      },
      requiredFields: {
        customers: ['name', 'email'],
        products: ['name', 'price'],
        invoices: ['customer', 'items']
      }
    }
  }
}