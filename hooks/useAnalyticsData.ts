import { useState, useEffect, useCallback } from 'react';

interface AnalyticsData {
  stats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averagePayment: number;
    activeSubscriptions: number;
    trialUsers: number;
    totalUsers: number;
    paymentCount: number;
    conversionRate: string;
    avgRevenuePerUser: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    payments: number;
    users: number;
    activeUsers: number;
    uniqueUsers: number;
  }>;
  planDistribution: Array<{
    name: string;
    value: number;
    activeCount: number;
    revenue: number;
    color: string;
  }>;
  topUsers: Array<{
    name: string;
    email: string;
    plan: string;
    status: string;
    joined: string;
    revenue: number;
    paymentCount: number;
    lastPayment: string;
  }>;
  meta?: {
    range: string;
    period: {
      start: string;
      end: string;
    };
    fetchedAt: string;
    requestedBy: {
      id: string;
      email: string;
      role: string;
    };
    dataPoints: {
      monthly: number;
      plans: number;
      topUsers: number;
    };
  };
}

export const useAnalyticsData = (timeRange: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setAuthError(false);

      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      // Handle authentication errors
      if (response.status === 401) {
        setAuthError(true);
        throw new Error('Authentication required. Please login again.');
      }
      
      if (response.status === 403) {
        setAuthError(true);
        throw new Error('Insufficient permissions. Admin access required.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load analytics');
      }

      setData(result);
    } catch (err: any) {
      console.error('Analytics data fetch error:', err);
      setError(err.message || 'Failed to fetch analytics data');
      
      // Fallback to empty data structure
      setData({
        stats: {
          totalRevenue: 0,
          monthlyRevenue: 0,
          averagePayment: 0,
          activeSubscriptions: 0,
          trialUsers: 0,
          totalUsers: 0,
          paymentCount: 0,
          conversionRate: '0.0',
          avgRevenuePerUser: 0,
        },
        monthlyData: [],
        planDistribution: [],
        topUsers: []
      });
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

  // Optional: Custom query function
  const customQuery = useCallback(async (queryData: any) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
      });

      if (response.status === 401 || response.status === 403) {
        setAuthError(true);
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      setError(err.message || 'Custom query failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    authError,
    refresh,
    customQuery,
  };
};