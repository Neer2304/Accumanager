// models/Task.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Creator
  assignedTo?: mongoose.Types.ObjectId; // Assignee
  
  // Basic Info
  title: string;
  description?: string;
  
  // Type
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'general' | 'custom';
  
  // Related Entities
  relatedTo: Array<{
    model: 'Lead' | 'Contact' | 'Account' | 'Deal' | 'Project';
    id: mongoose.Types.ObjectId;
    name: string;
  }>;
  
  // Assignment
  assignedToName?: string;
  assignedBy: mongoose.Types.ObjectId;
  assignedByName: string;
  assignedAt: Date;
  
  // Dates
  dueDate: Date;
  startDate?: Date;
  completedAt?: Date;
  
  // Status
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number; // 0-100
  
  // Time tracking
  estimatedHours: number;
  actualHours: number;
  isBillable: boolean;
  hourlyRate?: number;
  totalCost?: number;
  
  // Reminders
  reminders: Array<{
    type: 'email' | 'notification' | 'sms';
    timeBefore: number; // minutes before due
    isSent: boolean;
    sentAt?: Date;
  }>;
  
  // Recurrence
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endDate?: Date;
    count?: number;
  };
  
  // Dependencies
  dependsOn: mongoose.Types.ObjectId[]; // Tasks that must be completed first
  blockedBy: mongoose.Types.ObjectId[]; // Tasks blocking this
  
  // Subtasks
  subtasks: Array<{
    title: string;
    isCompleted: boolean;
    completedAt?: Date;
    assignedTo?: mongoose.Types.ObjectId;
    assignedToName?: string;
  }>;
  
  // Attachments
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: Date;
  }>;
  
  // Comments
  comments: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    content: string;
    attachments?: Array<{
      filename: string;
      url: string;
      size: number;
    }>;
    createdAt: Date;
  }>;
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Activity
  lastActivityAt?: Date;
  
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
  deletedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  
  // Basic Info
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Type
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'follow_up', 'general', 'custom'],
    default: 'general',
    index: true
  },
  
  // Related Entities
  relatedTo: [{
    model: { 
      type: String, 
      enum: ['Lead', 'Contact', 'Account', 'Deal', 'Project'],
      required: true 
    },
    id: { 
      type: Schema.Types.ObjectId, 
      refPath: 'relatedTo.model',
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true 
    }
  }],
  
  // Assignment
  assignedToName: {
    type: String,
    trim: true
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedByName: {
    type: String,
    required: true,
    trim: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  
  // Dates
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    index: true
  },
  startDate: Date,
  completedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'deferred', 'cancelled'],
    default: 'not_started',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Time tracking
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  isBillable: {
    type: Boolean,
    default: false
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  totalCost: {
    type: Number,
    min: 0
  },
  
  // Reminders
  reminders: [{
    type: { 
      type: String, 
      enum: ['email', 'notification', 'sms'],
      required: true 
    },
    timeBefore: { 
      type: Number, 
      required: true,
      min: 0 
    },
    isSent: { type: Boolean, default: false },
    sentAt: Date
  }],
  
  // Recurrence
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'yearly'] 
    },
    interval: { type: Number, default: 1, min: 1 },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31
    },
    monthOfYear: {
      type: Number,
      min: 1,
      max: 12
    },
    endDate: Date,
    count: Number
  },
  
  // Dependencies
  dependsOn: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  blockedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  
  // Subtasks
  subtasks: [{
    title: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedToName: String
  }],
  
  // Attachments
  attachments: [{
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    size: Number,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Comments
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    attachments: [{
      filename: String,
      url: String,
      size: Number
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  
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
  lastActivityAt: Date,
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
      required: true,
      trim: true 
    },
    permissions: {
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: false }
    },
    sharedAt: { type: Date, default: Date.now }
  }],
  
  // Soft delete
  deletedAt: Date
}, {
  timestamps: true,
  collection: 'tasks'
});

// 🔐 CRITICAL SECURITY INDEXES
TaskSchema.index({ companyId: 1, userId: 1 });
TaskSchema.index({ companyId: 1, assignedTo: 1, status: 1 });
TaskSchema.index({ companyId: 1, dueDate: 1, status: 1 });
TaskSchema.index({ companyId: 1, priority: 1, status: 1 });
TaskSchema.index({ companyId: 1, 'relatedTo.id': 1 });

// Pre-save middleware
TaskSchema.pre('save', function(this: ITask, next) {
  // Calculate total cost
  if (this.isBillable && this.hourlyRate) {
    this.totalCost = (this.actualHours || this.estimatedHours) * this.hourlyRate;
  }
  
  // Update status based on progress
  if (this.progress === 100) {
    this.status = 'completed';
    this.completedAt = this.completedAt || new Date();
  } else if (this.progress > 0 && this.status === 'not_started') {
    this.status = 'in_progress';
  }
  
  // Update last activity
  this.lastActivityAt = new Date();
  
  next();
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);