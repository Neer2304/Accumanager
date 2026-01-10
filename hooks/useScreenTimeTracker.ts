// hooks/useScreenTimeTracker.ts
import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const useScreenTimeTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const lastActivityTime = useRef(Date.now());
  const currentSessionStart = useRef(Date.now());
  const isActive = useRef(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Send activity to server
  const sendActivity = useCallback(async (durationSeconds: number) => {
    try {
      const activityData = {
        activeTime: durationSeconds,
        timestamp: Date.now(),
        page: `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
        device: getDeviceInfo(),
        action: 'active' // Could be 'idle', 'active', 'click', etc.
      };
      
      const response = await fetch('/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.warn('Activity tracking failed');
      }
    } catch (error) {
      console.error('Error sending activity:', error);
    }
  }, [pathname, searchParams]);
  
  // Get device info
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    return `${ua.substring(0, 50)} | ${screen}`;
  };
  
  // Handle user activity
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = Math.floor((now - lastActivityTime.current) / 1000);
    
    // Update last activity time
    lastActivityTime.current = now;
    
    // If user was idle (more than 30 seconds) and becomes active again
    if (timeSinceLastActivity > 30 && !isActive.current) {
      isActive.current = true;
      currentSessionStart.current = now;
      console.log('User became active after idle period');
    }
    
    // Send periodic activity (every 30 seconds of active time)
    if (timeSinceLastActivity >= 30 && isActive.current) {
      sendActivity(Math.min(timeSinceLastActivity, 60)); // Cap at 60 seconds
    }
    
    // Reset inactivity timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    // Set user as inactive after 5 minutes of no activity
    inactivityTimer.current = setTimeout(() => {
      isActive.current = false;
      const sessionDuration = Math.floor((Date.now() - currentSessionStart.current) / 1000);
      if (sessionDuration > 10) {
        sendActivity(sessionDuration);
      }
      console.log('User is now idle');
    }, 5 * 60 * 1000); // 5 minutes
  }, [sendActivity]);
  
  // Send heartbeat every minute when active
  const sendHeartbeat = useCallback(() => {
    if (isActive.current) {
      const timeSinceLastActivity = Math.floor((Date.now() - lastActivityTime.current) / 1000);
      if (timeSinceLastActivity > 0) {
        sendActivity(Math.min(timeSinceLastActivity, 60));
      }
    }
  }, [sendActivity]);
  
  useEffect(() => {
    // Initialize tracking
    lastActivityTime.current = Date.now();
    currentSessionStart.current = Date.now();
    
    // Set up event listeners
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'mousedown'];
    
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });
    
    // Set up heartbeat (send activity every minute when active)
    heartbeatTimer.current = setInterval(sendHeartbeat, 60 * 1000);
    
    // Initial inactivity timer
    inactivityTimer.current = setTimeout(() => {
      isActive.current = false;
    }, 5 * 60 * 1000);
    
    // Send final activity on page unload
    const handleBeforeUnload = () => {
      if (isActive.current) {
        const sessionDuration = Math.floor((Date.now() - currentSessionStart.current) / 1000);
        if (sessionDuration > 10) {
          const finalData = {
            activeTime: sessionDuration,
            timestamp: Date.now(),
            page: pathname,
            device: getDeviceInfo(),
            action: 'page_unload'
          };
          
          // Use sendBeacon for reliable delivery during page unload
          navigator.sendBeacon('/api/user/activity', JSON.stringify(finalData));
        }
      }
      
      // Clear timers
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    
    return () => {
      // Cleanup
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      
      // Send final activity on component unmount
      if (isActive.current) {
        const sessionDuration = Math.floor((Date.now() - currentSessionStart.current) / 1000);
        if (sessionDuration > 10) {
          sendActivity(sessionDuration);
        }
      }
    };
  }, [handleUserActivity, sendHeartbeat, sendActivity, pathname]);
  
  return null;
};