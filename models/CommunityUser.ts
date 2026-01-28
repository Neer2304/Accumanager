// models/CommunityUser.ts
import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICommunityUser extends Document {
  userId: Types.ObjectId;
  
  // Community-specific fields
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  
  // Follow system
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  followerCount: number;
  followingCount: number;
  
  // Community stats
  communityStats: {
    totalPosts: number;
    totalComments: number;
    totalLikesReceived: number;
    totalLikesGiven: number;
    totalBookmarks: number;
    engagementScore: number;
    lastActive: Date;
    joinDate: Date;
  };
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    showOnlineStatus: boolean;
    privateProfile: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
  };
  
  // Badges & achievements
  badges: string[];
  achievements: {
    name: string;
    icon: string;
    earnedAt: Date;
  }[];
  
  // Verification
  isVerified: boolean;
  verificationBadge: boolean;
  expertInCategories: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const CommunityUserSchema = new Schema<ICommunityUser>({
  userId: {
    type: Schema.Types.Mixed,
    ref: 'User',
    required: true,
    unique: true
  },
  
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  avatar: String,
  coverImage: String,
  bio: { type: String, maxlength: 500 },
  location: String,
  website: String,
  
  socialLinks: {
    twitter: String,
    linkedin: String,
    instagram: String,
    facebook: String
  },
  
  // Follow system
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser'
  }],
  
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityUser'
  }],
  
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  
  // Community stats
  communityStats: {
    totalPosts: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalLikesReceived: { type: Number, default: 0 },
    totalLikesGiven: { type: Number, default: 0 },
    totalBookmarks: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    joinDate: { type: Date, default: Date.now }
  },
  
  // Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    privateProfile: { type: Boolean, default: false },
    allowMessages: { 
      type: String, 
      enum: ['everyone', 'followers', 'none'],
      default: 'everyone'
    }
  },
  
  // Badges & achievements
  badges: [{ type: String }],
  
  achievements: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verificationBadge: { type: Boolean, default: false },
  expertInCategories: [{ type: String }]
}, {
  timestamps: true
});

// Indexes
CommunityUserSchema.index({ userId: 1 }, { unique: true });
CommunityUserSchema.index({ username: 1 });
CommunityUserSchema.index({ 'communityStats.engagementScore': -1 });
CommunityUserSchema.index({ 'communityStats.lastActive': -1 });
CommunityUserSchema.index({ 'communityStats.totalPosts': -1 });

// Update counts when followers/following changes
CommunityUserSchema.pre('save', function(next) {
  if (this.isModified('followers')) {
    this.followerCount = this.followers.length;
  }
  if (this.isModified('following')) {
    this.followingCount = this.following.length;
  }
  next();
});

export default models.CommunityUser || model<ICommunityUser>('CommunityUser', CommunityUserSchema);