// User Interface
export interface UserType {
  _id: string;
  name: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin' | 'expert';
  email?: string;
}

// Comment Reply Interface
export interface CommentReplyType {
  _id: string;
  user: UserType;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  likes: string[];
  createdAt: string;
}

// Comment Interface
export interface CommentType {
  _id: string;
  user: UserType;
  userName: string;
  userAvatar?: string;
  userRole: string;
  content: string;
  likes: string[];
  likeCount: number;
  replies: CommentReplyType[];
  isSolution: boolean;
  createdAt: string;
}

// Post Attachment Interface
export interface PostAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

// Post Interface for frontend
export interface PostType {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: UserType;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  category: string;
  tags: string[];
  likes: string[];
  likeCount: number;
  comments: CommentType[];
  commentCount: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  solutionCommentId?: string;
  attachments: PostAttachment[];
  status: 'active' | 'closed' | 'archived' | 'deleted';
  editedAt?: string;
  editedBy?: string;
  lastActivityAt: string;
  bookmarks: string[];
  bookmarkCount: number;
  shares: number;
  wordCount?: number;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  metadata?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Minimal Post for listings
export interface PostMinimalType {
  _id: string;
  title: string;
  excerpt?: string;
  author: UserType;
  category: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  views: number;
  isPinned: boolean;
  isSolved: boolean;
  status: string;
  lastActivityAt: string;
  createdAt: string;
}

// Filters Interface
export interface CommunityFilters {
  page: number;
  limit: number;
  category: string;
  sort: 'newest' | 'oldest' | 'popular' | 'most_commented' | 'most_viewed' | 'trending';
  search: string;
  tag: string;
  author: string;
  status: string;
}

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Category Interface
export interface CategoryType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Top Post Interface for stats
export interface TopPostType {
  _id: string;
  title: string;
  likeCount: number;
  commentCount: number;
  views: number;
  category?: string;
  authorName?: string;
  createdAt?: string;
  lastActivityAt?: string;
}

// Stats Interface
export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  activeToday: number;
  popularCategories: Array<{ _id: string; count: number }>;
  recentActivity: PostMinimalType[];
  categoryDistribution: Array<{ _id: string; count: number }>;
  topContributors: Array<{
    _id: string;
    name: string;
    avatar?: string;
    role: string;
    postCount: number;
  }>;
  topPosts: TopPostType[];
  timestamp: string;
}