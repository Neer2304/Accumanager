import { Schema, model, models, Document } from 'mongoose';

export type NotePriority = 'low' | 'medium' | 'high' | 'critical';
export type NoteStatus = 'draft' | 'active' | 'archived' | 'deleted';
export type ShareRole = 'viewer' | 'editor' | 'commenter';

export interface ISharedUser {
  userId: Schema.Types.ObjectId;
  role: ShareRole;
  addedAt: Date;
}

export interface IAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface IReference {
  type: 'note' | 'task' | 'event' | 'customer' | 'invoice';
  id: Schema.Types.ObjectId;
  title: string;
}

export interface IReminder {
  datetime: Date;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notified: boolean;
}

export interface IVersion {
  content: string;
  version: number;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
  changeSummary?: string;
}

export interface INotes extends Document {
  title: string;
  content: string;
  summary?: string;
  userId: Schema.Types.ObjectId;
  tags: string[];
  category: string;
  priority: NotePriority;
  status: NoteStatus;
  projectId?: Schema.Types.ObjectId;
  eventId?: Schema.Types.ObjectId;
  taskId?: Schema.Types.ObjectId;
  color: string;
  icon: string;
  coverImage?: string;
  sharedWith: ISharedUser[];
  isPublic: boolean;
  publicSlug?: string;
  attachments: IAttachment[];
  references: IReference[];
  reminders: IReminder[];
  versions: IVersion[];
  currentVersion: number;
  wordCount: number;
  readTime: number;
  lastReadAt?: Date;
  readCount: number;
  editCount: number;
  aiSummary?: string;
  aiTags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
  isEncrypted: boolean;
  encryptionKey?: string;
  passwordProtected: boolean;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

const NotesSchema = new Schema<INotes>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'] 
    },
    summary: { 
      type: String, 
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    tags: [{ 
      type: String, 
      trim: true,
      lowercase: true 
    }],
    category: { 
      type: String, 
      default: 'general', 
      trim: true,
      index: true 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'], 
      default: 'medium',
      index: true 
    },
    status: { 
      type: String, 
      enum: ['draft', 'active', 'archived', 'deleted'], 
      default: 'active',
      index: true 
    },
    projectId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Project',
      index: true 
    },
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event',
      index: true 
    },
    taskId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Task',
      index: true 
    },
    color: { 
      type: String, 
      default: '#ffffff',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'] 
    },
    icon: { 
      type: String, 
      default: '📝' 
    },
    coverImage: { 
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL format']
    },
    sharedWith: [{
      userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      role: { 
        type: String, 
        enum: ['viewer', 'editor', 'commenter'], 
        default: 'viewer' 
      },
      addedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    isPublic: { 
      type: Boolean, 
      default: false,
      index: true 
    },
    publicSlug: { 
      type: String, 
      unique: true, 
      sparse: true,
      index: true 
    },
    attachments: [{
      name: { 
        type: String, 
        required: true 
      },
      url: { 
        type: String, 
        required: true 
      },
      type: { 
        type: String, 
        required: true 
      },
      size: { 
        type: Number, 
        required: true,
        min: [0, 'Size cannot be negative']
      },
      uploadedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    references: [{
      type: { 
        type: String, 
        enum: ['note', 'task', 'event', 'customer', 'invoice'], 
        required: true 
      },
      id: { 
        type: Schema.Types.ObjectId, 
        required: true 
      },
      title: { 
        type: String, 
        required: true 
      }
    }],
    reminders: [{
      datetime: { 
        type: Date, 
        required: true 
      },
      repeat: { 
        type: String, 
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], 
        default: 'none' 
      },
      notified: { 
        type: Boolean, 
        default: false 
      }
    }],
    versions: [{
      content: { 
        type: String, 
        required: true 
      },
      version: { 
        type: Number, 
        required: true,
        min: [1, 'Version must be at least 1']
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
      userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      changeSummary: { 
        type: String 
      }
    }],
    currentVersion: { 
      type: Number, 
      default: 1,
      min: [1, 'Current version must be at least 1']
    },
    wordCount: { 
      type: Number, 
      default: 0,
      min: [0, 'Word count cannot be negative']
    },
    readTime: { 
      type: Number, 
      default: 0,
      min: [0, 'Read time cannot be negative']
    },
    lastReadAt: { 
      type: Date 
    },
    readCount: { 
      type: Number, 
      default: 0,
      min: [0, 'Read count cannot be negative']
    },
    editCount: { 
      type: Number, 
      default: 0,
      min: [0, 'Edit count cannot be negative']
    },
    aiSummary: { 
      type: String 
    },
    aiTags: [{ 
      type: String 
    }],
    sentiment: { 
      type: String, 
      enum: ['positive', 'neutral', 'negative'] 
    },
    keywords: [{ 
      type: String 
    }],
    isEncrypted: { 
      type: Boolean, 
      default: false 
    },
    encryptionKey: { 
      type: String 
    },
    passwordProtected: { 
      type: Boolean, 
      default: false 
    },
    passwordHash: { 
      type: String 
    },
    deletedAt: { 
      type: Date 
    },
    archivedAt: { 
      type: Date 
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
NotesSchema.index({ userId: 1, status: 1 });
NotesSchema.index({ userId: 1, category: 1 });
NotesSchema.index({ userId: 1, priority: 1 });
NotesSchema.index({ userId: 1, updatedAt: -1 });
NotesSchema.index({ tags: 1 });
NotesSchema.index({ 'sharedWith.userId': 1 });
NotesSchema.index({ isPublic: 1, status: 1 });
NotesSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });

// Middleware to update timestamps
NotesSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Update word count when content changes
    const words = this.content.trim().split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    this.readTime = Math.ceil(this.wordCount / 200); // 200 words per minute
  }
  next();
});

