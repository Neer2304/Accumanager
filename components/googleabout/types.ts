// components/googleabout/types.ts
export interface Review {
  _id: string;
  userName: string;
  userCompany?: string;
  userRole?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  featured?: boolean;
}

export interface Summary {
  averageRating: number;
  totalReviews: number;
}

export interface AboutData {
  reviews: Review[];
  summary: Summary | null;
  loading: boolean;
  error: string;
  refetch: () => void;
}

export interface BaseProps {
  isMobile?: boolean;
  isTablet?: boolean;
  darkMode?: boolean;
}