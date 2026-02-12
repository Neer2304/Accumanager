// models/Activity.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  assignedTo?: mongoose.Types.ObjectId; // Assignee
  
  // Activity Type
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'reminder';
  subtype?: string;
  
  // Subject & Description
  subject: string;
  description?: string;
  
  // Linked Records
  relatedTo: Array<{
    model: 'Lead' | 'Contact' | 'Account' | 'Deal' | 'Project' | 'Task';
    id: mongoose.Types.ObjectId;
    name: string;
  }>;
  
  // Assignment
  assignedToName?: string;
  assignedBy?: mongoose.Types.ObjectId;
  assignedAt?: Date;
  
  // Dates
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  duration?: number; // minutes
  
  // Status (for tasks)
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  
  // Call Details
  callDetails?: {
    callType: 'inbound' | 'outbound' | 'internal';
    callDuration: number;
    callRecording?: string;
    callOutcome?: string;
    callNotes?: string;
    followUpRequired: boolean;
    followUpDate?: Date;
  };
  
  // Email Details
  emailDetails?: {
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments: Array<{
      filename: string;
      url: string;
      size: number;
      type: string;
    }>;
    isRead: boolean;
    isReplied: boolean;
    isForwarded: boolean;
    threadId?: string;
    inReplyTo?: string;
  };
  
  // Meeting Details
  meetingDetails?: {
    location?: string;
    meetingLink?: string;
    meetingId?: string;
    password?: string;
    attendees: Array<{
      email: string;
      name: string;
      status: 'pending' | 'accepted' | 'declined' | 'tentative';
      responseDate?: Date;
    }>;
    notes?: string;
    agenda?: string;
    outcome?: string;
  };
  
  // Task Details
  taskDetails?: {
    estimatedHours: number;
    actualHours: number;
    billable: boolean;
    hourlyRate?: number;
    totalCost?: number;
    dependsOn?: mongoose.Types.ObjectId[];
    blockedBy?: mongoose.Types.ObjectId[];
  };
  
  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: Date;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endDate?: Date;
    count?: number;
  };
  
  // Reminders
  reminders: Array<{
    type: 'email' | 'notification' | 'sms' | 'whatsapp';
    timeBefore: number; // minutes
    isSent: boolean;
    sentAt?: Date;
  }>;
  
  // Metadata
  tags: string[];
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: Date;
  }>;
  
  // Location
  location?: {
    type: 'physical' | 'virtual';
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Outcome
  outcome?: string;
  feedback?: string;
  rating?: number;
  
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
}

const ActivitySchema = new Schema<IActivity>({
  // 🔐 SECURITY - References to your EXISTING User model
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
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    index: true,
    sparse: true
  },
  
  // Activity Type
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'task', 'note', 'reminder'],
    required: [true, 'Activity type is required'],
    index: true
  },
  subtype: {
    type: String,
    trim: true
  },
  
  // Subject & Description
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Linked Records
  relatedTo: [{
    model: { 
      type: String, 
      enum: ['Lead', 'Contact', 'Account', 'Deal', 'Project', 'Task'],
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
    ref: 'User'
  },
  assignedAt: Date,
  
  // Dates
  startDate: {
    type: Date,
    index: true
  },
  endDate: Date,
  dueDate: {
    type: Date,
    index: true
  },
  completedAt: Date,
  duration: Number,
  
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
    default: 'medium'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Call Details
  callDetails: {
    callType: { 
      type: String, 
      enum: ['inbound', 'outbound', 'internal'] 
    },
    callDuration: Number,
    callRecording: String,
    callOutcome: String,
    callNotes: String,
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date
  },
  
  // Email Details
  emailDetails: {
    from: { 
      type: String, 
      lowercase: true,
      trim: true 
    },
    to: [{ 
      type: String, 
      lowercase: true,
      trim: true 
    }],
    cc: [{ 
      type: String, 
      lowercase: true,
      trim: true 
    }],
    bcc: [{ 
      type: String, 
      lowercase: true,
      trim: true 
    }],
    subject: String,
    body: String,
    attachments: [{
      filename: String,
      url: String,
      size: Number,
      type: String
    }],
    isRead: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
    isForwarded: { type: Boolean, default: false },
    threadId: String,
    inReplyTo: String
  },
  
  // Meeting Details
  meetingDetails: {
    location: String,
    meetingLink: String,
    meetingId: String,
    password: String,
    attendees: [{
      email: { 
        type: String, 
        lowercase: true,
        trim: true 
      },
      name: String,
      status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined', 'tentative'],
        default: 'pending'
      },
      responseDate: Date
    }],
    notes: String,
    agenda: String,
    outcome: String
  },
  
  // Task Details
  taskDetails: {
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    billable: { type: Boolean, default: false },
    hourlyRate: Number,
    totalCost: Number,
    dependsOn: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    blockedBy: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
  },
  
  // Recurrence
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceRule: String,
  recurrenceEndDate: Date,
  recurrencePattern: {
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'yearly'] 
    },
    interval: { type: Number, default: 1 },
    daysOfWeek: [Number],
    dayOfMonth: Number,
    monthOfYear: Number,
    endDate: Date,
    count: Number
  },
  
  // Reminders
  reminders: [{
    type: { 
      type: String, 
      enum: ['email', 'notification', 'sms', 'whatsapp'],
      required: true 
    },
    timeBefore: { type: Number, required: true },
    isSent: { type: Boolean, default: false },
    sentAt: Date
  }],
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    size: Number,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Location
  location: {
    type: { 
      type: String, 
      enum: ['physical', 'virtual'] 
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Outcome
  outcome: String,
  feedback: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
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
  }]
}, {
  timestamps: true,
  collection: 'activities'
});

// 🔐 CRITICAL SECURITY INDEXES
ActivitySchema.index({ companyId: 1, userId: 1 });
ActivitySchema.index({ companyId: 1, assignedTo: 1 });
ActivitySchema.index({ companyId: 1, type: 1, status: 1 });
ActivitySchema.index({ companyId: 1, dueDate: 1 });
ActivitySchema.index({ companyId: 1, 'relatedTo.id': 1 });

// Pre-save middleware
ActivitySchema.pre('save', function(this: IActivity, next) {
  // Set completedAt when status becomes completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Calculate duration for completed tasks
  if (this.status === 'completed' && this.startDate && !this.duration) {
    this.duration = Math.round((new Date().getTime() - this.startDate.getTime()) / 60000);
  }
  
  next();
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);