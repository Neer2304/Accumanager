// models/Lead.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  assignedTo?: mongoose.Types.ObjectId;
  assignedToName?: string;
  assignedAt?: Date;
  companyName?: string;
  position?: string;
  budget?: number;
  currency: string;
  interestLevel: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  nextFollowUp?: Date;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  followUpCount: number;
  notes?: string;
  convertedToContact?: mongoose.Types.ObjectId;
  convertedToDeal?: mongoose.Types.ObjectId;
  convertedAt?: Date;
}

const LeadSchema = new Schema<ILead>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  fullName: { type: String, trim: true },
  email: { 
    type: String, 
    trim: true, 
    lowercase: true,
    sparse: true,
    index: true 
  },
  phone: { 
    type: String, 
    trim: true,
    sparse: true 
  },
  position: { type: String, trim: true },
  source: { type: String, required: true, index: true },
  status: { 
    type: String, 
    default: 'new',
    enum: ['new', 'contacted', 'qualified', 'disqualified', 'converted', 'lost'],
    index: true 
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true 
  },
  assignedToName: String,
  assignedAt: Date,
  companyName: String,
  budget: { type: Number, min: 0 },
  currency: { type: String, default: 'USD' },
  interestLevel: { 
    type: String, 
    default: 'medium',
    enum: ['low', 'medium', 'high', 'very_high']
  },
  lastContactedAt: Date,
  nextFollowUp: Date,
  tags: [{ type: String }],
  notes: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdByName: { type: String, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedByName: String,
  followUpCount: { type: Number, default: 0 },
  convertedToContact: { type: Schema.Types.ObjectId, ref: 'Contact' },
  convertedToDeal: { type: Schema.Types.ObjectId, ref: 'Deal' },
  convertedAt: Date
}, {
  timestamps: true
});

// Compound indexes for common queries
LeadSchema.index({ companyId: 1, status: 1 });
LeadSchema.index({ companyId: 1, assignedTo: 1 });
LeadSchema.index({ companyId: 1, createdAt: -1 });
LeadSchema.index({ companyId: 1, email: 1 }, { unique: true, sparse: true });

// Pre-save middleware to set fullName
LeadSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  next();
});

// Pre-update middleware to update fullName
LeadSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate() as any;
  if (update.firstName || update.lastName) {
    const firstName = update.firstName || '';
    const lastName = update.lastName || '';
    update.fullName = `${firstName} ${lastName}`.trim();
  }
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);