// services/aboutService.ts
export interface AboutReview {
  _id: string;
  userName: string;
  userAvatar?: string;
  userCompany?: string;
  userRole?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface AboutSummary {
  averageRating: number;
  totalReviews: number;
}

export interface AboutData {
  reviews: AboutReview[];
  summary: AboutSummary;
}

class AboutServiceClass {
  private baseUrl = '/api/about';

  /**
   * Get about page data (reviews and summary)
   */
  async getAboutData(): Promise<AboutData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour (Next.js 13+)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch about data');
      }

      return data.data;
    } catch (error) {
      console.error('About data fetch error:', error);
      throw error;
    }
  }

  /**
   * Get only the reviews (if needed elsewhere)
   */
  async getReviews(): Promise<AboutReview[]> {
    const data = await this.getAboutData();
    return data.reviews;
  }

  /**
   * Get only the summary stats
   */
  async getSummary(): Promise<AboutSummary> {
    const data = await this.getAboutData();
    return data.summary;
  }

  /**
   * Calculate rating percentage (for star display)
   */
  getRatingPercentage(rating: number): number {
    return (rating / 5) * 100;
  }

  /**
   * Get star display array
   */
  getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  }
}

export const AboutService = new AboutServiceClass();