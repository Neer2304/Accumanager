// models/Account.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  ownerId?: mongoose.Types.ObjectId; // Assigned to
  
  // Basic Info
  name: string;
  legalName?: string;
  taxId?: string;
  registrationNumber?: string;
  
  // Type & Industry
  type: 'customer' | 'partner' | 'vendor' | 'competitor' | 'other';
  industry?: string;
  size?: string;
  
  // Contact Info
  email?: string;
  phone?: string;
  website?: string;
  
  // Addresses
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
  sameAsBilling: boolean;
  
  // Social
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  
  // Financial
  annualRevenue?: number;
  employeeCount?: number;
  foundedYear?: number;
  creditLimit?: number;
  paymentTerms?: number; // Days
  
  // Status
  status: 'active' | 'inactive' | 'lead' | 'prospect' | 'churned';
  rating: 'hot' | 'warm' | 'cold';
  
  // Relationships
  primaryContactId?: mongoose.Types.ObjectId;
  primaryContactName?: string;
  ownerName?: string;
  
  // Statistics
  stats: {
    totalDeals: number;
    wonDeals: number;
    lostDeals: number;
    totalDealValue: number;
    averageDealSize: number;
    lastDealDate?: Date;
    totalContacts: number;
    totalOpenDeals: number;
    totalOrders: number;
    totalRevenue: number;
  };
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Activity
  lastActivityAt?: Date;
  nextActivityDate?: Date;
  
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
    ref: 'User', // References your EXISTING User model
    required: [true, 'User ID is required'],
    index: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
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
  legalName: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true,
    sparse: true
  },
  registrationNumber: {
    type: String,
    trim: true,
    sparse: true
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
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  
  // Contact Info
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
  website: {
    type: String,
    trim: true
  },
  
  // Addresses
  billingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
    zipCode: { type: String, trim: true }
  },
  shippingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
    zipCode: { type: String, trim: true }
  },
  sameAsBilling: {
    type: Boolean,
    default: false
  },
  
  // Social
  linkedin: { type: String, trim: true },
  twitter: { type: String, trim: true },
  facebook: { type: String, trim: true },
  
  // Financial
  annualRevenue: {
    type: Number,
    min: 0
  },
  employeeCount: {
    type: Number,
    min: 0
  },
  foundedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  creditLimit: {
    type: Number,
    min: 0,
    default: 0
  },
  paymentTerms: {
    type: Number,
    min: 0,
    default: 30
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead', 'prospect', 'churned'],
    default: 'active',
    index: true
  },
  rating: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm'
  },
  
  // Relationships
  primaryContactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  primaryContactName: {
    type: String,
    trim: true
  },
  ownerName: {
    type: String,
    trim: true
  },
  
  // Statistics
  stats: {
    totalDeals: { type: Number, default: 0 },
    wonDeals: { type: Number, default: 0 },
    lostDeals: { type: Number, default: 0 },
    totalDealValue: { type: Number, default: 0 },
    averageDealSize: { type: Number, default: 0 },
    lastDealDate: Date,
    totalContacts: { type: Number, default: 0 },
    totalOpenDeals: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  
  // Activity
  lastActivityAt: Date,
  nextActivityDate: Date,
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
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
      required: true 
    },
    permissions: {
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: false }
    },
    sharedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  collection: 'accounts'
});

// 🔐 CRITICAL SECURITY INDEXES
AccountSchema.index({ companyId: 1, userId: 1 });
AccountSchema.index({ companyId: 1, ownerId: 1 });
AccountSchema.index({ companyId: 1, status: 1, type: 1 });
AccountSchema.index({ companyId: 1, name: 1 }, { unique: true });

// Pre-save middleware
AccountSchema.pre('save', function(this: IAccount, next) {
  // Copy billing to shipping if sameAsBilling is true
  if (this.sameAsBilling && this.billingAddress) {
    this.shippingAddress = { ...this.billingAddress };
  }
  next();
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);