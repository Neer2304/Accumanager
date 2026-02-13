import mongoose from 'mongoose';

export interface ICompanyMember extends mongoose.Document {
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  
  // Member info
  memberId: mongoose.Types.ObjectId;
  memberEmail: string;
  memberName: string;
  
  // Role
  role: 'admin' | 'manager' | 'member' | 'viewer';
  
  // Who added
  addedBy: mongoose.Types.ObjectId;
  addedByName: string;
  
  // Status
  status: 'pending' | 'active' | 'inactive' | 'removed';
  
  // Permissions
  permissions: {
    canManageProjects: boolean;
    canManageTasks: boolean;
    canManageMembers: boolean;
    canDeleteCompany: boolean;
  };
  
  // Timestamps
  invitedAt: Date;
  joinedAt?: Date;
  lastActiveAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const CompanyMemberSchema = new mongoose.Schema<ICompanyMember>({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  
  // Member info
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  memberEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  memberName: {
    type: String,
    required: true,
  },
  
  // Role
  role: {
    type: String,
    enum: ['admin', 'manager', 'member', 'viewer'],
    default: 'member',
  },
  
  // Who added
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedByName: {
    type: String,
    required: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'removed'],
    default: 'active',
  },
  
  // Permissions
  permissions: {
    canManageProjects: { type: Boolean, default: false },
    canManageTasks: { type: Boolean, default: true },
    canManageMembers: { type: Boolean, default: false },
    canDeleteCompany: { type: Boolean, default: false },
  },
  
  // Timestamps
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  joinedAt: Date,
  lastActiveAt: Date,
}, {
  timestamps: true,
});

// Ensure one user per company
CompanyMemberSchema.index({ companyId: 1, memberId: 1 }, { unique: true });

// Indexes for fast queries
CompanyMemberSchema.index({ memberId: 1, status: 1 });
CompanyMemberSchema.index({ companyId: 1, role: 1 });
CompanyMemberSchema.index({ memberEmail: 1 });

export default mongoose.models.CompanyMember || mongoose.model<ICompanyMember>('CompanyMember', CompanyMemberSchema);