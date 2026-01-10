// models/EmployeeActivity.ts
import mongoose from 'mongoose';

const EmployeeActivitySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'meeting', 'break', 'focus', 'away'],
    default: 'offline',
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop',
  },
  location: {
    type: String,
    enum: ['office', 'remote', 'hybrid'],
    default: 'office',
  },
  currentActivity: {
    type: String,
    default: 'Working',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  productivity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // For tracking work sessions
  currentSession: {
    startTime: Date,
    task: String,
    project: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.EmployeeActivity || mongoose.model('EmployeeActivity', EmployeeActivitySchema);