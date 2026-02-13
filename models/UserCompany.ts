import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: Date;
  invitedBy?: mongoose.Types.ObjectId;
  invitedByName?: string;
  permissions: string[];
  isDefault: boolean;
  lastActiveAt?: Date;
  department?: string;
  jobTitle?: string;
}

const UserCompanySchema = new Schema<IUserCompany>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  role: { type: String, enum: ['admin', 'manager', 'member', 'viewer'], default: 'member', index: true },
  status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'active', index: true },
  joinedAt: { type: Date, default: Date.now },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  invitedByName: { type: String },
  permissions: [{ type: String }],
  isDefault: { type: Boolean, default: false },
  lastActiveAt: { type: Date },
  department: { type: String, trim: true },
  jobTitle: { type: String, trim: true }
}, {
  timestamps: true,
  collection: 'user_companies'
});

// 🔐 CRITICAL: Unique index for user-company relationship
UserCompanySchema.index({ userId: 1, companyId: 1 }, { unique: true });
UserCompanySchema.index({ companyId: 1, role: 1, status: 1 });

export default mongoose.models.UserCompany || mongoose.model<IUserCompany>('UserCompany', UserCompanySchema);