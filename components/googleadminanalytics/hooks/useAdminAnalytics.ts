// components/googleadminanalytics/hooks/useAdminAnalytics.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyticsData } from '../components/types';

export const useAdminAnalytics = (initialTimeRange: string = 'monthly') => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setAuthError(false);
      
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.status === 401) {
        setAuthError(true);
        throw new Error('Authentication failed');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to load data');
      }
      
      setData(result.data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeRangeChange = useCallback((newTimeRange: string) => {
    setTimeRange(newTimeRange);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleExportData = useCallback(() => {
    if (!data) return;

    const csvContent = [
      ['Statistic', 'Value'],
      ['Total Revenue', data.stats.totalRevenue],
      ['Monthly Revenue', data.stats.monthlyRevenue],
      ['Active Subscriptions', data.stats.activeSubscriptions],
      ['Trial Users', data.stats.trialUsers],
      ['Total Users', data.stats.totalUsers],
      ['Payment Count', data.stats.paymentCount],
      ['Conversion Rate', data.stats.conversionRate + '%'],
      ['Avg Revenue Per User', data.stats.avgRevenuePerUser],
      [],
      ['Month', 'Revenue', 'Users', 'Payments', 'Active Users', 'Unique Users'],
      ...(data.monthlyData.map(item => [
        item.month, 
        item.revenue, 
        item.users, 
        item.payments, 
        item.activeUsers, 
        item.uniqueUsers
      ])),
      [],
      ['Top Users', 'Email', 'Plan', 'Status', 'Joined', 'Revenue', 'Payments', 'Last Payment'],
      ...(data.topUsers.map(user => [
        user.name, 
        user.email, 
        user.plan, 
        user.status, 
        user.joined, 
        user.revenue, 
        user.paymentCount, 
        user.lastPayment
      ])),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}_${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data, timeRange]);

  return {
    timeRange,
    data,
    loading,
    error,
    authError,
    setTimeRange: handleTimeRangeChange,
    refresh: handleRefresh,
    exportData: handleExportData
  };
};