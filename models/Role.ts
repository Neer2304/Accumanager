// models/Role.ts
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  name: { type: String, required: true },
  description: String,
  
  permissions: [{
    module: {
      type: String,
      enum: [
        'dashboard', 'leads', 'contacts', 'accounts', 'deals',
        'products', 'orders', 'projects', 'tasks', 'activities',
        'reports', 'settings', 'users', 'roles', 'campaigns',
        'events', 'notes', 'attachments'
      ],
      required: true
    },
    access: {
      read: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      import: { type: Boolean, default: false }
    },
    fields: [String] // Field-level permissions
  }],
  
  isSystemRole: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

RoleSchema.index({ companyId: 1, name: 1 }, { unique: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);