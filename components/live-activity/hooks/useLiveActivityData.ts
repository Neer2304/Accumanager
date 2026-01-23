// components/live-activity/hooks/useLiveActivityData.ts
import { useState, useEffect } from 'react';
import { LiveEmployee, RealTimeEvent, ActivityStats, SubscriptionStatus } from '../types';

export const useLiveActivityData = () => {
  const [employees, setEmployees] = useState<LiveEmployee[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealTimeEvent[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    onlineCount: 0,
    inMeetingCount: 0,
    onBreakCount: 0,
    avgProductivity: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.data);
        
        if (!data.data.isActive || data.data.plan === 'trial') {
          setAccessDenied(true);
          setLoading(false);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return false;
    }
  };

  const fetchLiveActivity = async () => {
    try {
      setError(null);
      const response = await fetch('/api/activity/live', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 402) {
          setAccessDenied(true);
          return;
        }
        throw new Error('Failed to fetch live activity');
      }
      
      const data = await response.json();
      setEmployees(data.employees || []);
      setStats(data.stats || {
        onlineCount: 0,
        inMeetingCount: 0,
        onBreakCount: 0,
        avgProductivity: 0,
        totalEmployees: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentEvents = async () => {
    try {
      const response = await fetch('/api/activity/events', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRecentEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const hasAccess = await fetchSubscriptionStatus();
      if (hasAccess) {
        await fetchLiveActivity();
        await fetchRecentEvents();
      }
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    if (!autoRefresh || !subscriptionStatus?.isActive) return;

    const interval = setInterval(() => {
      fetchLiveActivity();
      fetchRecentEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, subscriptionStatus]);

  const refreshData = () => {
    if (!subscriptionStatus?.isActive || subscriptionStatus?.plan === 'trial') {
      setUpgradeDialogOpen(true);
      return;
    }
    
    setLoading(true);
    fetchLiveActivity();
    fetchRecentEvents();
  };

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const result = await response.json();
        const paymentData = result.data;
        
        window.open(paymentData.upiUrl, '_blank');
        setError(null);
        setUpgradeDialogOpen(false);
        
        checkPaymentStatus(paymentData.paymentId);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/payments/status?paymentId=${paymentId}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          const status = result.status;
          
          if (status === 'completed') {
            clearInterval(poll);
            
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                paymentId,
                upiTransactionId: result.upiTransactionId
              }),
            });
            
            await fetchSubscriptionStatus();
            setAccessDenied(false);
            
            await fetchLiveActivity();
            await fetchRecentEvents();
          } else if (status === 'failed') {
            clearInterval(poll);
            setError('Payment failed. Please try again.');
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Payment verification timeout. Please check your payment status manually.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);
  };

  return {
    loading,
    error,
    employees,
    recentEvents,
    stats,
    autoRefresh,
    subscriptionStatus,
    upgradeDialogOpen,
    accessDenied,
    setAutoRefresh,
    setUpgradeDialogOpen,
    setAccessDenied,
    refreshData,
    handleUpgradePlan,
    fetchSubscriptionStatus
  };
};