// models/ProjectUpdate.ts
import mongoose from 'mongoose';

const ProjectUpdateSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['progress', 'task_complete', 'task_blocked', 'milestone', 'delay', 'status_change', 'comment'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.models.ProjectUpdate || mongoose.model('ProjectUpdate', ProjectUpdateSchema);