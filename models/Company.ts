import mongoose from 'mongoose';

export interface ICompany extends mongoose.Document {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  website?: string;
  industry?: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  logo?: string;
  
  // Owner/Admin
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  
  // Plan & Limits
  plan: 'free' | 'pro' | 'enterprise';
  maxMembers: number;
  
  // Stats
  memberCount: number;
  activeProjects: number;
  
  // Status
  isActive: boolean;
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new mongoose.Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    zipCode: { type: String, trim: true },
  },
  website: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10',
  },
  logo: {
    type: String,
  },
  
  // Owner/Admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
  
  // Plan & Limits
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  maxMembers: {
    type: Number,
    default: 10,
  },
  
  // Stats
  memberCount: {
    type: Number,
    default: 1,
  },
  activeProjects: {
    type: Number,
    default: 0,
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
CompanySchema.index({ createdBy: 1, isActive: 1 });
CompanySchema.index({ email: 1 });
CompanySchema.index({ deletedAt: 1 });

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);