// app/(auth)/logout/page.tsx
'use client'

import React, { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { offlineStorage } from '@/utils/offlineStorage';
import { useRouter } from 'next/navigation';
import { AnimatedBackground } from '@/components/common';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all disclaimer and auth data
        await offlineStorage.removeItem('legal_disclaimer_accepted');
        await offlineStorage.removeItem('auth');
        
        // Call logout mutation
        logout();
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/login');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <AnimatedBackground showRadial>
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 3 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h5" fontWeight="bold">
          Logging out...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clearing your session and legal disclaimer acceptance...
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    </AnimatedBackground>
  );
}