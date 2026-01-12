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
import Link from 'next/link';

// Common Components
import { AnimatedBackground } from '@/components/common/index';
import { PrimaryButton } from '@/components/common';

// User-Side Components
import {
  UserLoginForm,
  UserLoginHeader,
  LoginFeatureHighlight,
  LoginTrustIndicators,
  LoginBrandingSection,
} from '@/components/user-side';

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (data: { email: string; password: string }) => {
    clearError();
    login(data);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <AnimatedBackground showRadial>
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 4 : 8,
          p: isMobile ? 2 : 0,
        }}
      >
        {/* Left Side - Branding & Features */}
        <LoginBrandingSection
          appName="AccuManage"
          tagline="Sign in to access your business dashboard and continue growing with our powerful management tools."
        >
          <LoginFeatureHighlight />
          <LoginTrustIndicators />
        </LoginBrandingSection>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 450,
            width: '100%',
          }}
        >
          <Card 
            elevation={8}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'background.paper',
            }}
          >
            <UserLoginHeader
              title="Sign In"
              subtitle="Access your business dashboard"
              gradient
            />

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              <UserLoginForm
                onSubmit={handleSubmit}
                loading={isLoading}
                // error={error}
                onClearError={clearError}
                onForgotPassword={handleForgotPassword}
                onRegister={handleRegister}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AnimatedBackground>
  );
}