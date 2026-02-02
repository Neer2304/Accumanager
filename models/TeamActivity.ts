import mongoose, { Schema, Document, Model } from 'mongoose';

export type ActivityType = 
  | 'task_update' 
  | 'project_update' 
  | 'status_change' 
  | 'login' 
  | 'meeting' 
  | 'file_upload'
  | 'code_commit'
  | 'comment'
  | 'approval'
  | 'system'
  | 'team_member_update';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface IActivityMetadata {
  points: number;
  priority: PriorityLevel;
  tags: string[];
  taskName?: string;
  projectName?: string;
  teamMemberName?: string;
  oldStatus?: string;
  newStatus?: string;
  additionalData?: Record<string, any>;
}

export interface ITeamActivity extends Document {
  userId: mongoose.Types.ObjectId;
  teamMemberId?: mongoose.Types.ObjectId;
  type: ActivityType;
  action: string;
  description: string;
  projectId?: mongoose.Types.ObjectId;
  projectName?: string;
  taskId?: mongoose.Types.ObjectId;
  taskName?: string;
  metadata: IActivityMetadata;
  isImportant: boolean;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityStats {
  _id: string;
  count: number;
  totalPoints: number;
}

const ActivitySchema = new Schema<ITeamActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  teamMemberId: {
    type: Schema.Types.ObjectId,
    ref: 'TeamMember',
    index: true,
  },
  type: {
    type: String,
    enum: [
      'task_update', 
      'project_update', 
      'status_change', 
      'login', 
      'meeting', 
      'file_upload',
      'code_commit',
      'comment',
      'approval',
      'system',
      'team_member_update'
    ],
    required: [true, 'Activity type is required'],
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  projectName: {
    type: String,
    trim: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  taskName: {
    type: String,
    trim: true,
  },
  metadata: {
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    taskName: {
      type: String,
      trim: true,
    },
    projectName: {
      type: String,
      trim: true,
    },
    teamMemberName: {
      type: String,
      trim: true,
    },
    oldStatus: {
      type: String,
      trim: true,
    },
    newStatus: {
      type: String,
      trim: true,
    },
    additionalData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  isImportant: {
    type: Boolean,
    default: false,
    index: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for activity info
ActivitySchema.virtual('activityInfo').get(function() {
  return {
    id: this._id,
    type: this.type,
    action: this.action,
    description: this.description,
    isImportant: this.isImportant,
    isRead: this.isRead,
    createdAt: this.createdAt,
    metadata: this.metadata,
  };
});

// Virtual for team member info (populated)
ActivitySchema.virtual('teamMember', {
  ref: 'TeamMember',
  localField: 'teamMemberId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for performance
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, isImportant: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, teamMemberId: 1 });
ActivitySchema.index({ userId: 1, projectId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, taskId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, 'metadata.priority': 1, createdAt: -1 });
ActivitySchema.index({ createdAt: -1 });

// Static method to log activity
ActivitySchema.statics.logActivity = async function(
  data: Omit<ITeamActivity, 'createdAt' | 'updatedAt'>
): Promise<ITeamActivity> {
  const activity = new this(data);
  return activity.save();
};

// Static method to get recent activities
ActivitySchema.statics.getRecentActivities = async function(
  userId: string, 
  options: {
    limit?: number;
    skip?: number;
    type?: ActivityType;
    teamMemberId?: string;
    projectId?: string;
    isImportant?: boolean;
  } = {}
) {
  const { 
    limit = 50, 
    skip = 0, 
    type, 
    teamMemberId, 
    projectId, 
    isImportant 
  } = options;

  const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
  
  if (type) filter.type = type;
  if (teamMemberId) filter.teamMemberId = new mongoose.Types.ObjectId(teamMemberId);
  if (projectId) filter.projectId = new mongoose.Types.ObjectId(projectId);
  if (isImportant !== undefined) filter.isImportant = isImportant;

  return this.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('teamMember', 'name email role avatar')
    .lean();
};

// Static method to get activity statistics
ActivitySchema.statics.getActivityStats = async function(
  userId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<ActivityStats[]> {
  const matchFilter: any = { userId: new mongoose.Types.ObjectId(userId) };
  
  if (startDate || endDate) {
    matchFilter.createdAt = {};
    if (startDate) matchFilter.createdAt.$gte = startDate;
    if (endDate) matchFilter.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalPoints: { $sum: '$metadata.points' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

// Static method to get daily activity trends
ActivitySchema.statics.getDailyActivityTrends = async function(
  userId: string, 
  days: number = 7
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        totalPoints: { $sum: '$metadata.points' },
        importantCount: {
          $sum: { $cond: [{ $eq: ['$isImportant', true] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id': 1 } },
    { $limit: days },
  ]);
};

// Static method to mark activities as read
ActivitySchema.statics.markAsRead = async function(
  activityIds: string[], 
  userId: string
): Promise<number> {
  const result = await this.updateMany(
    {
      _id: { $in: activityIds.map(id => new mongoose.Types.ObjectId(id)) },
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    },
    { $set: { isRead: true } }
  );
  
  return result.modifiedCount;
};

// Static method to mark all activities as read for user
ActivitySchema.statics.markAllAsRead = async function(userId: string): Promise<number> {
  const result = await this.updateMany(
    {
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    },
    { $set: { isRead: true } }
  );
  
  return result.modifiedCount;
};

// Static method to get unread count
ActivitySchema.statics.getUnreadCount = async function(userId: string): Promise<number> {
  return this.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    isRead: false,
  });
};

// Static method to get important activities
ActivitySchema.statics.getImportantActivities = async function(
  userId: string, 
  limit: number = 10
) {
  return this.find({
    userId: new mongoose.Types.ObjectId(userId),
    isImportant: true,
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('teamMember', 'name role avatar')
  .lean();
};

// Instance method to format for display
ActivitySchema.methods.formatForDisplay = function() {
  const typeEmoji: Record<ActivityType, string> = {
    task_update: '📝',
    project_update: '📂',
    status_change: '🔄',
    login: '🔑',
    meeting: '👥',
    file_upload: '📎',
    code_commit: '💻',
    comment: '💬',
    approval: '✅',
    system: '⚙️',
    team_member_update: '👤',
  };

  const priorityColor: Record<PriorityLevel, string> = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };

  return {
    id: this._id,
    type: this.type,
    action: this.action,
    description: this.description,
    emoji: typeEmoji[this.type] || '🔔',
    priority: this.metadata.priority,
    priorityColor: priorityColor[this.metadata.priority] || 'text-gray-600',
    points: this.metadata.points,
    isImportant: this.isImportant,
    isRead: this.isRead,
    createdAt: this.createdAt,
    formattedDate: this.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    relativeTime: this.getRelativeTime(),
  };
};

// Instance method to get relative time
ActivitySchema.methods.getRelativeTime = function(): string {
  const now = new Date();
  const diffMs = now.getTime() - this.createdAt.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

// Create and export the model
const TeamActivity: Model<ITeamActivity> = mongoose.models.TeamActivity || 
  mongoose.model<ITeamActivity>('TeamActivity', ActivitySchema);

export default TeamActivity;