// models/Community.ts
import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Comment Reply Interface
export interface ICommentReply {
  user: Types.ObjectId;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  likes: Types.ObjectId[];
  createdAt: Date;
}

// Comment Interface
export interface IComment {
  user: Types.ObjectId;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  likes: Types.ObjectId[];
  likeCount: number;
  replies: ICommentReply[];
  isSolution: boolean;
  createdAt: Date;
  editedAt?: Date;
}

// Post Attachment Interface
export interface IPostAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

// View History Interface
export interface IViewHistory {
  user?: Types.ObjectId;
  viewedAt: Date;
}

// Flag Interface
export interface IFlag {
  user: Types.ObjectId;
  reason: string;
  createdAt: Date;
}

// Main Community Post Interface
export interface ICommunity extends Document {
  // Basic info
  title: string;
  content: string;
  excerpt?: string;
  
  // Author info
  author: Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  
  // Categorization
  category: string;
  tags: string[];
  
  // Engagement metrics
  likes: Types.ObjectId[];
  likeCount: number;
  comments: Types.DocumentArray<IComment>;
  commentCount: number;
  views: number;
  viewHistory: IViewHistory[];
  
  // Status flags
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  solutionCommentId?: Types.ObjectId;
  
  // Content
  attachments: IPostAttachment[];
  
  // Moderation
  status: 'active' | 'closed' | 'archived' | 'deleted';
  editedAt?: Date;
  editedBy?: Types.ObjectId;
  
  // Activity tracking
  lastActivityAt: Date;
  
  // Flags and reporting
  flags: IFlag[];
  flagged: boolean;
  
  // User interactions
  bookmarks: Types.ObjectId[];
  bookmarkCount: number;
  shares: number;
  
  // SEO and analytics
  wordCount?: number;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Metadata
  metadata?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  toggleLike(userId: Types.ObjectId): this;
  addView(userId?: Types.ObjectId): this;
  addComment(commentData: Partial<IComment>): this;
  markAsSolution(commentId: Types.ObjectId): this;
}

// Static Methods Interface
interface CommunityModel extends Model<ICommunity> {
  getCategories(): Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  getPopularTags(limit?: number): Promise<Array<{ _id: string; count: number }>>;
  getStats(): Promise<{
    totalPosts: number;
    totalComments: number;
    totalUsers: number;
    activeToday: number;
    popularCategories: Array<{ _id: string; count: number }>;
    topPosts: Array<{
      _id: Types.ObjectId;
      title: string;
      likeCount: number;
      commentCount: number;
      views: number;
      category?: string;
      authorName?: string;
      createdAt?: Date;
      lastActivityAt?: Date;
    }>;
  }>;
}

