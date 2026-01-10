// models/Project.ts
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed', 'cancelled', 'delayed'],
    default: 'planning',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    default: 0,
  },
  actualCost: {
    type: Number,
    default: 0,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  clientName: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [{
    type: String, // Team member names or IDs
  }],
  tags: [{
    type: String,
  }],
  category: {
    type: String,
    enum: ['sales', 'marketing', 'development', 'internal', 'client', 'other'],
    default: 'other',
  },
  // Task tracking
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  inProgressTasks: {
    type: Number,
    default: 0,
  },
  blockedTasks: {
    type: Number,
    default: 0,
  },
    
  // Project tasks tracking
  projectTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTask',
  }],
  
  projectTaskStats: {
    total: {
      type: Number,
      default: 0,
    },
    not_started: {
      type: Number,
      default: 0,
    },
    in_progress: {
      type: Number,
      default: 0,
    },
    in_review: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    blocked: {
      type: Number,
      default: 0,
    },
    cancelled: {
      type: Number,
      default: 0,
    },
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
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);