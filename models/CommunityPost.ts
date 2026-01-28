// models/CommunityPost.ts
import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICommunityPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  category: string;
  tags: string[];
  author: Types.ObjectId;
  
  // Engagement
  likes: Types.ObjectId[];
  likeCount: number;
  bookmarks: Types.ObjectId[];
  bookmarkCount: number;
  
  // Comments
  comments: {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    status: 'active' | 'deleted' | 'hidden';
    isSolution: boolean;
    likes: Types.ObjectId[];
    likeCount: number;
    replies: {
      user: Types.ObjectId;
      content: string;
      status: 'active' | 'deleted' | 'hidden';
      createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
  commentCount: number;
  
  // Solution
  isSolved: boolean;
  solutionCommentId?: Types.ObjectId;
  
  // Media
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  
  // Status
  status: 'draft' | 'published' | 'archived' | 'deleted';
  isFeatured: boolean;
  isPinned: boolean;
  
  // Stats
  views: number;
  viewHistory: {
    userId: Types.ObjectId;
    viewedAt: Date;
  }[];
  
  // Activity tracking
  lastActivityAt: Date;
  lastCommentAt?: Date;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  content: {
    type: String,
    required: true
  },
  
  excerpt: {
    type: String,
    maxlength: 300
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  category: {
    type: String,
    required: true,
    index: true
  },
  
  tags: [{
    type: String,
    index: true
  }],
  
  author: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser',
    required: true,
    index: true
  },
  
  // Engagement
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser'
  }],
  
  likeCount: {
    type: Number,
    default: 0
  },
  
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser'
  }],
  
  bookmarkCount: {
    type: Number,
    default: 0
  },
  
  // Comments
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityUser',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'deleted', 'hidden'],
      default: 'active'
    },
    isSolution: {
      type: Boolean,
      default: false
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'CommunityUser'
    }],
    likeCount: {
      type: Number,
      default: 0
    },
    replies: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'CommunityUser',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['active', 'deleted', 'hidden'],
        default: 'active'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  commentCount: {
    type: Number,
    default: 0
  },
  
  // Solution
  isSolved: {
    type: Boolean,
    default: false
  },
  
  solutionCommentId: {
    type: Schema.Types.ObjectId
  },
  
  // Media
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'deleted'],
    default: 'published',
    index: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  isPinned: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  
  viewHistory: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityUser'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Activity tracking
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  lastCommentAt: Date,
  
  // SEO
  metaTitle: String,
  metaDescription: String
}, {
  timestamps: true
});

// Indexes for better performance
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ 'comments.createdAt': -1 });
CommunityPostSchema.index({ likeCount: -1 });
CommunityPostSchema.index({ commentCount: -1 });
CommunityPostSchema.index({ category: 1, createdAt: -1 });
CommunityPostSchema.index({ tags: 1, createdAt: -1 });
CommunityPostSchema.index({ slug: 1 });

// Update counts when likes/comments change
CommunityPostSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likeCount = this.likes.length;
  }
  if (this.isModified('bookmarks')) {
    this.bookmarkCount = this.bookmarks.length;
  }
  if (this.isModified('comments')) {
    this.commentCount = this.comments.filter(c => c.status === 'active').length;
    // Update last activity
    this.lastActivityAt = new Date();
    
    // Update last comment date
    const activeComments = this.comments.filter(c => c.status === 'active');
    if (activeComments.length > 0) {
      const latestComment = activeComments.reduce((latest, comment) => 
        comment.createdAt > latest.createdAt ? comment : latest
      );
      this.lastCommentAt = latestComment.createdAt;
    }
  }
  next();
});

export default models.CommunityPost || 
  model<ICommunityPost>('CommunityPost', CommunityPostSchema);