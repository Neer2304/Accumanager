// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Snackbar,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  Upgrade as UpgradeIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  businessName: string;
  gstNumber?: string;
  businessAddress?: string;
  createdAt: string;
  isActive: boolean;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    monthlyReports: boolean;
  };
  subscription?: {
    plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
    status: 'trial' | 'active' | 'expired' | 'cancelled';
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    autoRenew: boolean;
    features: any;
  };
  usage?: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PricingPlan {
  name: string;
  price: number;
  duration: number;
  features: string[];
  limits: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

const PRICING_PLANS: Record<string, PricingPlan> = {
  trial: {
    name: 'Free Trial',
    price: 0,
    duration: 14,
    features: [
      'Up to 50 products',
      'Up to 100 customers',
      'Basic inventory management',
      'Email support',
      '14-day free trial'
    ],
    limits: {
      products: 50,
      customers: 100,
      invoices: 200,
      storageMB: 100
    }
  },
  monthly: {
    name: 'Monthly Pro',
    price: 999,
    duration: 30,
    features: [
      'Up to 500 products',
      'Up to 1000 customers',
      'Advanced inventory management',
      'GST billing & reporting',
      'Priority email support',
      'Basic analytics'
    ],
    limits: {
      products: 500,
      customers: 1000,
      invoices: 5000,
      storageMB: 500
    }
  },
  quarterly: {
    name: 'Quarterly Business',
    price: 2599,
    duration: 90,
    features: [
      'Up to 2000 products',
      'Up to 5000 customers',
      'Advanced analytics & reports',
      'Multi-user access (up to 3)',
      'Phone + email support',
      'Custom branding'
    ],
    limits: {
      products: 2000,
      customers: 5000,
      invoices: 15000,
      storageMB: 2000
    }
  },
  yearly: {
    name: 'Yearly Enterprise',
    price: 8999,
    duration: 365,
    features: [
      'Unlimited products',
      'Unlimited customers',
      'Advanced AI analytics',
      'Multi-user access (up to 10)',
      '24/7 priority support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      products: 10000,
      customers: 25000,
      invoices: 50000,
      storageMB: 5000
    }
  }
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    gstNumber: '',
    businessAddress: '',
  });
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeUserData();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const initializeUserData = async () => {
    try {
      // Fetch complete profile with subscription data from API
      const profileResponse = await fetch('/api/profile', {
        credentials: 'include',
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Initialize form data from API response
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          businessName: profileData.businessName || '',
          gstNumber: profileData.gstNumber || '',
          businessAddress: profileData.businessAddress || '',
        });
        
        // Fetch subscription status using your API
        const subscriptionResponse = await fetch('/api/subscription/status', {
          credentials: 'include',
        });
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setSubscriptionStatus(subscriptionData.data);
        }
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load profile data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
      } else if (response.status === 401) {
        logout();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = async (preference: keyof UserProfile['preferences'], value: boolean) => {
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [preference]: value
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSnackbar({
          open: true,
          message: 'Preferences updated successfully',
          severity: 'success'
        });
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update preferences',
        severity: 'error'
      });
    }
  };

  const handleChangePassword = async (currentPassword: string, newPasswordValue: string) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword: newPasswordValue }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Password changed successfully',
          severity: 'success'
        });
      } else if (response.status === 401) {
        logout();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to change password',
        severity: 'error'
      });
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const result = await response.json();
        const paymentData = result.data;
        
        // Open UPI payment URL
        window.open(paymentData.upiUrl, '_blank');
        
        setSnackbar({
          open: true,
          message: `Payment initiated for ${PRICING_PLANS[plan].name}. Please complete the payment in your UPI app.`,
          severity: 'success'
        });
        
        setUpgradeDialogOpen(false);
        
        // Poll for payment status using your API
        checkPaymentStatus(paymentData.paymentId);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to initiate payment',
        severity: 'error'
      });
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/payments/status?paymentId=${paymentId}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          const status = result.status;
          
          if (status === 'completed') {
            clearInterval(poll);
            
            // Verify payment using your API
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                paymentId,
                upiTransactionId: result.upiTransactionId
              }),
            });
            
            setSnackbar({
              open: true,
              message: 'Payment completed successfully! Your subscription has been activated.',
              severity: 'success'
            });
            
            // Refresh subscription status
            const subscriptionResponse = await fetch('/api/subscription/status', {
              credentials: 'include',
            });
            
            if (subscriptionResponse.ok) {
              const subscriptionData = await subscriptionResponse.json();
              setSubscriptionStatus(subscriptionData.data);
            }
          } else if (status === 'failed') {
            clearInterval(poll);
            setSnackbar({
              open: true,
              message: 'Payment failed. Please try again.',
              severity: 'error'
            });
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setSnackbar({
            open: true,
            message: 'Payment verification timeout. Please check your payment status manually.',
            severity: 'warning'
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);
  };

  const getUsagePercentage = (resource: keyof typeof PRICING_PLANS['trial']['limits']) => {
    if (!profile?.usage || !subscriptionStatus?.limits) return 0;
    const limit = subscriptionStatus.limits[resource];
    const usage = profile.usage[resource] || 0;
    return limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'trial': return 'default';
      case 'monthly': return 'primary';
      case 'quarterly': return 'secondary';
      case 'yearly': return 'success';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Profile">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <MainLayout title="Profile">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Please log in to view your profile.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Profile">
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        {/* Header with Subscription Status */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'white',
                color: '#667eea',
                fontSize: '2rem',
              }}
            >
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {profile.name || 'User'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {profile.businessName || 'Business'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip label={profile.role || 'User'} size="small" sx={{ bgcolor: 'white', color: '#667eea' }} />
                <Chip 
                  label={profile.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  color={profile.isActive ? 'success' : 'default'}
                  sx={{ bgcolor: 'white' }}
                />
                {subscriptionStatus && (
                  <>
                    <Chip 
                      label={PRICING_PLANS[subscriptionStatus.plan]?.name || 'Free Trial'} 
                      size="small" 
                      color={getPlanColor(subscriptionStatus.plan) as any}
                      sx={{ bgcolor: 'white', color: '#667eea' }} 
                    />
                    <Chip 
                      label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={subscriptionStatus.isActive ? 'success' : 'error'}
                      sx={{ bgcolor: 'white' }}
                    />
                    {subscriptionStatus.daysRemaining !== undefined && (
                      <Chip 
                        label={`${subscriptionStatus.daysRemaining} days remaining`}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'white' }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<UpgradeIcon />}
              onClick={() => setUpgradeDialogOpen(true)}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Paper>

        {/* Usage Statistics */}
        {subscriptionStatus && profile.usage && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Statistics
              </Typography>
              <Grid container spacing={3}>
                {(['products', 'customers', 'invoices', 'storageMB'] as const).map((resource) => (
                  <Grid item xs={12} sm={6} md={3} key={resource}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {resource.charAt(0).toUpperCase() + resource.slice(1)}
                        {resource === 'storageMB' && ' (Storage)'}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {profile.usage![resource] || 0} / {subscriptionStatus.limits[resource]}
                        {resource === 'storageMB' && ' MB'}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={getUsagePercentage(resource)}
                        color={
                          getUsagePercentage(resource) > 90 ? 'error' :
                          getUsagePercentage(resource) > 75 ? 'warning' : 'primary'
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {Math.round(getUsagePercentage(resource))}% used
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Card>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PersonIcon />} label="Personal Info" />
            <Tab icon={<BusinessIcon />} label="Business Details" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<PaymentIcon />} label="Subscription" />
          </Tabs>

          {/* Personal Info Tab */}
          <TabPanel value={activeTab} index={0}>
            <form onSubmit={handleUpdateProfile}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Personal Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </form>
          </TabPanel>

          {/* Business Details Tab */}
          <TabPanel value={activeTab} index={1}>
            <form onSubmit={handleUpdateProfile}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Business Information
                </Typography>

                <TextField
                  fullWidth
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  required
                />

                <TextField
                  fullWidth
                  label="GST Number"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                  placeholder="e.g., 07AABCU9603R1ZM"
                />

                <TextField
                  fullWidth
                  label="Business Address"
                  multiline
                  rows={3}
                  value={formData.businessAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </form>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Notification Preferences
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences?.emailNotifications || false}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences?.smsNotifications || false}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                  />
                }
                label="SMS Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences?.lowStockAlerts || false}
                    onChange={(e) => handlePreferenceChange('lowStockAlerts', e.target.checked)}
                  />
                }
                label="Low Stock Alerts"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences?.monthlyReports || false}
                    onChange={(e) => handlePreferenceChange('monthlyReports', e.target.checked)}
                  />
                }
                label="Monthly Reports"
              />
            </Box>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Security Settings
              </Typography>

              <PasswordChangeForm onChangePassword={handleChangePassword} />

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Session Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: {new Date(profile.createdAt).toLocaleDateString('en-IN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last login: {new Date().toLocaleDateString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Subscription Tab */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Current Subscription
                </Typography>
                {subscriptionStatus ? (
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="h6">
                          {PRICING_PLANS[subscriptionStatus.plan]?.name || 'Free Trial'}
                        </Typography>
                        <Typography color="text.secondary">
                          Status: {subscriptionStatus.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                        {subscriptionStatus.currentPeriodEnd && (
                          <Typography color="text.secondary">
                            {subscriptionStatus.isActive ? 'Renews on' : 'Expired on'}: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-IN')}
                          </Typography>
                        )}
                        {subscriptionStatus.daysRemaining !== undefined && (
                          <Typography color="text.secondary">
                            {subscriptionStatus.daysRemaining} days remaining
                          </Typography>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<UpgradeIcon />}
                        onClick={() => setUpgradeDialogOpen(true)}
                      >
                        Upgrade Plan
                      </Button>
                    </Box>
                  </Card>
                ) : (
                  <Typography color="text.secondary">Loading subscription details...</Typography>
                )}
              </Box>

              {subscriptionStatus && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Current Plan Features
                  </Typography>
                  <List>
                    {PRICING_PLANS[subscriptionStatus.plan]?.features.map((feature: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </TabPanel>
        </Card>

        {/* Upgrade Plan Dialog */}
        <Dialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" fontWeight="bold">
              Upgrade Your Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the plan that best fits your business needs
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {Object.entries(PRICING_PLANS).map(([planKey, plan]) => {
                if (planKey === 'trial') return null;
                
                const isCurrentPlan = subscriptionStatus?.plan === planKey;
                const isRecommended = planKey === 'quarterly';
                
                return (
                  <Grid item xs={12} md={6} lg={3} key={planKey}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        border: isCurrentPlan ? 2 : 1,
                        borderColor: isCurrentPlan ? 'primary.main' : 'divider',
                        position: 'relative',
                        ...(isRecommended && {
                          border: 2,
                          borderColor: 'secondary.main',
                        })
                      }}
                    >
                      {isRecommended && (
                        <Chip
                          label="Most Popular"
                          color="secondary"
                          size="small"
                          sx={{ position: 'absolute', top: 16, right: 16 }}
                        />
                      )}
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {plan.name}
                        </Typography>
                        <Typography variant="h4" gutterBottom color="primary.main">
                          ₹{plan.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {planKey === 'monthly' && 'per month'}
                          {planKey === 'quarterly' && 'per quarter'}
                          {planKey === 'yearly' && 'per year'}
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <List dense sx={{ flex: 1 }}>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Button
                          variant={isCurrentPlan ? "outlined" : "contained"}
                          fullWidth
                          disabled={isCurrentPlan}
                          onClick={() => handleUpgradePlan(planKey)}
                          sx={{ mt: 2 }}
                        >
                          {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpgradeDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}

// Password Change Component (unchanged)
function PasswordChangeForm({ onChangePassword }: { onChangePassword: (currentPassword: string, newPasswordValue: string) => void }) {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChanging, setIsChanging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsChanging(true);
    await onChangePassword(passwords.currentPassword, passwords.newPassword);
    setIsChanging(false);
    
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          type="password"
          label="Current Password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
          required
        />
        
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
          required
        />
        
        <TextField
          fullWidth
          type="password"
          label="Confirm New Password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isChanging}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isChanging ? 'Changing...' : 'Change Password'}
        </Button>
      </Box>
    </form>
  );
}