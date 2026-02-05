import mongoose from 'mongoose'

const AdvanceSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // User Preferences
  preferences: {
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    currency: { type: String, default: 'INR' },
    dateFormat: { type: String, default: 'dd/MM/yyyy' },
    timeFormat: { type: String, default: '12h' },
    firstDayOfWeek: { type: Number, default: 0 }, // 0 = Sunday
    decimalPlaces: { type: Number, default: 2 },
    numberFormat: { type: String, default: '1,234.56' },
    autoSave: { type: Boolean, default: true },
    autoSaveInterval: { type: Number, default: 60 }, // seconds
    defaultView: { type: String, default: 'dashboard' },
    enableAnimations: { type: Boolean, default: true },
    keyboardShortcuts: { type: Boolean, default: true },
    tooltips: { type: Boolean, default: true },
    confirmationDialogs: { type: Boolean, default: true },
    dataRetention: { type: Number, default: 365 }, // days
    exportFormat: { type: String, default: 'excel' },
    backupFrequency: { type: String, default: 'daily' },
    backupLocation: { type: String, default: 'cloud' },
    themeSync: { type: Boolean, default: true }
  },
  
  // Notifications
  notifications: {
    email: {
      enabled: { type: Boolean, default: true },
      frequency: { type: String, default: 'instant' },
      types: {
        billing: { type: Boolean, default: true },
        security: { type: Boolean, default: true },
        updates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        newsletters: { type: Boolean, default: false }
      }
    },
    push: {
      enabled: { type: Boolean, default: true },
      types: {
        important: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
        updates: { type: Boolean, default: false }
      }
    },
    inApp: {
      enabled: { type: Boolean, default: true },
      sound: { type: Boolean, default: true },
      types: {
        all: { type: Boolean, default: true }
      }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      types: {
        critical: { type: Boolean, default: true },
        otp: { type: Boolean, default: true }
      }
    },
    webhook: {
      enabled: { type: Boolean, default: false },
      url: { type: String, default: '' }
    },
    rules: [{
      id: String,
      name: String,
      enabled: Boolean,
      channel: mongoose.Schema.Types.Mixed // string or array
    }],
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '22:00' },
      end: { type: String, default: '08:00' },
      days: [{ type: String }]
    }
  },
  
  // Integrations
  integrations: {
    paymentGateways: {
      razorpay: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: '' },
        secretKey: { type: String, default: '' },
        webhookSecret: { type: String, default: '' },
        sandbox: { type: Boolean, default: true }
      },
      stripe: {
        enabled: { type: Boolean, default: false },
        publishableKey: { type: String, default: '' },
        secretKey: { type: String, default: '' },
        webhookSecret: { type: String, default: '' }
      }
      // Add other payment gateways as needed
    },
    accounting: {
      quickbooks: {
        enabled: { type: Boolean, default: false },
        clientId: { type: String, default: '' },
        clientSecret: { type: String, default: '' },
        refreshToken: { type: String, default: '' },
        companyId: { type: String, default: '' }
      }
      // Add other accounting software
    },
    // Add other integration categories
    api: {
      enabled: { type: Boolean, default: false },
      apiKey: { type: String, default: '' },
      rateLimit: { type: Number, default: 100 },
      allowedOrigins: [{ type: String }],
      webhooks: [{ type: Object }]
    }
  },
  
  // Billing & Invoicing
  billing: {
    subscription: {
      plan: { type: String, default: 'trial' },
      status: { type: String, default: 'trial' },
      autoRenew: { type: Boolean, default: false },
      nextBillingDate: { type: Date, default: null },
      billingCycle: { type: String, default: 'monthly' },
      invoicePrefix: { type: String, default: 'INV' },
      taxInclusive: { type: Boolean, default: true }
    },
    invoice: {
      autoGenerate: { type: Boolean, default: true },
      dueDays: { type: Number, default: 7 },
      lateFee: { type: Number, default: 2 }, // percentage
      reminderDays: [{ type: Number }],
      paymentTerms: { type: String, default: 'Net 7' },
      notes: { type: String, default: 'Thank you for your business!' },
      footer: { type: String, default: 'Terms & Conditions Apply' }
    },
    tax: {
      gst: {
        enabled: { type: Boolean, default: true },
        number: { type: String, default: '' },
        rate: { type: Number, default: 18 }
      }
    },
    payment: {
      methods: [{ type: String }],
      defaultMethod: { type: String, default: 'upi' },
      upiId: { type: String, default: '' },
      bankDetails: {
        accountName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        bankName: { type: String, default: '' },
        branch: { type: String, default: '' }
      }
    }
  },
  
  // Security
  security: {
    authentication: {
      twoFactor: {
        enabled: { type: Boolean, default: false },
        method: { type: String, default: 'app' },
        backupCodes: [{ type: String }]
      },
      sessionTimeout: { type: Number, default: 60 }, // minutes
      maxSessions: { type: Number, default: 5 }
    },
    dataProtection: {
      encryption: {
        enabled: { type: Boolean, default: true }
      },
      backup: {
        autoBackup: { type: Boolean, default: true },
        frequency: { type: String, default: 'daily' },
        retentionDays: { type: Number, default: 30 }
      }
    }
  },
  
  // Appearance & UI
  appearance: {
    theme: {
      mode: { type: String, default: 'light' },
      primaryColor: { type: String, default: '#1976d2' },
      secondaryColor: { type: String, default: '#dc004e' },
      fontFamily: { type: String, default: 'Roboto, sans-serif' },
      borderRadius: { type: Number, default: 8 },
      density: { type: String, default: 'comfortable' }
    },
    dashboard: {
      layout: { type: String, default: 'grid' },
      widgets: [{
        id: String,
        enabled: Boolean,
        size: String
      }]
    }
  },
  
  // Analytics
  analytics: {
    tracking: {
      enabled: { type: Boolean, default: true },
      anonymize: { type: Boolean, default: true },
      events: [{ type: String }]
    },
    dashboards: {
      enabled: { type: Boolean, default: true },
      autoRefresh: { type: Boolean, default: true },
      refreshInterval: { type: Number, default: 300 } // seconds
    }
  },
  
  // Customization
  customization: {
    branding: {
      logo: { type: String, default: '' },
      companyName: { type: String, default: '' },
      companyEmail: { type: String, default: '' }
    },
    templates: {
      invoice: {
        header: { type: String, default: '' },
        footer: { type: String, default: '' },
        layout: { type: String, default: 'standard' }
      }
    }
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true,
  minimize: false // Store empty objects
})

// Create indexes
AdvanceSettingsSchema.index({ userId: 1 }, { unique: true })
AdvanceSettingsSchema.index({ 'lastUpdated': -1 })

// Middleware to update lastUpdated on save
AdvanceSettingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date()
  next()
})

// Export model
const AdvanceSettings = mongoose.models.AdvanceSettings || 
  mongoose.model('AdvanceSettings', AdvanceSettingsSchema)

export default AdvanceSettings