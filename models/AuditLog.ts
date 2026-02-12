// models/AuditLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  // 🔐 SECURITY
  companyId: mongoose.Types.ObjectId;
  
  // Who
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  
  // What
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'login' | 'logout' | 'share' | 'download' | 'view';
  entityType: string;
  entityId?: mongoose.Types.ObjectId;
  entityName?: string;
  
  // Changes
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  
  // Metadata
  timestamp: Date;
  status: 'success' | 'failure';
  errorMessage?: string;
  
  // Additional Context
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>({
  // 🔐 SECURITY
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Who
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: true,
    index: true
  },
  userName: { 
    type: String, 
    required: true,
    trim: true 
  },
  userEmail: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true 
  },
  userRole: { 
    type: String, 
    required: true,
    trim: true 
  },
  ipAddress: { 
    type: String, 
    required: true,
    trim: true 
  },
  userAgent: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // What
  action: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'export', 'import', 'login', 'logout', 'share', 'download', 'view'],
    required: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    index: true,
    sparse: true
  },
  entityName: {
    type: String,
    trim: true
  },
  
  // Changes
  changes: [{
    field: { type: String, required: true, trim: true },
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed
  }],
  
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    required: true
  },
  errorMessage: String,
  
  // Additional Context
  sessionId: String,
  requestId: String,
  metadata: Schema.Types.Mixed
}, {
  timestamps: true,
  collection: 'audit_logs',
  capped: { size: 1024 * 1024 * 100 } // 100MB capped collection
});

// 🔐 CRITICAL SECURITY INDEXES
AuditLogSchema.index({ companyId: 1, userId: 1, timestamp: -1 });
AuditLogSchema.index({ companyId: 1, entityType: 1, entityId: 1 });
AuditLogSchema.index({ companyId: 1, action: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);