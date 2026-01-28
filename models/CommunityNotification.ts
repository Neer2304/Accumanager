// models/CommunityNotification.ts
import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICommunityNotification extends Document {
  userId: Types.ObjectId;
  communityUserId: Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'follow' | 'like' | 'comment' | 'mention';
  isRead: boolean;
  actionUrl?: string;
  metadata: {
    postId?: Types.ObjectId;
    commentId?: Types.ObjectId;
    userId?: Types.ObjectId;
    communityUserId?: Types.ObjectId;
    likeCount?: number;
    commentCount?: number;
    actionType?: string;
    extra?: any;
  };
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityNotificationSchema = new Schema<ICommunityNotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  communityUserId: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser',
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'follow', 'like', 'comment', 'mention'],
    default: 'info'
  },
  
  isRead: {
    type: Boolean,
    default: false
  },
  
  actionUrl: {
    type: String,
    default: ''
  },
  
  metadata: {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityPost'
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityPost.comments'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    communityUserId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityUser'
    },
    likeCount: Number,
    commentCount: Number,
    actionType: String,
    extra: Schema.Types.Mixed
  },
  
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
CommunityNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
CommunityNotificationSchema.index({ communityUserId: 1, isRead: 1, createdAt: -1 });
CommunityNotificationSchema.index({ createdAt: -1 });
CommunityNotificationSchema.index({ 'metadata.postId': 1 });

export default models.CommunityNotification || 
  model<ICommunityNotification>('CommunityNotification', CommunityNotificationSchema);