// models/Contact.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  ownerId?: mongoose.Types.ObjectId; // Assigned to
  
  // Links
  accountId?: mongoose.Types.ObjectId;
  accountName?: string;
  leadId?: mongoose.Types.ObjectId;
  
  // Personal Info
  firstName: string;
  lastName: string;
  fullName: string;
  title?: string;
  department?: string;
  
  // Contact Methods
  emails: Array<{
    email: string;
    type: 'work' | 'personal' | 'other';
    isPrimary: boolean;
    isVerified: boolean;
  }>;
  
  phones: Array<{
    number: string;
    type: 'mobile' | 'work' | 'home' | 'other';
    isPrimary: boolean;
    isWhatsApp: boolean;
  }>;
  
  // Address
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  // Social
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  
  // Preferences
  preferredContactMethod: 'email' | 'phone' | 'sms' | 'whatsapp';
  timezone?: string;
  language: string;
  
  // Status
  isActive: boolean;
  isDoNotContact: boolean;
  isEmailBounced: boolean;
  unsubscribeToken?: string;
  
  // Assignment
  ownerName?: string;
  
  // Lifecycle
  lifecycleStage: 'lead' | 'prospect' | 'customer' | 'churned' | 'inactive';
  source?: string;
  
  // Relationships
  reportsTo?: mongoose.Types.ObjectId;
  reportsToName?: string;
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Activity
  lastContactedAt?: Date;
  lastActivityAt?: Date;
  
  // Birthday & Anniversary
  birthday?: Date;
  anniversary?: Date;
  
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

const ContactSchema = new Schema<IContact>({
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
  
  // Links
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    sparse: true
  },
  accountName: {
    type: String,
    trim: true
  },
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    sparse: true
  },
  
  // Personal Info
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
    trim: true,
    index: true
  },
  title: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  
  // Contact Methods
  emails: [{
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true
    },
    type: { 
      type: String, 
      enum: ['work', 'personal', 'other'],
      default: 'work'
    },
    isPrimary: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
  }],
  
  phones: [{
    number: { 
      type: String, 
      required: true,
      trim: true
    },
    type: { 
      type: String, 
      enum: ['mobile', 'work', 'home', 'other'],
      default: 'mobile'
    },
    isPrimary: { type: Boolean, default: false },
    isWhatsApp: { type: Boolean, default: false }
  }],
  
  // Address
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
    zipCode: { type: String, trim: true }
  },
  
  // Social
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
  website: { 
    type: String, 
    trim: true 
  },
  
  // Preferences
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'sms', 'whatsapp'],
    default: 'email'
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  language: { 
    type: String, 
    default: 'en' 
  },
  
  // Status
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  isDoNotContact: { 
    type: Boolean, 
    default: false 
  },
  isEmailBounced: { 
    type: Boolean, 
    default: false 
  },
  unsubscribeToken: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  
  // Assignment
  ownerName: {
    type: String,
    trim: true
  },
  
  // Lifecycle
  lifecycleStage: {
    type: String,
    enum: ['lead', 'prospect', 'customer', 'churned', 'inactive'],
    default: 'lead',
    index: true
  },
  source: {
    type: String,
    trim: true
  },
  
  // Relationships
  reportsTo: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  reportsToName: {
    type: String,
    trim: true
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
  lastContactedAt: Date,
  lastActivityAt: Date,
  
  // Birthday & Anniversary
  birthday: Date,
  anniversary: Date,
  
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
  collection: 'contacts'
});

// 🔐 CRITICAL SECURITY INDEXES
ContactSchema.index({ companyId: 1, userId: 1 });
ContactSchema.index({ companyId: 1, ownerId: 1 });
ContactSchema.index({ companyId: 1, accountId: 1 });
ContactSchema.index({ companyId: 1, 'emails.email': 1 }, { unique: true, sparse: true });
ContactSchema.index({ companyId: 1, lifecycleStage: 1 });

// Pre-save middleware
ContactSchema.pre('save', function(this: IContact, next) {
  // Set full name
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  
  // Ensure at least one primary email
  if (this.emails && this.emails.length > 0) {
    const hasPrimary = this.emails.some(e => e.isPrimary);
    if (!hasPrimary) {
      this.emails[0].isPrimary = true;
    }
  }
  
  // Ensure at least one primary phone
  if (this.phones && this.phones.length > 0) {
    const hasPrimary = this.phones.some(p => p.isPrimary);
    if (!hasPrimary) {
      this.phones[0].isPrimary = true;
    }
  }
  
  next();
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);