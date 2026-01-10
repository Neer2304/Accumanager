// components/ActivityTracker.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface ActivityData {
  activeTime: number; // in seconds
  timestamp: number;
  page: string;
  device: string;
}

export default function ActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const activityInterval = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect user activity
  const handleUserActivity = () => {
    setIsActive(true);
    setLastActivityTime(Date.now());
    
    // Clear inactivity timeout
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    
    // Set new inactivity timeout (5 minutes)
    inactivityTimeout.current = setTimeout(() => {
      setIsActive(false);
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Send activity data to server
  const sendActivity = async (activeTime: number) => {
    try {
      const activityData: ActivityData = {
        activeTime,
        timestamp: Date.now(),
        page: `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
        device: navigator.userAgent.substring(0, 100)
      };

      await fetch('/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to send activity:', error);
    }
  };

  useEffect(() => {
    // Initialize activity tracking
    const startTracking = () => {
      // Clear any existing interval
      if (activityInterval.current) {
        clearInterval(activityInterval.current);
      }

      // Send activity every 30 seconds when active
      activityInterval.current = setInterval(() => {
        if (isActive) {
          const currentTime = Date.now();
          const timeDiff = Math.floor((currentTime - lastActivityTime) / 1000);
          
          // Only send if user was active for at least 10 seconds
          if (timeDiff >= 10) {
            sendActivity(Math.min(timeDiff, 30)); // Cap at 30 seconds per interval
            setLastActivityTime(currentTime);
          }
        }
      }, 30000); // 30 seconds
    };

    startTracking();

    // Add event listeners for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Initial setup for inactivity detection
    inactivityTimeout.current = setTimeout(() => {
      setIsActive(false);
    }, 5 * 60 * 1000);

    return () => {
      // Cleanup
      if (activityInterval.current) {
        clearInterval(activityInterval.current);
      }
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isActive, lastActivityTime, pathname, searchParams]);

  // Send final activity when page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeDiff = Math.floor((Date.now() - lastActivityTime) / 1000);
      if (timeDiff > 5 && isActive) {
        // Send beacon with final activity
        const activityData: ActivityData = {
          activeTime: timeDiff,
          timestamp: Date.now(),
          page: pathname,
          device: navigator.userAgent.substring(0, 100)
        };

        // Use beacon API for reliability during page unload
        navigator.sendBeacon('/api/user/activity', JSON.stringify(activityData));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive, lastActivityTime, pathname]);

  // This component doesn't render anything
  return null;
}