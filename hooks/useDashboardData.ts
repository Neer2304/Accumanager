import { useState, useEffect, useCallback } from 'react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  totalProducts: number;
  revenue: number;
  totalUsageHours: number;
  avgDailyUsage: number;
  peakConcurrentUsers: number;
  userGrowth?: number;
  revenueGrowth?: number;
  dailyUsage?: any[];
  planDistribution?: any[];
  revenueTrend?: any[];
  recentUsers?: any[];
}

export const useDashboardData = (timeRange: string) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    timeRange,
  };
};