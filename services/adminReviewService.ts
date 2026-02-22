// services/adminReviewService.ts
import { Review, ReviewFilters, AdminReviewsResponse, ModerationAction, AdminReplyData } from '@/types/reviewss';

class AdminReviewServiceClass {
  private baseUrl = '/api/admin/reviews';

  /**
   * Get reviews with filters (admin access)
   */
  async getReviews(filters: ReviewFilters = {}): Promise<AdminReviewsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Only admin can see pending by default, but support 'all'
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.rating) params.append('rating', filters.rating.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`${this.baseUrl}?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      return {
        reviews: data.reviews || [],
        pagination: data.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Get admin reviews error:', error);
      throw error;
    }
  }

  /**
   * Get pending reviews (default admin view)
   */
  async getPendingReviews(page: number = 1, limit: number = 20): Promise<AdminReviewsResponse> {
    return this.getReviews({ status: 'pending', page, limit });
  }

  /**
   * Get approved reviews
   */
  async getApprovedReviews(page: number = 1, limit: number = 20): Promise<AdminReviewsResponse> {
    return this.getReviews({ status: 'approved', page, limit });
  }

  /**
   * Get rejected reviews
   */
  async getRejectedReviews(page: number = 1, limit: number = 20): Promise<AdminReviewsResponse> {
    return this.getReviews({ status: 'rejected', page, limit });
  }

  /**
   * Approve a review
   */
  async approveReview(reviewId: string): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/${reviewId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'approve' }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to approve review');
    }

    return data.review;
  }

  /**
   * Reject a review
   */
  async rejectReview(reviewId: string, reason: string): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/${reviewId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reject', reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reject review');
    }

    return data.review;
  }

  /**
   * Update review status or feature
   */
  async updateReview(action: ModerationAction): Promise<Review> {
    const response = await fetch(this.baseUrl, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update review');
    }

    return data.review;
  }

  /**
   * Feature/unfeature a review
   */
  async toggleFeature(reviewId: string, featured: boolean): Promise<Review> {
    return this.updateReview({
      reviewId,
      action: 'feature',
      featured
    });
  }

  /**
   * Reply to a review
   */
  async replyToReview(reviewId: string, replyData: AdminReplyData): Promise<Review> {
    return this.updateReview({
      reviewId,
      action: 'reply',
      reply: replyData.message
    });
  }

  /**
   * Batch approve multiple reviews
   */
  async batchApprove(reviewIds: string[]): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewIds, action: 'approve' }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to approve reviews');
    }

    return {
      success: true,
      message: `${reviewIds.length} reviews approved successfully`
    };
  }

  /**
   * Batch reject multiple reviews
   */
  async batchReject(reviewIds: string[], reason: string = ''): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewIds, action: 'reject', reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reject reviews');
    }

    return {
      success: true,
      message: `${reviewIds.length} reviews rejected successfully`
    };
  }
}

export const AdminReviewService = new AdminReviewServiceClass();