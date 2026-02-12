// models/Notification.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  // 🔐 SECURITY
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Recipient
  
  // Sender
  fromUserId?: mongoose.Types.ObjectId;
  fromUserName?: string;
  
  // Content
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'mention' | 'reminder' | 'assignment' | 'update' | 'alert';
  
  // Links
  link?: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  isArchived: boolean;
  isDeleted: boolean;
  
  // Actions
  actions?: Array<{
    label: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  }>;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Expiry
  expiresAt?: Date;
  
  // Metadata
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  // 🔐 SECURITY
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
  
  // Sender
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  fromUserName: {
    type: String,
    trim: true
  },
  
  // Content
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'task', 'mention', 'reminder', 'assignment', 'update', 'alert'],
    default: 'info',
    index: true
  },
  
  // Links
  link: {
    type: String,
    trim: true
  },
  entityType: {
    type: String,
    trim: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    sparse: true
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  isArchived: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Actions
  actions: [{
    label: { 
      type: String, 
      required: true,
      trim: true 
    },
    url: { 
      type: String, 
      required: true,
      trim: true 
    },
    method: { 
      type: String, 
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET' 
    }
  }],
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Expiry
  expiresAt: {
    type: Date,
    index: true
  },
  
  // Metadata
  metadata: Schema.Types.Mixed
}, {
  timestamps: true,
  collection: 'notifications'
});

// 🔐 CRITICAL SECURITY INDEXES
NotificationSchema.index({ companyId: 1, userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);