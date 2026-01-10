// models/ProjectTask.ts
import mongoose from 'mongoose';

const ProjectTaskSchema = new mongoose.Schema({
  // Basic task info
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'in_review', 'completed', 'blocked', 'cancelled'],
    default: 'not_started',
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  
  // Time tracking
  startDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  
  // Effort tracking
  estimatedHours: {
    type: Number,
    default: 0,
    min: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
    min: 0,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  
  // Relationships
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  
  // Assignment
  assignedToId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedToName: {
    type: String,
  },
  assignedToEmail: {
    type: String,
  },
  
  // Creator info
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
  
  // Ownership
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // Task details
  taskType: {
    type: String,
    enum: ['feature', 'bug', 'improvement', 'maintenance', 'documentation', 'other'],
    default: 'feature',
  },
  
  // Task metadata
  tags: [{
    type: String,
    trim: true,
  }],
  
  // Dependencies
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTask',
  }],
  
  // Checkpoints/Milestones
  checkpoints: [{
    title: String,
    description: String,
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: Date,
    dueDate: Date,
  }],
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedById: mongoose.Schema.Types.ObjectId,
    uploadedByName: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Simple comments (for project context)
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    userAvatar: String,
    text: String,
    type: {
      type: String,
      enum: ['comment', 'update', 'status_change', 'attachment'],
      default: 'comment',
    },
    attachments: [{
      filename: String,
      url: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Activity log
  activityLog: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    action: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Task settings
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
ProjectTaskSchema.index({ projectId: 1, status: 1 });
ProjectTaskSchema.index({ projectId: 1, priority: 1 });
ProjectTaskSchema.index({ projectId: 1, assignedToId: 1 });
ProjectTaskSchema.index({ projectId: 1, dueDate: 1 });
ProjectTaskSchema.index({ userId: 1, status: 1 });
ProjectTaskSchema.index({ userId: 1, projectId: 1, status: 1 });

export default mongoose.models.ProjectTask || mongoose.model('ProjectTask', ProjectTaskSchema);