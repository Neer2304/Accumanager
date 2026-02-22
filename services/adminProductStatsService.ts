// services/adminProductStatsService.ts
import { ProductStats } from '@/types/product';

class AdminProductStatsServiceClass {
  private baseUrl = '/api/admin/products/stats';

  /**
   * Get product statistics
   */
  async getStats(): Promise<ProductStats> {
    try {
      const response = await fetch(this.baseUrl, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache stats for 5 minutes - they don't change often
        next: { revalidate: 300 }
      });

      const data = await response.json();

      if (!response.ok) {
        return { totalProducts: 0 };
      }

      return {
        totalProducts: data.totalProducts || 0
      };
    } catch (error) {
      console.error('Get product stats error:', error);
      return { totalProducts: 0 };
    }
  }

  /**
   * Get total product count (for dashboard)
   */
  async getTotalCount(): Promise<number> {
    const stats = await this.getStats();
    return stats.totalProducts;
  }

  /**
   * Check if any products exist
   */
  async hasProducts(): Promise<boolean> {
    const count = await this.getTotalCount();
    return count > 0;
  }
}

export const AdminProductStatsService = new AdminProductStatsServiceClass();