import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamTask extends Document {
  userId: mongoose.Types.ObjectId;
  teamProjectId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedToId?: mongoose.Types.ObjectId; // TeamMember ID
  assignedToName?: string;
  dueDate?: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  attachments: Array<{
    filename: string;
    url: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
  }>;
  comments: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const TeamTaskSchema = new Schema<ITeamTask>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  teamProjectId: {
    type: Schema.Types.ObjectId,
    ref: 'TeamProject',
  },
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
    enum: ['todo', 'in_progress', 'review', 'completed', 'blocked'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  assignedToId: {
    type: Schema.Types.ObjectId,
    ref: 'TeamMember',
  },
  assignedToName: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
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
  tags: [{
    type: String,
    trim: true,
  }],
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  comments: [{
    userId: Schema.Types.ObjectId,
    userName: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Indexes
TeamTaskSchema.index({ userId: 1, status: 1 });
TeamTaskSchema.index({ userId: 1, assignedToId: 1 });
TeamTaskSchema.index({ userId: 1, dueDate: 1 });
TeamTaskSchema.index({ teamProjectId: 1 });
TeamTaskSchema.index({ assignedToId: 1, status: 1 });

export default mongoose.models.TeamTask || mongoose.model<ITeamTask>('TeamTask', TeamTaskSchema);