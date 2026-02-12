// models/Lead.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  assignedTo?: mongoose.Types.ObjectId; // Assignee
  
  // Basic Info
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  alternativePhone?: string;
  
  // Lead Specific
  source: 'website' | 'referral' | 'cold_call' | 'social_media' | 'email_campaign' | 'event' | 'partner' | 'other';
  sourceDetails?: string;
  status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
  statusReason?: string;
  score: number;
  
  // Assignment
  assignedToName?: string;
  assignedAt?: Date;
  
  // Company Info
  companyName?: string;
  companySize?: string;
  industry?: string;
  position?: string;
  
  // Budget & Timeline
  budget?: number;
  currency: string;
  timeline?: string;
  interestLevel: 'low' | 'medium' | 'high' | 'very_high';
  
  // Conversion Tracking
  convertedToContact?: mongoose.Types.ObjectId;
  convertedToDeal?: mongoose.Types.ObjectId;
  convertedAt?: Date;
  
  // Activity Tracking
  lastContactedAt?: Date;
  nextFollowUp?: Date;
  followUpCount: number;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Source Details
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  // Sharing
  sharedWith: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    permissions: {
      read: boolean;
      write: boolean;
    };
    sharedAt: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
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
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    index: true,
    sparse: true
  },
  
  // Basic Info
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    index: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    sparse: true
  },
  alternativePhone: {
    type: String,
    trim: true
  },
  
  // Lead Specific
  source: {
    type: String,
    enum: ['website', 'referral', 'cold_call', 'social_media', 'email_campaign', 'event', 'partner', 'other'],
    required: [true, 'Lead source is required'],
    index: true
  },
  sourceDetails: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'disqualified', 'converted', 'lost'],
    default: 'new',
    index: true
  },
  statusReason: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Assignment
  assignedToName: {
    type: String,
    trim: true
  },
  assignedAt: {
    type: Date
  },
  
  // Company Info
  companyName: {
    type: String,
    trim: true,
    index: true
  },
  companySize: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  
  // Budget & Timeline
  budget: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  timeline: {
    type: String,
    trim: true
  },
  interestLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium'
  },
  
  // Conversion Tracking
  convertedToContact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  convertedToDeal: {
    type: Schema.Types.ObjectId,
    ref: 'Deal',
    sparse: true
  },
  convertedAt: {
    type: Date
  },
  
  // Activity Tracking
  lastContactedAt: {
    type: Date
  },
  nextFollowUp: {
    type: Date,
    index: true
  },
  followUpCount: {
    type: Number,
    default: 0
  },
  
  // Address
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
    zipCode: { type: String, trim: true }
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
  
  // Source Details
  utmSource: { type: String, trim: true },
  utmMedium: { type: String, trim: true },
  utmCampaign: { type: String, trim: true },
  utmTerm: { type: String, trim: true },
  utmContent: { type: String, trim: true },
  referrer: { type: String, trim: true },
  landingPage: { type: String, trim: true },
  
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
  collection: 'leads'
});

// 🔐 CRITICAL SECURITY INDEXES
LeadSchema.index({ companyId: 1, userId: 1 });
LeadSchema.index({ companyId: 1, assignedTo: 1 });
LeadSchema.index({ companyId: 1, status: 1, createdAt: -1 });
LeadSchema.index({ companyId: 1, email: 1 }, { unique: true, sparse: true });
LeadSchema.index({ companyId: 1, nextFollowUp: 1 });

// Virtual for full name
LeadSchema.virtual('fullName').get(function(this: ILead) {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Pre-save middleware
LeadSchema.pre('save', function(this: ILead, next) {
  // Set full name
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  
  // Set assignedAt when assignedTo changes
  if (this.isModified('assignedTo') && this.assignedTo) {
    this.assignedAt = new Date();
  }
  
  next();
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);