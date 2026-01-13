// models/Task.ts - Unified Schema
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked' | 'assigned' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  
  // Assignment info
  assignedTo: mongoose.Types.ObjectId;
  assignedToName: string;
  assignedBy: mongoose.Types.ObjectId;
  assignedByName: string;
  
  // Project info
  projectId?: mongoose.Types.ObjectId;
  projectName: string;
  
  // Creator info
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  userId: mongoose.Types.ObjectId;
  
  // Hours tracking
  estimatedHours: number;
  actualHours: number;
  progress: number;
  
  // Additional fields
  category?: string;
  tags: string[];
  checklist: Array<{
    description: string;
    isCompleted: boolean;
    completedBy?: string;
    completedAt?: Date;
    order: number;
  }>;
  requirements?: string;
  acceptanceCriteria?: string;
  updates: Array<{
    employeeId: string;
    employeeName: string;
    description: string;
    hoursWorked: number;
    progress: number;
    completedItems?: string[];
    attachments?: string[];
    createdAt: Date;
  }>;
  comments: Array<{
    userId: string;
    userName: string;
    message: string;
    attachments?: string[];
    createdAt: Date;
  }>;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'in_review', 'completed', 'blocked', 'assigned', 'on_hold'],
    default: 'assigned'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assignedToName: {
    type: String,
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedByName: {
    type: String,
    required: true
  },
  
  // Project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectName: {
    type: String,
    required: true
  },
  
  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Hours
  estimatedHours: {
    type: Number,
    default: 0,
    min: 0
  },
  actualHours: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Additional fields
  category: {
    type: String,
    default: 'Development'
  },
  tags: [{
    type: String
  }],
  checklist: [{
    description: String,
    isCompleted: { type: Boolean, default: false },
    completedBy: String,
    completedAt: Date,
    order: { type: Number, default: 0 }
  }],
  requirements: String,
  acceptanceCriteria: String,
  updates: [{
    employeeId: String,
    employeeName: String,
    description: String,
    hoursWorked: { type: Number, default: 0 },
    progress: { type: Number, min: 0, max: 100 },
    completedItems: [String],
    attachments: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    userId: String,
    userName: String,
    message: String,
    attachments: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);