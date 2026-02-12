// models/Company.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  legalName?: string;
  email: string;
  phone?: string;
  website?: string;
  taxId?: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  subscription: {
    plan: 'trial' | 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'expired' | 'trial' | 'cancelled';
    seats: number;
    usedSeats: number;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    features: string[];
  };
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId; // Reference to your User model
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  legalName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    lowercase: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true,
    sparse: true
  },
  industry: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' },
    zipCode: { type: String, trim: true }
  },
  subscription: {
    plan: { 
      type: String, 
      enum: ['trial', 'basic', 'professional', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'trial', 'cancelled'],
      default: 'trial'
    },
    seats: { type: Number, default: 5 },
    usedSeats: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { 
      type: Date, 
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
    },
    autoRenew: { type: Boolean, default: true },
    features: [{ type: String }]
  },
  settings: {
    timezone: { type: String, default: 'America/New_York' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: true
  }
}, {
  timestamps: true,
  collection: 'companies'
});

// Indexes
CompanySchema.index({ email: 1 }, { unique: true });
CompanySchema.index({ 'subscription.status': 1 });
CompanySchema.index({ isActive: 1 });

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);