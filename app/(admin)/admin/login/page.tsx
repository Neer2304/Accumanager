"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { ArrowBack, Security } from '@mui/icons-material';
import Link from 'next/link';

// Common Components
import AuthContainer from '@/components/common/auth/AuthContainer';
import AuthCard from '@/components/common/auth/AuthCard';
import AuthHeader from '@/components/common/auth/AuthHeader';
import AuthForm from '@/components/common/auth/AuthForm';
import AuthTextField from '@/components/common/auth/AuthTextField';
import AuthFooter from '@/components/common/auth/AuthFooter';
import AuthMessage from '@/components/common/auth/AuthMessage';
import { SecondaryButton } from '@/components/common';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAdminAuth();
    
    const msg = searchParams.get('message');
    if (msg === 'setup_complete') {
      setMessage('Super admin account created successfully! Please login.');
    }
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      // Not logged in
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <AuthCard hoverEffect>
          {/* Header */}
          <AuthHeader
            title="Welcome Back"
            subtitle="Access your admin dashboard"
            showBackButton
            backHref="/"
          />

          {/* Security Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Security sx={{ fontSize: 16, color: '#10b981' }} />
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Enterprise-grade security
            </Typography>
          </Box>

          {/* Messages */}
          {message && (
            <AuthMessage
              type="security"
              message={message}
              sx={{ mb: 3 }}
            />
          )}

          {error && (
            <AuthMessage
              type="error"
              message={error}
              closable
              onClose={() => setError('')}
              sx={{ mb: 3 }}
            />
          )}

          {/* Login Form */}
          <AuthForm
            onSubmit={handleSubmit}
            submitText="Sign In to Dashboard"
            loading={loading}
            loadingText="Authenticating..."
          >
            <AuthTextField
              fieldType="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
            
            <AuthTextField
              fieldType="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              required
            />
          </AuthForm>

          {/* Footer Links */}
          <AuthFooter
            primaryText="Don't have admin access?"
            primaryLink={{
              text: 'Setup First Admin',
              href: '/admin/setup'
            }}
            showSecurityFeatures
          />

          {/* Return to Main Site */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <SecondaryButton
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
              sx={{
                px: 3,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                background: 'rgba(30, 41, 59, 0.5)',
                color: '#64748b',
                '&:hover': {
                  color: '#f8fafc',
                  background: 'rgba(30, 41, 59, 0.8)',
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                  transform: 'translateX(-4px)',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Return to Main Site
            </SecondaryButton>
          </Box>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
}