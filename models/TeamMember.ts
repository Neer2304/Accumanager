import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  tasksCompleted: number;
  teamProjects: mongoose.Types.ObjectId[]; // TeamProject IDs
  teamTasks: mongoose.Types.ObjectId[]; // TeamTask IDs
  avatar: string;
  lastActive: Date;
  isActive: boolean;
  joinDate: Date;
  phone?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  department: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'away', 'offline', 'on_leave'],
    default: 'active',
  },
  performance: {
    type: Number,
    default: 85,
    min: [0, 'Performance cannot be less than 0'],
    max: [100, 'Performance cannot exceed 100'],
  },
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  teamProjects: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamProject',
  }],
  teamTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamTask',
  }],
  avatar: {
    type: String,
    default: '',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  bio: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);