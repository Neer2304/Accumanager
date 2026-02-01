export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  userCompany?: string;
  userRole?: string;
  featured: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsPagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}