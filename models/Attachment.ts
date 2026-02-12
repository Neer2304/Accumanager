// models/Attachment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Uploader
  
  // File Info
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  path: string;
  storageType: 'local' | 's3' | 'cloudinary' | 'azure';
  
  // Linked Entity
  entityType: 'Lead' | 'Contact' | 'Account' | 'Deal' | 'Project' | 'Task' | 'Note' | 'Activity';
  entityId: mongoose.Types.ObjectId;
  entityName?: string;
  
  // Metadata
  width?: number;
  height?: number;
  duration?: number; // For videos/audio
  thumbnail?: string;
  
  // Uploader
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByName: string;
  
  // Access Control
  isPublic: boolean;
  accessLevel: 'private' | 'team' | 'company' | 'public';
  sharedWith: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    permissions: {
      read: boolean;
      download: boolean;
    };
    sharedAt: Date;
  }>;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>({
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
  
  // File Info
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  url: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  path: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  storageType: {
    type: String,
    enum: ['local', 's3', 'cloudinary', 'azure'],
    default: 'local'
  },
  
  // Linked Entity
  entityType: {
    type: String,
    enum: ['Lead', 'Contact', 'Account', 'Deal', 'Project', 'Task', 'Note', 'Activity'],
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
    trim: true
  },
  
  // Metadata
  width: Number,
  height: Number,
  duration: Number,
  thumbnail: String,
  
  // Uploader
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: true
  },
  uploadedByName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Access Control
  isPublic: {
    type: Boolean,
    default: false
  },
  accessLevel: {
    type: String,
    enum: ['private', 'team', 'company', 'public'],
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
      download: { type: Boolean, default: true }
    },
    sharedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  collection: 'attachments'
});

// 🔐 CRITICAL SECURITY INDEXES
AttachmentSchema.index({ companyId: 1, userId: 1 });
AttachmentSchema.index({ companyId: 1, entityType: 1, entityId: 1 });
AttachmentSchema.index({ companyId: 1, uploadedBy: 1, createdAt: -1 });

export default mongoose.models.Attachment || mongoose.model<IAttachment>('Attachment', AttachmentSchema);