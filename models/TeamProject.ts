import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date;
  deadline?: Date;
  progress: number;
  assignedTeamMembers: mongoose.Types.ObjectId[]; // TeamMember IDs
  teamTasks: mongoose.Types.ObjectId[]; // TeamTask IDs
  category: string;
  tags: string[];
  clientName?: string;
  budget?: number;
  hoursSpent: number;
  estimatedHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamProjectSchema = new Schema<ITeamProject>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  assignedTeamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamMember',
  }],
  teamTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamTask',
  }],
  category: {
    type: String,
    default: 'general',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  clientName: {
    type: String,
  },
  budget: {
    type: Number,
    min: 0,
  },
  hoursSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  estimatedHours: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
TeamProjectSchema.index({ userId: 1, status: 1 });
TeamProjectSchema.index({ userId: 1, priority: 1 });
TeamProjectSchema.index({ userId: 1, deadline: 1 });
TeamProjectSchema.index({ assignedTeamMembers: 1 });

export default mongoose.models.TeamProject || mongoose.model<ITeamProject>('TeamProject', TeamProjectSchema);