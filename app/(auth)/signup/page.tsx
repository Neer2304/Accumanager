'use client'

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Common Components
import { AnimatedBackground, FloatingBackground } from '@/components/common/index';

// User-Side Components
import {
  UserRegistrationForm,
  RegisterFeatureList,
  RegisterTrustBadges,
  RegisterHeroSection,
  TrialBadge,
} from '@/components/user-side';

export default function RegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (data: any) => {
    clearError();
    const { confirmPassword, ...userData } = data;
    registerUser(userData);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <AnimatedBackground>
      <FloatingBackground count={3} size={isMobile ? 100 : 150} />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 3 : 6,
          alignItems: 'center',
          p: isMobile ? 2 : 0,
        }}
      >
        {/* Left Side - Hero Content */}
        <RegisterHeroSection
          appName="AccuManage"
          tagline="Get started with AccuManage and transform your business operations. No credit card required for the 14-day free trial."
        >
          <RegisterFeatureList />
          <RegisterTrustBadges />
        </RegisterHeroSection>

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 500,
            width: '100%',
            position: 'relative',
          }}
        >
          <TrialBadge days={14} position="top" />
          
          <Card 
            elevation={6}
            sx={{ 
              borderRadius: 4,
              overflow: 'visible',
              position: 'relative',
              border: '1px solid',
              borderColor: 'divider',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'background.paper',
              mt: 2, // Space for the floating badge
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, pt: 4 }}>
              <UserRegistrationForm
                onSubmit={handleSubmit}
                loading={isLoading}
                // error={error}
                onClearError={clearError}
                onLogin={handleLogin}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AnimatedBackground>
  );
}