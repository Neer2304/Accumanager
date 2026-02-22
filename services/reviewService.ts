// services/reviewService.ts
import { Review, ReviewsResponse, CreateReviewData, UpdateReviewData, ReviewFilters, ReviewStats } from '@/types/review';

class ReviewServiceClass {
  private baseUrl = '/api/reviews';

  /**
   * Get all reviews with filtering and pagination
   */
  async getReviews(filters: ReviewFilters = {}): Promise<ReviewsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.rating) params.append('rating', filters.rating.toString());
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.featured) params.append('featured', 'true');

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      return data;
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  }

  /**
   * Get current user's review
   */
  async getUserReview(): Promise<{ review: Review | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/my-review`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user review');
      }

      return data;
    } catch (error) {
      console.error('Get user review error:', error);
      throw error;
    }
  }

  /**
   * Create a new review
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit review');
      }

      return responseData.review;
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  }

  /**
   * Update user's review
   */
  async updateReview(data: UpdateReviewData): Promise<Review> {
    try {
      const response = await fetch(`${this.baseUrl}/my-review`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update review');
      }

      return responseData.review;
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  }

  /**
   * Delete user's review
   */
  async deleteReview(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/my-review`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review');
      }

      return data;
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  }

  /**
   * Toggle helpful mark on a review
   */
  async toggleHelpful(reviewId: string): Promise<{
    message: string;
    helpful: boolean;
    newCount: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/helpful`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update helpful');
      }

      return data;
    } catch (error) {
      console.error('Toggle helpful error:', error);
      throw error;
    }
  }

  /**
   * Get reviews by rating
   */
  async getReviewsByRating(rating: number, limit: number = 10): Promise<Review[]> {
    try {
      const response = await fetch(`${this.baseUrl}?rating=${rating}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      return data.reviews;
    } catch (error) {
      console.error('Get reviews by rating error:', error);
      throw error;
    }
  }

  /**
   * Get featured reviews
   */
  async getFeaturedReviews(limit: number = 5): Promise<Review[]> {
    try {
      const response = await fetch(`${this.baseUrl}?featured=true&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch featured reviews');
      }

      return data.reviews;
    } catch (error) {
      console.error('Get featured reviews error:', error);
      throw error;
    }
  }

  /**
   * Calculate average rating from stats
   */
  getAverageRatingFromStats(stats: ReviewStats): number {
    return stats.averageRating || 0;
  }

  /**
   * Get rating percentage distribution
   */
  getRatingPercentages(stats: ReviewStats): Record<number, number> {
    const percentages: Record<number, number> = {};
    const total = stats.totalReviews;

    for (let i = 1; i <= 5; i++) {
      const ratingData = stats.ratingDistribution.find(r => r._id === i);
      percentages[i] = ratingData ? (ratingData.count / total) * 100 : 0;
    }

    return percentages;
  }

  /**
   * Format review date
   */
  formatReviewDate(date: string): string {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Get star rating display
   */
  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '½' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + halfStar + emptyStars;
  }
}

export const ReviewService = new ReviewServiceClass();