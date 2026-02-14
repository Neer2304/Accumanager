// models/Account.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  ownerId?: mongoose.Types.ObjectId; // Assigned to
  
  // Basic Info
  name: string;
  email?: string;
  phone?: string;
  fax?: string;
  website?: string;
  
  // Type & Industry
  type: 'customer' | 'partner' | 'vendor' | 'competitor' | 'other';
  industry?: string;
  subIndustry?: string;
  
  // Size & Financials
  employeeCount?: string;
  annualRevenue?: number;
  fiscalYearEnd?: string;
  tickerSymbol?: string;
  ownership?: 'public' | 'private' | 'nonprofit' | 'government';
  
  // Address
  billingAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  // Social Media
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  
  // Parent Account
  parentAccountId?: mongoose.Types.ObjectId;
  parentAccountName?: string;
  
  // Key Contacts
  primaryContactId?: mongoose.Types.ObjectId;
  primaryContactName?: string;
  
  // Account Score & Tier
  accountScore: number; // 0-100
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  
  // Assignment
  ownerName?: string;
  
  // Activity Tracking
  lastActivityAt?: Date;
  lastDealAt?: Date;
  lastContactedAt?: Date;
  
  // Financials
  lifetimeValue?: number;
  outstandingBalance?: number;
  creditLimit?: number;
  paymentTerms?: string;
  
  // Metadata
  description?: string;
  notes?: string;
  tags: string[];
  customFields: Map<string, any>;
  
  // Status
  isActive: boolean;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  // Sharing
  sharedWith: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    permissions: {
      read: boolean;
      write: boolean;
    };
    sharedAt: Date;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const AccountSchema = new Schema<IAccount>({
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true
  },
  phone: {
    type: String,
    trim: true
  },
  fax: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  
  // Type & Industry
  type: {
    type: String,
    enum: ['customer', 'partner', 'vendor', 'competitor', 'other'],
    default: 'customer',
    index: true
  },
  industry: {
    type: String,
    trim: true,
    index: true
  },
  subIndustry: {
    type: String,
    trim: true
  },
  
  // Size & Financials
  employeeCount: {
    type: String,
    trim: true
  },
  annualRevenue: {
    type: Number,
    min: 0
  },
  fiscalYearEnd: {
    type: String,
    trim: true
  },
  tickerSymbol: {
    type: String,
    trim: true,
    uppercase: true
  },
  ownership: {
    type: String,
    enum: ['public', 'private', 'nonprofit', 'government']
  },
  
  // Address
  billingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    zipCode: { type: String, trim: true }
  },
  
  shippingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    zipCode: { type: String, trim: true }
  },
  
  // Social Media
  linkedin: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  facebook: {
    type: String,
    trim: true
  },
  instagram: {
    type: String,
    trim: true
  },
  
  // Parent Account
  parentAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    sparse: true
  },
  parentAccountName: {
    type: String,
    trim: true
  },
  
  // Key Contacts
  primaryContactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  primaryContactName: {
    type: String,
    trim: true
  },
  
  // Account Score & Tier
  accountScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tier: {
    type: String,
    enum: ['platinum', 'gold', 'silver', 'bronze'],
    default: 'bronze',
    index: true
  },
  
  // Assignment
  ownerName: {
    type: String,
    trim: true
  },
  
  // Activity Tracking
  lastActivityAt: Date,
  lastDealAt: Date,
  lastContactedAt: Date,
  
  // Financials
  lifetimeValue: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  
  // Metadata
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByName: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedByName: {
    type: String,
    trim: true
  },
  
  // Sharing
  sharedWith: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    userName: { 
      type: String, 
      required: true,
      trim: true 
    },
    permissions: {
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: false }
    },
    sharedAt: { type: Date, default: Date.now }
  }],
  
  // Soft delete
  deletedAt: Date
}, {
  timestamps: true,
  collection: 'accounts'
});

// 🔐 CRITICAL SECURITY INDEXES
AccountSchema.index({ companyId: 1, userId: 1 });
AccountSchema.index({ companyId: 1, ownerId: 1 });
AccountSchema.index({ companyId: 1, name: 1 });
AccountSchema.index({ companyId: 1, type: 1, tier: 1 });
AccountSchema.index({ companyId: 1, industry: 1 });
AccountSchema.index({ email: 1, companyId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);