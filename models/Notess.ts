// models/Note.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  
  // Content
  title?: string;
  content: string;
  
  // Linked Entity
  entityType: 'Lead' | 'Contact' | 'Account' | 'Deal' | 'Project' | 'Task' | 'Activity';
  entityId: mongoose.Types.ObjectId;
  entityName: string;
  
  // Type
  type: 'general' | 'call' | 'meeting' | 'email' | 'task' | 'follow_up' | 'internal';
  
  // Metadata
  isPinned: boolean;
  isPrivate: boolean;
  color?: string;
  
  // Attachments
  attachments: Array<{
    filename: string;
    url: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // Mentions
  mentions: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    email: string;
    readAt?: Date;
  }>;
  
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

const NoteSchema = new Schema<INote>({
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
  
  // Content
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true
  },
  
  // Linked Entity
  entityType: {
    type: String,
    enum: ['Lead', 'Contact', 'Account', 'Deal', 'Project', 'Task', 'Activity'],
    required: [true, 'Entity type is required'],
    index: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    refPath: 'entityType',
    required: [true, 'Entity ID is required'],
    index: true
  },
  entityName: {
    type: String,
    required: [true, 'Entity name is required'],
    trim: true
  },
  
  // Type
  type: {
    type: String,
    enum: ['general', 'call', 'meeting', 'email', 'task', 'follow_up', 'internal'],
    default: 'general'
  },
  
  // Metadata
  isPinned: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'yellow'
  },
  
  // Attachments
  attachments: [{
    filename: { 
      type: String, 
      required: true,
      trim: true 
    },
    url: { 
      type: String, 
      required: true 
    },
    fileType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Mentions
  mentions: [{
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
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true 
    },
    readAt: Date
  }],
  
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
  collection: 'notes'
});

// 🔐 CRITICAL SECURITY INDEXES
NoteSchema.index({ companyId: 1, userId: 1 });
NoteSchema.index({ companyId: 1, entityType: 1, entityId: 1 });
NoteSchema.index({ companyId: 1, isPinned: -1, createdAt: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);