// models/Lead.ts - Ensure this exists
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
  budget?: number;
  currency: string;
  interestLevel: string;
  createdAt: Date;
  lastContactedAt?: Date;
  nextFollowUp?: Date;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  followUpCount: number;
}

const LeadSchema = new Schema<ILead>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, sparse: true },
  phone: { type: String, sparse: true },
  source: { type: String, required: true },
  status: { type: String, default: 'new' },
  score: { type: Number, default: 0 },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedToName: String,
  assignedAt: Date,
  companyName: String,
  budget: Number,
  currency: { type: String, default: 'USD' },
  interestLevel: { type: String, default: 'medium' },
  lastContactedAt: Date,
  nextFollowUp: Date,
  tags: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdByName: { type: String, required: true },
  followUpCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Pre-save middleware to set fullName
LeadSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  next();
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);