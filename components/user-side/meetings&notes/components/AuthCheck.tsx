// app/components/user-side/meetings&notes/components/AuthCheck.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = sessionStorage.getItem('meeting_note_auth_token');
      const email = sessionStorage.getItem('meeting_note_user');
      const timestamp = sessionStorage.getItem('meeting_note_timestamp');

      if (authToken === 'verified_access_2024' && email && timestamp) {
        // Check if session is less than 8 hours old
        const sessionAge = Date.now() - parseInt(timestamp);
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (sessionAge < eightHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          sessionStorage.clear();
          router.push('/check/meeting-note');
        }
      } else {
        // Not authenticated
        router.push('/check/meeting-note');
      }
      setCheckingAuth(false);
    };

    checkAuth();
    
    // Listen for storage changes (for multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'meeting_note_auth_token' && !e.newValue) {
        router.push('/check/meeting-note');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Lock sx={{ fontSize: 60, color: '#667eea', mb: 3 }} />
          <CircularProgress size={60} sx={{ color: '#667eea', mb: 3 }} />
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Securing Meeting Platform
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Verifying your credentials...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}