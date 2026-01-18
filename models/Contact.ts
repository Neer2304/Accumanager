// models/Contact.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed' | 'spam';
  source: 'website' | 'api' | 'email' | 'whatsapp' | 'phone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: Schema.Types.ObjectId;
  tags: string[];
  followUpDate?: Date;
  responseTime?: number; // in hours
  
  // Metadata
  metadata: {
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    pageUrl?: string;
    formId?: string;
    browser: {
      name?: string;
      version?: string;
      os?: string;
      device?: string;
    };
    location?: {
      country?: string;
      city?: string;
      region?: string;
      timezone?: string;
    };
  };
  
  // Communication history
  communicationHistory: Array<{
    type: 'email' | 'whatsapp' | 'phone' | 'note';
    direction: 'incoming' | 'outgoing';
    content: string;
    timestamp: Date;
    userId?: Schema.Types.ObjectId;
    attachments?: string[];
    metadata?: Record<string, any>;
  }>;
  
  // Analytics
  analytics: {
    openCount: number;
    replyCount: number;
    lastOpened?: Date;
    lastReplied?: Date;
    resolutionTime?: number; // in hours
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  phone: { 
    type: String, 
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  company: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  subject: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'closed', 'spam'],
    default: 'new',
    index: true
  },
  source: { 
    type: String, 
    enum: ['website', 'api', 'email', 'whatsapp', 'phone'],
    default: 'website',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true
  }],
  followUpDate: { 
    type: Date,
    index: true
  },
  responseTime: { 
    type: Number, 
    min: 0
  },
  
  // Metadata
  metadata: {
    ipAddress: { 
      type: String,
      required: true
    },
    userAgent: { 
      type: String,
      required: true
    },
    referrer: { 
      type: String,
      trim: true
    },
    pageUrl: { 
      type: String,
      trim: true
    },
    formId: { 
      type: String,
      trim: true
    },
    browser: {
      name: String,
      version: String,
      os: String,
      device: String
    },
    location: {
      country: String,
      city: String,
      region: String,
      timezone: String
    }
  },
  
  // Communication history
  communicationHistory: [{
    type: { 
      type: String, 
      enum: ['email', 'whatsapp', 'phone', 'note'],
      required: true
    },
    direction: { 
      type: String, 
      enum: ['incoming', 'outgoing'],
      required: true
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    timestamp: { 
      type: Date, 
      default: Date.now,
      index: true
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'
    },
    attachments: [{ 
      type: String 
    }],
    metadata: { 
      type: Schema.Types.Mixed 
    }
  }],
  
  // Analytics
  analytics: {
    openCount: { 
      type: Number, 
      default: 0,
      min: 0
    },
    replyCount: { 
      type: Number, 
      default: 0,
      min: 0
    },
    lastOpened: { 
      type: Date 
    },
    lastReplied: { 
      type: Date 
    },
    resolutionTime: { 
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since creation
ContactSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
});

// Virtual for isOverdue
ContactSchema.virtual('isOverdue').get(function() {
  if (!this.followUpDate) return false;
  const now = new Date();
  return now > this.followUpDate;
});

// Indexes for better query performance
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1, priority: -1, createdAt: -1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ 'metadata.ipAddress': 1 });
ContactSchema.index({ tags: 1 });

// Pre-save middleware
ContactSchema.pre('save', function(next) {
  // Auto-calculate response time if status changed to 'replied'
  if (this.isModified('status') && this.status === 'replied') {
    const now = new Date();
    const created = this.createdAt;
    const diffMs = now.getTime() - created.getTime();
    this.responseTime = Math.floor(diffMs / (1000 * 60 * 60));
  }
  
  // Auto-calculate resolution time if status changed to 'closed'
  if (this.isModified('status') && this.status === 'closed') {
    const now = new Date();
    const created = this.createdAt;
    const diffMs = now.getTime() - created.getTime();
    this.analytics.resolutionTime = Math.floor(diffMs / (1000 * 60 * 60));
  }
  
  next();
});

// Static methods
ContactSchema.statics.findByEmail = function(email: string) {
  return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

ContactSchema.statics.findByStatus = function(status: IContact['status']) {
  return this.find({ status }).sort({ createdAt: -1 });
};

ContactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        avgResponseTime: { $avg: '$responseTime' },
        avgResolutionTime: { $avg: '$analytics.resolutionTime' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    closed: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0
  };
};

// Instance methods
ContactSchema.methods.addCommunication = function(
  type: 'email' | 'whatsapp' | 'phone' | 'note',
  direction: 'incoming' | 'outgoing',
  content: string,
  userId?: Schema.Types.ObjectId,
  attachments?: string[]
) {
  this.communicationHistory.push({
    type,
    direction,
    content,
    timestamp: new Date(),
    userId,
    attachments
  });
  
  // Update analytics
  if (direction === 'outgoing') {
    this.analytics.replyCount += 1;
    this.analytics.lastReplied = new Date();
  }
};

ContactSchema.methods.markAsRead = function(userId?: Schema.Types.ObjectId) {
  this.status = 'read';
  this.analytics.openCount += 1;
  this.analytics.lastOpened = new Date();
  
  this.addCommunication('note', 'outgoing', 'Contact marked as read', userId);
};

ContactSchema.methods.markAsReplied = function(userId?: Schema.Types.ObjectId) {
  this.status = 'replied';
  this.analytics.replyCount += 1;
  this.analytics.lastReplied = new Date();
  
  this.addCommunication('note', 'outgoing', 'Contact marked as replied', userId);
};

// Query helper for active contacts
ContactSchema.query.active = function() {
  return this.where({ status: { $in: ['new', 'read'] } });
};

ContactSchema.query.overdue = function() {
  const now = new Date();
  return this.where({ followUpDate: { $lt: now }, status: { $ne: 'closed' } });
};

export default models.Contact || model<IContact>('Contact', ContactSchema);