// hooks/useSubscription.ts - UPDATED VERSION
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

interface SubscriptionFeatures {
  maxCustomers: number;
  maxProducts: number;
  maxEmployees: number;
  maxInvoices: number;
  maxStorageMB: number;
  [key: string]: number;
}

interface Subscription {
  isActive: boolean;
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'inactive' | 'expired' | 'trial' | 'cancelled';
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  daysRemaining: number;
  features: string[];
  limits: SubscriptionFeatures;
}

interface Usage {
  customers: number;
  products: number;
  employees: number;
  invoices: number;
  storageMB: number;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Refs to prevent infinite loops
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const fetchSubscriptionStatus = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log('🔄 Subscription fetch already in progress');
      return;
    }
    
    // Prevent too frequent fetches (at least 10 seconds between)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 10000 && hasFetchedRef.current) {
      console.log('⏰ Skipping subscription fetch - too soon');
      return;
    }
    
    if (!user) {
      console.log('👤 No user, skipping subscription fetch');
      setIsLoading(false);
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

    try {
      console.log('🔄 Fetching subscription status...');
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/status', {
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ Subscription data received:', data);
      
      if (data.success) {
        // Ensure the data has employees field
        const subscriptionData = {
          ...data.data,
          limits: {
            maxCustomers: data.data.limits?.maxCustomers || 0,
            maxProducts: data.data.limits?.maxProducts || 0,
            maxEmployees: data.data.limits?.maxEmployees || 0,
            maxInvoices: data.data.limits?.maxInvoices || 0,
            maxStorageMB: data.data.limits?.maxStorageMB || 0,
          }
        };
        
        const usageData = {
          customers: data.data.usage?.customers || 0,
          products: data.data.usage?.products || 0,
          employees: data.data.usage?.employees || 0,
          invoices: data.data.usage?.invoices || 0,
          storageMB: data.data.usage?.storageMB || 0,
        };
        
        setSubscription(subscriptionData);
        setUsage(usageData);
        hasFetchedRef.current = true;
      } else {
        throw new Error(data.message || 'Failed to fetch subscription');
      }
    } catch (err) {
      console.error('❌ Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  // Fetch subscription only when user changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      await fetchSubscriptionStatus();
    };

    if (user) {
      console.log('👤 User authenticated, fetching subscription');
      fetchData();
    } else {
      console.log('👤 No user, resetting subscription state');
      if (isMounted) {
        setSubscription(null);
        setUsage(null);
        setIsLoading(false);
        hasFetchedRef.current = false;
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, fetchSubscriptionStatus]);

  const checkLimit = useCallback((resource: keyof Usage, amount: number = 1): boolean => {
    if (!subscription || !usage) return true; // Allow if no data
    
    const currentUsage = usage[resource] || 0;
    const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof SubscriptionFeatures;
    const limit = subscription.limits[limitKey] || 0;
    
    return currentUsage + amount <= limit;
  }, [subscription, usage]);

  const getUsagePercentage = useCallback((resource: keyof Usage): number => {
    if (!subscription || !usage) return 0;
    
    const currentUsage = usage[resource] || 0;
    const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof SubscriptionFeatures;
    const limit = subscription.limits[limitKey] || 1;
    
    return Math.min((currentUsage / limit) * 100, 100);
  }, [subscription, usage]);

  const getRemaining = useCallback((resource: keyof Usage): number => {
    if (!subscription || !usage) return 0;
    
    const currentUsage = usage[resource] || 0;
    const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof SubscriptionFeatures;
    const limit = subscription.limits[limitKey] || 0;
    
    return Math.max(limit - currentUsage, 0);
  }, [subscription, usage]);

  const canAddItem = useCallback((resource: keyof Usage, amount: number = 1): boolean => {
    return checkLimit(resource, amount);
  }, [checkLimit]);

  const canAddCustomer = useMemo(() => checkLimit('customers'), [checkLimit]);
  const canAddProduct = useMemo(() => checkLimit('products'), [checkLimit]);
  const canAddEmployee = useMemo(() => checkLimit('employees'), [checkLimit]);
  const canAddInvoice = useMemo(() => checkLimit('invoices'), [checkLimit]);

  return {
    subscription,
    usage,
    isLoading,
    error,
    refetch: fetchSubscriptionStatus,
    checkLimit,
    getUsagePercentage,
    getRemaining,
    canAddItem,
    canAddCustomer,
    canAddProduct,
    canAddEmployee,
    canAddInvoice,
  };
};