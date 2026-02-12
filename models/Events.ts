// models/Event.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  organizerId: mongoose.Types.ObjectId; // Organizer
  
  // Basic Info
  title: string;
  description?: string;
  
  // Event Type
  type: 'meeting' | 'call' | 'demo' | 'training' | 'webinar' | 'holiday' | 'lunch' | 'appointment' | 'other';
  
  // Date & Time
  startDateTime: Date;
  endDateTime: Date;
  allDay: boolean;
  
  // Location
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  meetingId?: string;
  password?: string;
  
  // Organizer
  organizerName: string;
  organizerEmail: string;
  
  // Attendees
  attendees: Array<{
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
    responseDate?: Date;
    notes?: string;
  }>;
  
  // Related CRM Records
  relatedTo: Array<{
    model: 'Lead' | 'Contact' | 'Account' | 'Deal' | 'Project';
    id: mongoose.Types.ObjectId;
    name: string;
  }>;
  
  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: Date;
  recurrenceId?: string;
  
  // Reminders
  reminders: Array<{
    type: 'email' | 'notification' | 'sms';
    timeBefore: number;
    isSent: boolean;
    sentAt?: Date;
  }>;
  
  // Status
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'rescheduled';
  cancellationReason?: string;
  
  // Attachments
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
    type: string;
  }>;
  
  // Notes & Outcome
  notes?: string;
  outcome?: string;
  feedback?: string;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  // Sharing
  visibility: 'private' | 'public' | 'team';
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

const EventSchema = new Schema<IEvent>({
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
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: true,
    index: true
  },
  
  // Basic Info
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Event Type
  type: {
    type: String,
    enum: ['meeting', 'call', 'demo', 'training', 'webinar', 'holiday', 'lunch', 'appointment', 'other'],
    required: [true, 'Event type is required'],
    index: true
  },
  
  // Date & Time
  startDateTime: {
    type: Date,
    required: [true, 'Start date/time is required'],
    index: true
  },
  endDateTime: {
    type: Date,
    required: [true, 'End date/time is required']
  },
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Location
  location: {
    type: String,
    trim: true
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  meetingId: String,
  password: String,
  
  // Organizer
  organizerName: {
    type: String,
    required: true,
    trim: true
  },
  organizerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Attendees
  attendees: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      lowercase: true,
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    },
    responseDate: Date,
    notes: String
  }],
  
  // Related CRM Records
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
  
  // Recurrence
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceRule: String,
  recurrenceEndDate: Date,
  recurrenceId: String,
  
  // Reminders
  reminders: [{
    type: { 
      type: String, 
      enum: ['email', 'notification', 'sms'],
      required: true 
    },
    timeBefore: { type: Number, required: true },
    isSent: { type: Boolean, default: false },
    sentAt: Date
  }],
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
    index: true
  },
  cancellationReason: String,
  
  // Attachments
  attachments: [{
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    size: Number,
    type: String
  }],
  
  // Notes & Outcome
  notes: String,
  outcome: String,
  feedback: String,
  
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
  visibility: {
    type: String,
    enum: ['private', 'public', 'team'],
    default: 'private'
  },
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
  collection: 'events'
});

// 🔐 CRITICAL SECURITY INDEXES
EventSchema.index({ companyId: 1, userId: 1 });
EventSchema.index({ companyId: 1, organizerId: 1 });
EventSchema.index({ companyId: 1, startDateTime: 1, status: 1 });
EventSchema.index({ companyId: 1, 'attendees.userId': 1 });

// Pre-save middleware
EventSchema.pre('save', function(this: IEvent, next) {
  // Set endDateTime for all-day events
  if (this.allDay && this.startDateTime && !this.endDateTime) {
    this.endDateTime = new Date(this.startDateTime);
    this.endDateTime.setHours(23, 59, 59, 999);
  }
  
  next();
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);