// Virtual for full content with versions
NotesSchema.virtual('fullContent').get(function() {
  return this.versions.length > 0 
    ? this.versions[this.versions.length - 1].content 
    : this.content;
});

// Static methods
NotesSchema.statics.findByUserId = function(userId: string, filters = {}) {
  return this.find({ userId, ...filters, status: { $ne: 'deleted' } });
};

NotesSchema.statics.findPublicNotes = function(filters = {}) {
  return this.find({ isPublic: true, status: 'active', ...filters });
};

// Instance methods
NotesSchema.methods.shareWithUser = function(userId: string, role: ShareRole = 'viewer') {
  const existingShare = this.sharedWith.find(share => share.userId.toString() === userId);
  if (existingShare) {
    existingShare.role = role;
    existingShare.addedAt = new Date();
  } else {
    this.sharedWith.push({
      userId: new (require('mongoose').Types.ObjectId)(userId),
      role,
      addedAt: new Date()
    });
  }
  return this.save();
};

NotesSchema.methods.removeShare = function(userId: string) {
  this.sharedWith = this.sharedWith.filter(share => share.userId.toString() !== userId);
  return this.save();
};

NotesSchema.methods.addVersion = function(content: string, userId: string, changeSummary?: string) {
  const newVersion = {
    content,
    version: this.currentVersion + 1,
    userId: new (require('mongoose').Types.ObjectId)(userId),
    changeSummary,
    createdAt: new Date()
  };
  
  this.versions.push(newVersion);
  this.currentVersion = newVersion.version;
  this.editCount += 1;
  
  return this.save();
};

NotesSchema.methods.restoreVersion = function(versionNumber: number) {
  const version = this.versions.find(v => v.version === versionNumber);
  if (version) {
    this.content = version.content;
    return this.addVersion(
      version.content, 
      version.userId.toString(), 
      `Restored to version ${versionNumber}`
    );
  }
  return Promise.reject(new Error('Version not found'));
};

const Notes = models.Notes || model<INotes>('Notes', NotesSchema);

export default Notes;