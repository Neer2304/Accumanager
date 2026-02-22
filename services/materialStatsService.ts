// services/materialStatsService.ts
import { MaterialStats, ActivityItem, TopMaterial } from '@/types/material';
import { redisCache } from '@/lib/cache/redis';
import { jobQueue } from '@/lib/queue/bull';

class MaterialStatsServiceClass {
  private baseUrl = '/api/materials/stats';

  /**
   * Get material statistics with caching
   */
  async getStats(
    userId: string,
    days: number = 30,
    forceRefresh: boolean = false
  ): Promise<MaterialStats> {
    const cacheKey = redisCache.generateKey('stats', userId, { days });

    if (!forceRefresh) {
      const cached = await redisCache.get<MaterialStats>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}?days=${days}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      // Cache for 10 minutes (stats don't change as frequently)
      await redisCache.set(cacheKey, data.data, 600);

      return data.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(
    userId: string,
    limit: number = 20
  ): Promise<ActivityItem[]> {
    const cacheKey = redisCache.generateKey('activity', userId, { limit });

    const cached = await redisCache.get<ActivityItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/activity?limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch activity');
      }

      // Cache for 2 minutes (activity changes frequently)
      await redisCache.set(cacheKey, data.data, 120);

      return data.data;
    } catch (error) {
      console.error('Get activity error:', error);
      throw error;
    }
  }

  /**
   * Get top used materials
   */
  async getTopUsed(
    userId: string,
    limit: number = 10
  ): Promise<TopMaterial[]> {
    const cacheKey = redisCache.generateKey('top-used', userId, { limit });

    const cached = await redisCache.get<TopMaterial[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/top?limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch top used');
      }

      await redisCache.set(cacheKey, data.data, 300);

      return data.data;
    } catch (error) {
      console.error('Get top used error:', error);
      throw error;
    }
  }

  /**
   * Get low stock alert count
   */
  async getLowStockCount(userId: string): Promise<number> {
    const cacheKey = redisCache.generateKey('low-stock', userId);

    const cached = await redisCache.get<number>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const stats = await this.getStats(userId);
      await redisCache.set(cacheKey, stats.lowStockCount, 60);
      return stats.lowStockCount;
    } catch (error) {
      console.error('Get low stock count error:', error);
      return 0;
    }
  }
}

export const MaterialStatsService = new MaterialStatsServiceClass();