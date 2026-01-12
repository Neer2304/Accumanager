import { useState, useEffect, useCallback, useRef } from 'react';

interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  shopName?: string;
  isActive: boolean;
  subscription?: {
    plan?: string;
    status?: string;
    currentPeriodEnd?: string;
  };
  usage?: {
    products?: number;
    customers?: number;
    invoices?: number;
    storageMB?: number;
  };
  createdAt?: string;
}

interface Stats {
  totalUsers: number;
  subscriptionStats: Array<{
    _id: string;
    count: number;
    active: number;
    trial?: number;
  }>;
  activeUsers: number;
  trialUsers: number;
  recentUsers: number;
  revenueStats: {
    total: number;
    monthly: number;
    paymentCount: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UsersData {
  users: User[];
  stats: Stats | null;
  pagination: Pagination;
}

interface Filters {
  role?: string;
  plan?: string;
  status?: string;
  search?: string;
}

export const useUsersData = (page: number, filters: Filters = {}) => {
  const [data, setData] = useState<UsersData>({ 
    users: [], 
    stats: null, 
    pagination: { page: 1, limit: 20, total: 0, pages: 1 } 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Use refs to track previous values and prevent unnecessary fetches
  const prevPageRef = useRef(page);
  const prevFiltersRef = useRef(filters);
  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable filter string for comparison
  const filtersString = JSON.stringify(filters);

  const fetchData = useCallback(async (currentPage: number, currentFilters: Filters) => {
    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      
      if (currentFilters.role) params.append('role', currentFilters.role);
      if (currentFilters.plan) params.append('plan', currentFilters.plan);
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.search) params.append('search', currentFilters.search);

      const response = await fetch(`/api/admin/subscriptions?${params}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: abortControllerRef.current.signal,
      });
      
      if (response.status === 401 || response.status === 403) {
        setAuthError(true);
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      // Transform data to ensure safe structure
      const safeUsers = (result.users || []).map((user: any) => ({
        _id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        shopName: user.shopName,
        isActive: Boolean(user.isActive),
        subscription: {
          plan: user.subscription?.plan || 'No Plan',
          status: user.subscription?.status || 'inactive',
          currentPeriodStart: user.subscription?.currentPeriodStart,
          currentPeriodEnd: user.subscription?.currentPeriodEnd || 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
          trialEndsAt: user.subscription?.trialEndsAt,
          features: user.subscription?.features || [],
        },
        usage: {
          products: user.usage?.products || 0,
          customers: user.usage?.customers || 0,
          invoices: user.usage?.invoices || 0,
          storageMB: user.usage?.storageMB || 0,
        },
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin,
      }));

      setData({
        users: safeUsers,
        stats: result.stats || null,
        pagination: result.pagination || { 
          page: currentPage, 
          limit: 20, 
          total: 0, 
          pages: 1 
        },
      });
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error('Users data fetch error:', err);
      setError(err.message || 'Failed to fetch users data');
      
      // Set empty data on error
      setData({ 
        users: [], 
        stats: null, 
        pagination: { page: currentPage, limit: 20, total: 0, pages: 1 } 
      });
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []); // Empty dependency array

  // Main effect for fetching data
  useEffect(() => {
    // Check if filters or page actually changed
    const pageChanged = page !== prevPageRef.current;
    const filtersChanged = filtersString !== JSON.stringify(prevFiltersRef.current);
    
    if (isInitialMount.current) {
      // Initial fetch
      fetchData(page, filters);
      isInitialMount.current = false;
    } else if (pageChanged || filtersChanged) {
      // Debounce filter changes (but not page changes)
      let timeoutId: NodeJS.Timeout;
      
      if (filtersChanged) {
        // Debounce filter changes by 500ms
        timeoutId = setTimeout(() => {
          fetchData(page, filters);
        }, 500);
      } else {
        // Page changes happen immediately
        fetchData(page, filters);
      }
      
      // Update refs
      prevPageRef.current = page;
      prevFiltersRef.current = filters;
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
  }, [page, filtersString, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refresh = useCallback(() => {
    fetchData(page, filters);
  }, [fetchData, page, filters]);

  const updateUser = useCallback(async (userId: string, updateData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscriptions/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401 || response.status === 403) {
        setAuthError(true);
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update user');
      }

      // Refresh data after update
      fetchData(page, filters);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, filters]);

  const toggleUserStatus = useCallback(async (userId: string, currentStatus: boolean) => {
    return updateUser(userId, { isActive: !currentStatus });
  }, [updateUser]);

  return {
    data,
    loading,
    error,
    authError,
    refresh,
    updateUser,
    toggleUserStatus,
  };
};