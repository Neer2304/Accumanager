// components/SubscriptionStatus.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  AccountCircle,
  CalendarToday,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

interface SubscriptionData {
  isActive: boolean;
  plan: string;
  status: string;
  trialEndsAt?: string;
  currentPeriodEnd: string;
  daysRemaining: number;
  features: string[];
  limits: any;
  usage: any;
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'expired': return 'error';
      case 'cancelled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'trial': return <AccountCircle />;
      case 'expired': return <Warning />;
      default: return <AccountCircle />;
    }
  };

  if (loading) {
    return <Card><CardContent>Loading subscription status...</CardContent></Card>;
  }

  if (error || !subscription) {
    return (
      <Alert severity="error">
        Failed to load subscription status: {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Subscription Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={getStatusIcon(subscription.status)}
                label={subscription.status.toUpperCase()}
                color={getStatusColor(subscription.status)}
                variant="filled"
              />
              <Typography variant="body1" fontWeight="bold">
                {subscription.plan.toUpperCase()} PLAN
              </Typography>
            </Box>
          </Box>
          
          <Button variant="outlined" size="small">
            Upgrade Plan
          </Button>
        </Box>

        {/* Usage Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Products
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {subscription.usage.products} / {subscription.limits.products}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(subscription.usage.products / subscription.limits.products) * 100}
              sx={{ mt: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Customers
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {subscription.usage.customers} / {subscription.limits.customers}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(subscription.usage.customers / subscription.limits.customers) * 100}
              sx={{ mt: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Invoices
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {subscription.usage.invoices} / {subscription.limits.invoices}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(subscription.usage.invoices / subscription.limits.invoices) * 100}
              sx={{ mt: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Storage
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {subscription.usage.storageMB}MB / {subscription.limits.storageMB}MB
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(subscription.usage.storageMB / subscription.limits.storageMB) * 100}
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        {/* Plan Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {subscription.status === 'trial' ? 'Trial ends' : 'Plan renews'}:{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {subscription.daysRemaining} days remaining
          </Typography>
        </Box>

        {/* Features */}
        {subscription.features.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Plan Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {subscription.features.slice(0, 3).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                />
              ))}
              {subscription.features.length > 3 && (
                <Chip
                  label={`+${subscription.features.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}