// Schema Definition
const communitySchema = new Schema<ICommunity, CommunityModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    authorName: {
      type: String,
      required: true,
    },
    
    authorAvatar: String,
    
    authorRole: {
      type: String,
      default: 'user',
    },
    
    category: {
      type: String,
      default: 'general',
      index: true,
    },
    
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    
    likeCount: {
      type: Number,
      default: 0,
    },
    
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      userAvatar: String,
      userRole: {
        type: String,
        default: 'user',
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      likeCount: {
        type: Number,
        default: 0,
      },
      replies: [{
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        userName: String,
        userAvatar: String,
        userRole: {
          type: String,
          default: 'user',
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        likes: [{
          type: Schema.Types.ObjectId,
          ref: 'User',
        }],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
      isSolution: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      editedAt: Date,
    }],
    
    commentCount: {
      type: Number,
      default: 0,
    },
    
    views: {
      type: Number,
      default: 0,
    },
    
    viewHistory: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    isPinned: {
      type: Boolean,
      default: false,
    },
    
    isLocked: {
      type: Boolean,
      default: false,
    },
    
    isSolved: {
      type: Boolean,
      default: false,
    },
    
    solutionCommentId: {
      type: Schema.Types.ObjectId,
    },
    
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
    }],
    
    status: {
      type: String,
      enum: ['active', 'closed', 'archived', 'deleted'],
      default: 'active',
    },
    
    editedAt: Date,
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    flags: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    flagged: {
      type: Boolean,
      default: false,
    },
    
    bookmarks: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    
    shares: {
      type: Number,
      default: 0,
    },
    
    wordCount: Number,
    readTime: Number,
    
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    
    metadata: {
      browser: String,
      os: String,
      device: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
communitySchema.index({ category: 1, createdAt: -1 });
communitySchema.index({ author: 1, createdAt: -1 });
communitySchema.index({ tags: 1, createdAt: -1 });
communitySchema.index({ status: 1, createdAt: -1 });
communitySchema.index({ likeCount: -1 });
communitySchema.index({ commentCount: -1 });
communitySchema.index({ views: -1 });
communitySchema.index({ isPinned: -1, lastActivityAt: -1 });
communitySchema.index({ title: 'text', content: 'text', tags: 'text' });

// Pre-save middleware
communitySchema.pre<ICommunity>('save', function(next) {
  if (this.isModified('content')) {
    // Calculate word count and read time
    const words = this.content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readTime = Math.ceil(words / 200);
    
    // Generate excerpt if not provided
    if (!this.excerpt && this.content) {
      this.excerpt = this.content.substring(0, 250).trim() + '...';
    }
    
    // SEO optimization
    this.seoTitle = this.title;
    this.seoDescription = this.excerpt;
    this.seoKeywords = [...new Set([...(this.tags || []), this.category])];
  }
  
  // Update comment count
  if (this.isModified('comments')) {
    this.commentCount = this.comments.length;
  }
  
  // Update like count
  if (this.isModified('likes')) {
    this.likeCount = this.likes.length;
  }
  
  // Update bookmark count
  if (this.isModified('bookmarks')) {
    this.bookmarkCount = this.bookmarks.length;
  }
  
  // Update last activity
  if (this.isModified() && !this.isModified('views')) {
    this.lastActivityAt = new Date();
  }
  
  next();
});


// Ensure IDs are converted to strings when sent to the frontend
communitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    // If you have comments, normalize their IDs too
    if (ret.comments) {
      ret.comments = ret.comments.map((c: any) => ({
        ...c,
        _id: c._id ? c._id.toString() : c._id,
        likes: c.likes ? c.likes.map((l: any) => l.toString()) : []
      }));
    }
    return ret;
  }
});

// Instance Methods

/**
 * Toggle like for a post
 */
communitySchema.methods.toggleLike = function(this: ICommunity, userId: Types.ObjectId): ICommunity {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex((id: Types.ObjectId) => id.toString() === userIdStr);
  
  if (likeIndex > -1) {
    // Remove like
    this.likes.splice(likeIndex, 1);
    this.likeCount = Math.max(0, this.likeCount - 1);
  } else {
    // Add like
    this.likes.push(userId);
    this.likeCount += 1;
  }
  
  // Update last activity
  this.lastActivityAt = new Date();
  
  return this;
};

/**
 * Add a view to the post
 */
communitySchema.methods.addView = function(this: ICommunity, userId?: Types.ObjectId): ICommunity {
  this.views += 1;
  
  // Add to view history if user is authenticated
  if (userId) {
    const userIdStr = userId.toString();
    const existingView = this.viewHistory.find((view: IViewHistory) => 
      view.user && view.user.toString() === userIdStr
    );
    
    if (!existingView) {
      this.viewHistory.push({
        user: userId,
        viewedAt: new Date(),
      });
    }
  }
  
  return this;
};

/**
 * Add a comment to the post
 */
