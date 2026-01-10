// models/ActivityEvent.ts
import mongoose from 'mongoose';

const ActivityEventSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['login', 'logout', 'meeting_start', 'meeting_end', 'break_start', 'break_end', 'task_start', 'task_complete', 'status_change'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.ActivityEvent || mongoose.model('ActivityEvent', ActivityEventSchema);