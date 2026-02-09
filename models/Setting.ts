import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  
  // Business Information (Unified - replaces Business model)
  business: {
    businessName: {
      type: String,
      required: true,
      trim: true,
      default: 'My Business'
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
    },
    pincode: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: '',
      trim: true
    },
    businessType: {
      type: String,
      enum: ['proprietorship', 'partnership', 'llp', 'pvt-ltd', 'public-ltd', 'individual', 'other'],
      default: 'proprietorship'
    },
    industry: {
      type: String,
      default: '',
      trim: true
    }
  },
  
  // Billing & Invoicing
  billing: {
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR']
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
      enum: ['Asia/Kolkata']
    },
    taxRate: {
      type: Number,
      default: 18,
      min: 0,
      max: 28
    },
    invoicePrefix: {
      type: String,
      default: 'INV',
      maxlength: 10
    },
    invoiceStartingNumber: {
      type: Number,
      default: 1000
    },
    quotationValidityDays: {
      type: Number,
      default: 30
    },
    gstType: {
      type: String,
      enum: ['cgst_sgst', 'igst', 'utgst'],
      default: 'cgst_sgst'
    },
    placeOfSupply: {
      type: String,
      default: ''
    },
    paymentTerms: {
      type: String,
      enum: ['immediate', '7days', '15days', '30days', 'custom'],
      default: 'immediate'
    },
    customPaymentDays: {
      type: Number,
      default: 0
    }
  },
  
  // Theme Settings (Simplified)
  theme: {
    mode: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    dateFormat: {
      type: String,
      enum: ['dd/mm/yyyy', 'dd-mm-yyyy', 'dd.mm.yyyy'],
      default: 'dd/mm/yyyy'
    },
    timeFormat: {
      type: String,
      enum: ['12hour', '24hour'],
      default: '12hour'
    },
    compactMode: {
      type: Boolean,
      default: false
    },
    sidebarWidth: {
      type: Number,
      default: 280,
      min: 200,
      max: 400
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  },
  
  // Notifications
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    whatsapp: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    salesAlerts: {
      type: Boolean,
      default: true
    },
    lowStockAlerts: {
      type: Boolean,
      default: true
    },
    paymentReminders: {
      type: Boolean,
      default: true
    },
    gstFilingReminders: {
      type: Boolean,
      default: true
    },
    newCustomerAlerts: {
      type: Boolean,
      default: true
    },
    billingReminders: {
      type: Boolean,
      default: true
    },
    dailySummary: {
      type: Boolean,
      default: true
    },
    summaryTime: {
      type: String,
      default: '18:00'
    }
  },
  
  // Security Settings
  security: {
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      enum: [15, 30, 60, 120],
      default: 30
    },
    passwordChangeRequired: {
      type: Boolean,
      default: false
    },
    loginAlerts: {
      type: Boolean,
      default: true
    },
    mobileVerification: {
      type: Boolean,
      default: false
    },
    ipWhitelist: {
      type: [String],
      default: []
    }
  },
  
  // Backup & Data Settings
  backup: {
    autoBackup: {
      type: Boolean,
      default: false
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    backupTime: {
      type: String,
      default: '02:00'
    },
    retainBackupDays: {
      type: Number,
      default: 30,
      min: 7,
      max: 365
    }
  },
  
  // Compliance Settings
  compliance: {
    enableGstInvoices: {
      type: Boolean,
      default: true
    },
    includeHsnCode: {
      type: Boolean,
      default: true
    },
    includeSacCode: {
      type: Boolean,
      default: false
    },
    tdsApplicable: {
      type: Boolean,
      default: false
    },
    tdsRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 30
    },
    tcsApplicable: {
      type: Boolean,
      default: false
    },
    tcsRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    }
  },
  
  // Integration Settings
  integrations: {
    razorpay: {
      enabled: {
        type: Boolean,
        default: false
      },
      keyId: {
        type: String,
        default: ''
      },
      keySecret: {
        type: String,
        default: ''
      }
    },
    cashfree: {
      enabled: {
        type: Boolean,
        default: false
      },
      appId: {
        type: String,
        default: ''
      },
      secretKey: {
        type: String,
        default: ''
      }
    },
    smsGateway: {
      provider: {
        type: String,
        enum: ['', 'msg91', 'twilio', 'textlocal'],
        default: ''
      },
      apiKey: {
        type: String,
        default: ''
      },
      senderId: {
        type: String,
        default: ''
      }
    }
  }
}, {
  timestamps: true
});

// Indexes
settingSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);