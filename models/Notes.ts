import { Schema, model, models, Document } from 'mongoose';

export type NotePriority = 'low' | 'medium' | 'high' | 'critical';
export type NoteStatus = 'draft' | 'active' | 'archived' | 'deleted';

export interface INotes extends Document {
  // Core fields
  title: string;
  content: string;
  summary?: string;
  
  // Metadata
  userId: Schema.Types.ObjectId;
  tags: string[];
  category: string;
  priority: NotePriority;
  status: NoteStatus;
  
  // Organization
  projectId?: Schema.Types.ObjectId;
  eventId?: Schema.Types.ObjectId;
  taskId?: Schema.Types.ObjectId;
  
  // Visual
  color: string;
  icon: string;
  coverImage?: string;
  
  // Collaboration
  sharedWith: Array<{
    userId: Schema.Types.ObjectId;
    role: 'viewer' | 'editor' | 'commenter';
    addedAt: Date;
  }>;
  isPublic: boolean;
  publicSlug?: string;
  
  // Rich content
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // References
  references: Array<{
    type: 'note' | 'task' | 'event' | 'customer' | 'invoice';
    id: Schema.Types.ObjectId;
    title: string;
  }>;
  
  // Reminders
  reminders: Array<{
    datetime: Date;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    notified: boolean;
  }>;
  
  // Version history
  versions: Array<{
    content: string;
    version: number;
    createdAt: Date;
    userId: Schema.Types.ObjectId;
    changeSummary?: string;
  }>;
  currentVersion: number;
  
  // Stats
  wordCount: number;
  readTime: number;
  lastReadAt?: Date;
  readCount: number;
  editCount: number;
  
  // AI Features
  aiSummary?: string;
  aiTags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
  
  // Security
  isEncrypted: boolean;
  encryptionKey?: string;
  passwordProtected: boolean;
  passwordHash?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

const NotesSchema = new Schema<INotes>({
  // Core fields
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  summary: { type: String, trim: true },
  
  // Metadata
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, trim: true }],
  category: { type: String, default: 'general', trim: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['draft', 'active', 'archived', 'deleted'], default: 'active' },
  
  // Organization
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  
  // Visual
  color: { type: String, default: '#ffffff' },
  icon: { type: String, default: '📝' },
  coverImage: { type: String },
  
  // Collaboration
  sharedWith: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor', 'commenter'], default: 'viewer' },
    addedAt: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: false },
  publicSlug: { type: String, unique: true, sparse: true },
  
  // Rich content
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // References
  references: [{
    type: { type: String, enum: ['note', 'task', 'event', 'customer', 'invoice'], required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true }
  }],
  
  // Reminders
  reminders: [{
    datetime: { type: Date, required: true },
    repeat: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
    notified: { type: Boolean, default: false }
  }],
  
  // Version history
  versions: [{
    content: { type: String, required: true },
    version: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changeSummary: { type: String }
  }],
  currentVersion: { type: Number, default: 1 },
  
  // Stats
  wordCount: { type: Number, default: 0 },
  readTime: { type: Number, default: 0 },
  lastReadAt: { type: Date },
  readCount: { type: Number, default: 0 },
  editCount: { type: Number, default: 0 },
  
  // AI Features
  aiSummary: { type: String },
  aiTags: [{ type: String }],
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  keywords: [{ type: String }],
  
  // Security
  isEncrypted: { type: Boolean, default: false },
  encryptionKey: { type: String },
  passwordProtected: { type: Boolean, default: false },
  passwordHash: { type: String },
  
  // Timestamps
  deletedAt: { type: Date },
  archivedAt: { type: Date }
}, {
  timestamps: true
});

// Indexes for faster queries
NotesSchema.index({ userId: 1, status: 1 });
NotesSchema.index({ userId: 1, category: 1 });
NotesSchema.index({ userId: 1, tags: 1 });
NotesSchema.index({ userId: 1, priority: 1 });
NotesSchema.index({ userId: 1, createdAt: -1 });
NotesSchema.index({ userId: 1, updatedAt: -1 });
NotesSchema.index({ 'sharedWith.userId': 1 });
NotesSchema.index({ isPublic: 1, publicSlug: 1 });
NotesSchema.index({ projectId: 1 });
NotesSchema.index({ eventId: 1 });
NotesSchema.index({ taskId: 1 });

// Pre-save middleware
NotesSchema.pre('save', function(next) {
  // Calculate word count
  this.wordCount = this.content.split(/\s+/).length;
  
  // Calculate read time (assuming 200 words per minute)
  this.readTime = Math.ceil(this.wordCount / 200);
  
  // Update edit count
  if (this.isModified('content')) {
    this.editCount += 1;
  }
  
  // Generate public slug if needed
  if (this.isPublic && !this.publicSlug) {
    this.publicSlug = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

// Post-save middleware to save version
NotesSchema.post('save', async function(doc) {
  if (doc.isModified('content')) {
    await models.Notes.findByIdAndUpdate(doc._id, {
      $push: {
        versions: {
          content: doc.content,
          version: doc.currentVersion,
          userId: doc.userId,
          createdAt: new Date()
        }
      },
      $inc: { currentVersion: 1 }
    });
  }
});

export default models.Notes || model<INotes>('Notes', NotesSchema);