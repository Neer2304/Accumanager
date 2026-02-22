// services/superAdminReviewService.ts
import { Review, SuperAdminReviewsResponse, ReviewStats } from '@/types/reviewss';

class SuperAdminReviewServiceClass {
  private baseUrl = '/api/admin/reviews/all';

  /**
   * Get all reviews (superadmin only)
   */
  async getAllReviews(page: number = 1, limit: number = 50): Promise<SuperAdminReviewsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch all reviews');
      }

      return {
        reviews: data.reviews || [],
        pagination: data.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        stats: data.stats || []
      };
    } catch (error) {
      console.error('Get superadmin reviews error:', error);
      throw error;
    }
  }

  /**
   * Get review statistics by status
   */
  async getReviewStats(): Promise<ReviewStats[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        return [];
      }

      return data.stats || [];
    } catch (error) {
      console.error('Get review stats error:', error);
      return [];
    }
  }

  /**
   * Get summary counts
   */
  async getSummary(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    featured: number;
    avgRating: number;
  }> {
    const stats = await this.getReviewStats();
    
    const summary = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      featured: 0,
      avgRating: 0
    };

    stats.forEach(stat => {
      summary[stat._id as keyof typeof summary] = stat.count;
      if (stat._id === 'approved') {
        summary.avgRating = stat.avgRating || 0;
      }
      summary.total += stat.count;
    });

    return summary;
  }

  /**
   * Delete a review (superadmin only)
   */
  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete review');
    }

    return {
      success: true,
      message: 'Review deleted successfully'
    };
  }
}

export const SuperAdminReviewService = new SuperAdminReviewServiceClass();