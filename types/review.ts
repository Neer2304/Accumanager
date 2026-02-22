// types/review.ts
export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  userCompany?: string;
  userRole?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  userHasMarkedHelpful?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    _id: number;
    count: number;
  }>;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: ReviewStats;
}

export interface CreateReviewData {
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewData {
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  sort?: 'newest' | 'oldest' | 'helpful' | 'rating';
  featured?: boolean;
}