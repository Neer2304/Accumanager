// types/review.ts
export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userCompany?: string;
  userRole?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  
  // Moderation fields
  approvedAt?: string;
  approvedBy?: string;
  approvedByRole?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectedByRole?: string;
  rejectionReason?: string;
  
  // Admin reply
  reply?: {
    message: string;
    repliedBy: string;
    repliedByRole: string;
    repliedAt: string;
  };
  
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SuperAdminReviewsResponse extends AdminReviewsResponse {
  stats: ReviewStats[];
}

export interface ReviewStats {
  _id: string; // status
  count: number;
  avgRating: number;
}

export interface ModerationAction {
  reviewId: string;
  action: 'approve' | 'reject' | 'feature' | 'reply';
  reason?: string;
  featured?: boolean;
  reply?: string;
}

export interface AdminReplyData {
  message: string;
}