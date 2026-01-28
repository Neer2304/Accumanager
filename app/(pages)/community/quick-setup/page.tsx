// app/(pages)/community/quick-setup/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  PersonAdd,
  People,
  Forum,
  ThumbUp,
  Share,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QuickSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/community';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  
  const steps = [
    'Checking authentication...',
    'Verifying user account...',
    'Creating community profile...',
    'Setting up preferences...',
    'Redirecting to community...'
  ];

  useEffect(() => {
    // Auto-start setup on page load
    handleQuickSetup();
  }, []);

  const handleQuickSetup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Check authentication
      setStep(0);
      setProgress(20);
      
      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (!authResponse.ok) {
        throw new Error('Please sign in first');
      }
      
      const session = await authResponse.json();
      if (!session.user) {
        throw new Error('Please sign in first');
      }
      
      // Step 2: Check if already has profile
      setStep(1);
      setProgress(40);
      
      const meResponse = await fetch('/api/community/me', {
        credentials: 'include',
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        if (meData.success && meData.data.hasCommunityProfile) {
          // Already has profile, redirect immediately
          router.push(redirectTo);
          return;
        }
      }
      
      // Step 3: Create minimal profile
      setStep(2);
      setProgress(60);
      
      const setupResponse = await fetch('/api/community/setup/minimal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      
      setStep(3);
      setProgress(80);
      
      const setupData = await setupResponse.json();
      
      if (!setupData.success) {
        throw new Error(setupData.message || 'Failed to create profile');
      }
      
      // Step 4: Success, redirect
      setStep(4);
      setProgress(100);
      
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to setup community profile');
      setLoading(false);
    }
  };

  const handleManualSetup = () => {
    router.push('/community/setup');
  };

  const handleSignIn = () => {
    router.push('/api/auth/signin?callbackUrl=/community/quick-setup');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Quick Community Setup
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Get started with the community in just a few seconds
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {/* Progress Section */}
        {loading && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary">
              {steps[step]}
            </Typography>
          </Box>
        )}
        
        {/* Benefits Card */}
        <Card sx={{ mb: 4, textAlign: 'left' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Community Benefits:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <People color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Connect with Business Owners" 
                  secondary="Network with entrepreneurs and experts" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Forum color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Join Discussions" 
                  secondary="Share insights and get advice" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ThumbUp color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Follow & Get Followed" 
                  secondary="Build your professional network" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Share color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Share Your Expertise" 
                  secondary="Help others and establish credibility" 
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        {!loading && !error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleQuickSetup}
              startIcon={<CheckCircle />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Quick Setup (Auto-create)
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleManualSetup}
              startIcon={<PersonAdd />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Custom Setup (Choose username & bio)
            </Button>
            
            <Divider sx={{ my: 1 }}>or</Divider>
            
            <Button
              variant="text"
              onClick={handleSignIn}
              disabled={loading}
            >
              Sign in with different account
            </Button>
          </Box>
        )}
        
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Setting up your profile...
            </Typography>
          </Box>
        )}
        
        {/* Back Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            disabled={loading}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}