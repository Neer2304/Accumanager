// models/EmployeeTask.ts
import mongoose from 'mongoose';

const EmployeeTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed', 'rejected', 'on_hold'],
    default: 'assigned',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  assignedToName: {
    type: String,
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedByName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  projectName: {
    type: String,
  },
  category: {
    type: String,
    enum: ['daily', 'project', 'urgent', 'training', 'maintenance'],
    default: 'daily',
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date,
  }],
  updates: [{
    employeeId: mongoose.Schema.Types.ObjectId,
    employeeName: String,
    description: String,
    hoursWorked: Number,
    progress: Number,
    attachments: [{
      filename: String,
      url: String,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  notes: {
    type: String,
    default: '',
  },
  completionNotes: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.EmployeeTask || mongoose.model('EmployeeTask', EmployeeTaskSchema);