communitySchema.methods.addComment = function(
  this: ICommunity, 
  commentData: Partial<IComment>
): ICommunity {
  const comment = {
    user: commentData.user!,
    userName: commentData.userName!,
    userAvatar: commentData.userAvatar,
    userRole: commentData.userRole || 'user',
    content: commentData.content!,
    likes: [],
    likeCount: 0,
    replies: [],
    isSolution: false,
    createdAt: new Date(),
  };
  
  this.comments.push(comment as any);
  this.commentCount = this.comments.length;
  this.lastActivityAt = new Date();
  
  return this;
};

/**
 * Mark a comment as solution
 */
communitySchema.methods.markAsSolution = function(
  this: ICommunity, 
  commentId: Types.ObjectId
): ICommunity {
  const commentIdStr = commentId.toString();
  
  // First, unmark any existing solution
  this.comments.forEach((comment: IComment) => {
    if (comment.isSolution) {
      comment.isSolution = false;
    }
  });
  
  // Find and mark the new solution
  const comment = this.comments.find((c: IComment) => 
    (c as any)._id.toString() === commentIdStr
  );
  
  if (comment) {
    comment.isSolution = true;
    this.isSolved = true;
    this.solutionCommentId = commentId;
  }
  
  // Update last activity
  this.lastActivityAt = new Date();
  
  return this;
};

// Static Methods

/**
 * Get available categories
 */
communitySchema.statics.getCategories = function() {
  return [
    { id: 'general', name: 'General Discussion', icon: '💬', color: '#1976d2' },
    { id: 'questions', name: 'Questions & Answers', icon: '❓', color: '#0288d1' },
    { id: 'tips', name: 'Tips & Tricks', icon: '💡', color: '#388e3c' },
    { id: 'bugs', name: 'Bug Reports', icon: '🐛', color: '#d32f2f' },
    { id: 'features', name: 'Feature Requests', icon: '✨', color: '#f57c00' },
    { id: 'announcements', name: 'Announcements', icon: '📢', color: '#7b1fa2' },
  ];
};

/**
 * Get popular tags
 */
communitySchema.statics.getPopularTags = async function(limit: number = 20): Promise<Array<{ _id: string; count: number }>> {
  const result = await this.aggregate([
    { $match: { status: 'active' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  
  return result.map((tag: any) => ({
    _id: tag._id,
    count: tag.count,
  }));
};

/**
 * Get community statistics
 */
communitySchema.statics.getStats = async function(): Promise<{
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  activeToday: number;
  popularCategories: Array<{ _id: string; count: number }>;
  topPosts: Array<{
    _id: Types.ObjectId;
    title: string;
    likeCount: number;
    commentCount: number;
    views: number;
    category?: string;
    authorName?: string;
    createdAt?: Date;
    lastActivityAt?: Date;
  }>;
}> {
  const [
    totalPosts,
    totalCommentsResult,
    totalUsers,
    activeToday,
    popularCategories,
    topPosts,
  ] = await Promise.all([
    this.countDocuments({ status: 'active' }),
    this.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$commentCount' } } },
    ]),
    mongoose.model('User').estimatedDocumentCount(),
    this.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }),
    this.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    this.find({ status: 'active' })
      .sort({ likeCount: -1, commentCount: -1 })
      .limit(5)
      .select('_id title likeCount commentCount views category authorName createdAt lastActivityAt')
      .lean(),
  ]);

  const totalComments = totalCommentsResult[0]?.total || 0;

  return {
    totalPosts,
    totalComments,
    totalUsers,
    activeToday,
    popularCategories: popularCategories.map((cat: any) => ({
      _id: cat._id,
      count: cat.count,
    })),
    topPosts: topPosts.map((post: any) => ({
      _id: post._id,
      title: post.title,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      views: post.views || 0,
      category: post.category || 'general',
      authorName: post.authorName || '',
      createdAt: post.createdAt || new Date(),
      lastActivityAt: post.lastActivityAt || new Date(),
    })),
  };
};

// Create and export the model
const Community = (mongoose.models.Community as CommunityModel) ||
  mongoose.model<ICommunity, CommunityModel>('Community', communitySchema);

export default Community;
export type { CommunityModel };