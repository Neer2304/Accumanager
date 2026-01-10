// hooks/useNotifications.ts - FIXED VERSION
import { useState, useEffect, useRef } from 'react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent infinite loops
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const fetchNotifications = async (force = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current && !force) {
      console.log('⏭️ Notification fetch already in progress');
      return;
    }
    
    // Prevent too frequent fetches (at least 30 seconds between)
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 30000 && hasFetchedRef.current) {
      console.log('⏰ Skipping notification fetch - too soon');
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

    try {
      console.log('🔔 Fetching notifications...');
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/notifications', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control to prevent aggressive fetching
        cache: 'no-cache'
      });

      console.log('📡 Notification response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view notifications');
        }
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data || []);
        hasFetchedRef.current = true;
        console.log('✅ Notifications fetched successfully');
      } else {
        throw new Error(result.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (notificationData: Omit<Notification, '_id' | 'userId' | 'isRead' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh notifications to include the new one
          await fetchNotifications(true);
          return result.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  };

  // Fetch notifications only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const initFetch = async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    };
    
    // Add a small delay to prevent immediate fetch
    const timer = setTimeout(() => {
      initFetch();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - fetch only once

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};