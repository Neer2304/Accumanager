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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  alpha,
  Stack,
  InputAdornment,
  IconButton,
  Tooltip,
  Container,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  Upgrade as UpgradeIcon,
  Check as CheckIcon,
  Home as HomeIcon,
  Refresh,
  Download,
  Warning,
  Error,
  CheckCircle,
  Info,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Phone,
  LocationOn,
  BusinessCenter,
  Receipt,
  Storage,
  Group,
  Schedule,
  CalendarToday,
  TrendingUp,
  CreditCard,
  ArrowForward,
  Star,
  Edit,
  Save,
  Cancel,
  CloudUpload,
  Delete,
  MoreVert,
  HelpOutline,
} from '@mui/icons-material';
import Link from 'next/link';
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
  popular?: boolean;
}

interface BusinessData {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber: string;
  phone: string;
  email: string;
  logo: string;
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
    },
    popular: true
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
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
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
  const [businessFormData, setBusinessFormData] = useState({
    businessName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gstNumber: '',
    phone: '',
    email: '',
  });
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeUserData();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/business', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.business) {
          setBusinessData(data.business);
          
          setBusinessFormData({
            businessName: data.business.businessName || '',
            address: data.business.address || '',
            city: data.business.city || '',
            state: data.business.state || '',
            pincode: data.business.pincode || '',
            country: data.business.country || 'India',
            gstNumber: data.business.gstNumber || '',
            phone: data.business.phone || '',
            email: data.business.email || '',
          });
        }
      } else {
        console.warn('Failed to fetch business data');
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    }
  };

  const initializeUserData = async () => {
    try {
      const profileResponse = await fetch('/api/profile', {
        credentials: 'include',
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          businessName: profileData.businessName || '',
          gstNumber: profileData.gstNumber || '',
          businessAddress: profileData.businessAddress || '',
        });
        
        await fetchBusinessData();
        
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

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(businessFormData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.business) {
          setBusinessData(data.business);
          setSnackbar({
            open: true,
            message: 'Business details updated successfully',
            severity: 'success'
          });
        } else {
          throw new Error('Failed to update business');
        }
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business');
      }
    } catch (error) {
      console.error('Error updating business:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to update business',
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

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters long',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          currentPassword: passwords.currentPassword, 
          newPassword: passwords.newPassword 
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Password changed successfully',
          severity: 'success'
        });
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
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
        
        window.open(paymentData.upiUrl, '_blank');
        
        setSnackbar({
          open: true,
          message: `Payment initiated for ${PRICING_PLANS[plan].name}. Please complete the payment in your UPI app.`,
          severity: 'success'
        });
        
        setUpgradeDialogOpen(false);
        
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
            severity: 'error'
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
      case 'trial': return '#9aa0a6';
      case 'monthly': return '#4285f4';
      case 'quarterly': return '#34a853';
      case 'yearly': return '#fbbc04';
      default: return '#9aa0a6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34a853';
      case 'inactive': return '#9aa0a6';
      case 'trial': return '#4285f4';
      case 'expired': return '#ea4335';
      case 'cancelled': return '#5f6368';
      default: return '#9aa0a6';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'active': return darkMode ? '#0d652d' : '#d9f0e1';
      case 'inactive': return darkMode ? '#3c4043' : '#f5f5f5';
      case 'trial': return darkMode ? '#0d3064' : '#e3f2fd';
      case 'expired': return darkMode ? '#420000' : '#fce8e6';
      case 'cancelled': return darkMode ? '#3c4043' : '#f5f5f5';
      default: return darkMode ? '#3c4043' : '#f5f5f5';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return '#ea4335';
    if (percentage > 75) return '#fbbc04';
    return '#34a853';
  };

  const handleRefreshData = () => {
    initializeUserData();
  };

  if (isLoading) {
    return (
      <MainLayout title="Profile">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading your profile...
            </Typography>
            <LinearProgress sx={{ width: 200, mx: 'auto' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <MainLayout title="Profile">
        <Box sx={{ 
          p: 3,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          minHeight: '100vh',
        }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '12px',
              backgroundColor: darkMode ? '#422006' : '#fef7e0',
              color: darkMode ? '#fbbc04' : '#f57c00',
              border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80',
            }}
          >
            Please log in to view your profile.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Profile">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Fade in>
            <Breadcrumbs sx={{ 
              mb: { xs: 1, sm: 2 }, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
            }}>
              <MuiLink 
                component={Link} 
                href="/dashboard" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none', 
                  color: darkMode ? '#9aa0a6' : '#5f6368', 
                  fontWeight: 300, 
                  "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
                Dashboard
              </MuiLink>
              <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
                Profile
              </Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 1.5, sm: 2 }, 
              mb: { xs: 2, sm: 3 } 
            }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: { xs: 60, sm: 80, md: 100 },
                      height: { xs: 60, sm: 80, md: 100 },
                      bgcolor: darkMode ? '#4285f4' : '#e3f2fd',
                      color: darkMode ? '#e8eaed' : '#1a73e8',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 500,
                      border: darkMode ? '3px solid #3c4043' : '3px solid #ffffff',
                      boxShadow: darkMode 
                        ? '0 4px 20px rgba(66, 133, 244, 0.3)' 
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} 
                      fontWeight={500} 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                      }}
                    >
                      {profile.name || 'User'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368', 
                        fontWeight: 300,
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' },
                        lineHeight: 1.4,
                      }}
                    >
                      {businessData?.businessName || profile.businessName || 'Business'}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={profile.role || 'User'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: darkMode ? '#3c4043' : '#f5f5f5',
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }} 
                  />
                  <Chip 
                    label={profile.isActive ? 'Active' : 'Inactive'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: profile.isActive 
                        ? (darkMode ? '#0d652d' : '#d9f0e1')
                        : (darkMode ? '#3c4043' : '#f5f5f5'),
                      color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368'),
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }} 
                  />
                  {subscriptionStatus && (
                    <>
                      <Chip 
                        label={PRICING_PLANS[subscriptionStatus.plan]?.name || 'Free Trial'} 
                        size="small" 
                        sx={{ 
                          backgroundColor: alpha(getPlanColor(subscriptionStatus.plan), 0.1),
                          color: getPlanColor(subscriptionStatus.plan),
                          fontWeight: 500,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }} 
                      />
                      <Chip 
                        label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                        size="small" 
                        sx={{ 
                          backgroundColor: subscriptionStatus.isActive 
                            ? (darkMode ? '#0d652d' : '#d9f0e1')
                            : (darkMode ? '#420000' : '#fce8e6'),
                          color: subscriptionStatus.isActive ? '#34a853' : '#ea4335',
                          fontWeight: 500,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }} 
                      />
                      {subscriptionStatus.daysRemaining !== undefined && (
                        <Chip 
                          label={`${subscriptionStatus.daysRemaining} days remaining`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: subscriptionStatus.daysRemaining > 7 ? '#34a853' : '#fbbc04',
                            color: subscriptionStatus.daysRemaining > 7 
                              ? (darkMode ? '#34a853' : '#0d652d')
                              : (darkMode ? '#fbbc04' : '#653c00'),
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        />
                      )}
                    </>
                  )}
                </Stack>
              </Box>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1} 
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button 
                  startIcon={<Refresh />} 
                  onClick={handleRefreshData}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    borderRadius: '12px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    "&:hover": { 
                      borderColor: darkMode ? '#5f6368' : '#202124',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    },
                  }}
                >
                  {isMobile ? '' : 'Refresh'}
                </Button>

                <Button 
                  startIcon={<UpgradeIcon />} 
                  onClick={() => setUpgradeDialogOpen(true)}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    borderRadius: '12px',
                    backgroundColor: '#34a853',
                    color: 'white',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    "&:hover": { 
                      backgroundColor: '#2d9248',
                      boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                    },
                  }}
                >
                  {isMobile ? '' : 'Upgrade Plan'}
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Box>

        {/* Error Alert */}
        {snackbar.open && (
          <Fade in>
            <Alert 
              severity={snackbar.severity}
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              sx={{ 
                mx: { xs: 1, sm: 2, md: 3 },
                mt: 2,
                borderRadius: '12px',
                backgroundColor: snackbar.severity === 'error' 
                  ? (darkMode ? '#422006' : '#fef7e0')
                  : (darkMode ? '#0d652d' : '#d9f0e1'),
                color: snackbar.severity === 'error' 
                  ? (darkMode ? '#fbbc04' : '#f57c00')
                  : (darkMode ? '#34a853' : '#0d652d'),
                border: snackbar.severity === 'error'
                  ? (darkMode ? '1px solid #653c00' : '1px solid #ffcc80')
                  : (darkMode ? '1px solid #0d652d' : '1px solid #c1e0d2'),
              }}
            >
              {snackbar.message}
            </Alert>
          </Fade>
        )}

        {/* Usage Statistics */}
        {subscriptionStatus && profile.usage && (
          <Fade in timeout={400}>
            <Box sx={{ 
              p: { xs: 1, sm: 2, md: 3 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 },
            }}>
              {([
                { 
                  title: 'Products', 
                  value: profile.usage.products || 0, 
                  limit: subscriptionStatus.limits.products,
                  icon: <BusinessCenter />, 
                  color: '#4285f4',
                  unit: '',
                },
                { 
                  title: 'Customers', 
                  value: profile.usage.customers || 0, 
                  limit: subscriptionStatus.limits.customers,
                  icon: <Group />, 
                  color: '#34a853',
                  unit: '',
                },
                { 
                  title: 'Invoices', 
                  value: profile.usage.invoices || 0, 
                  limit: subscriptionStatus.limits.invoices,
                  icon: <Receipt />, 
                  color: '#fbbc04',
                  unit: '',
                },
                { 
                  title: 'Storage', 
                  value: profile.usage.storageMB || 0, 
                  limit: subscriptionStatus.limits.storageMB,
                  icon: <Storage />, 
                  color: '#ea4335',
                  unit: 'MB',
                },
              ] as const).map((stat, index) => {
                const percentage = getUsagePercentage(stat.title.toLowerCase() as any);
                return (
                  <Paper 
                    key={`stat-${index}`}
                    sx={{ 
                      flex: '1 1 calc(25% - 24px)', 
                      minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' },
                      p: { xs: 1.5, sm: 2, md: 3 }, 
                      borderRadius: '16px', 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${alpha(stat.color, 0.2)}`,
                      background: darkMode 
                        ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                        : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ 
                          p: { xs: 0.75, sm: 1 }, 
                          borderRadius: '10px', 
                          backgroundColor: alpha(stat.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {React.cloneElement(stat.icon, { 
                            sx: { 
                              fontSize: { xs: 20, sm: 24, md: 28 }, 
                              color: stat.color,
                            } 
                          })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368', 
                              fontWeight: 400,
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              display: 'block',
                              lineHeight: 1.2,
                            }}
                          >
                            {stat.title}
                          </Typography>
                          <Typography 
                            variant={isMobile ? "h6" : "h5"}
                            sx={{ 
                              color: stat.color, 
                              fontWeight: 600,
                              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                              lineHeight: 1.2,
                            }}
                          >
                            {stat.value.toLocaleString()}{stat.unit} / {stat.limit.toLocaleString()}{stat.unit}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                            }}
                          >
                            Usage
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: getProgressColor(percentage),
                              fontWeight: 500,
                              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                            }}
                          >
                            {Math.round(percentage)}%
                          </Typography>
                        </Stack>
                        <Box sx={{ 
                          position: 'relative', 
                          height: 6, 
                          backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}>
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${percentage}%`,
                              backgroundColor: getProgressColor(percentage),
                              borderRadius: 3,
                            }} 
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          </Fade>
        )}

        {/* Main Content */}
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Paper
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              }}
            >
              <Tab 
                icon={<PersonIcon />} 
                label={isMobile ? "" : "Personal Info"} 
                sx={{ 
                  minHeight: 64,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
                }} 
              />
              <Tab 
                icon={<BusinessIcon />} 
                label={isMobile ? "" : "Business Details"} 
                sx={{ 
                  minHeight: 64,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
                }} 
              />
              <Tab 
                icon={<NotificationsIcon />} 
                label={isMobile ? "" : "Notifications"} 
                sx={{ 
                  minHeight: 64,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
                }} 
              />
              <Tab 
                icon={<SecurityIcon />} 
                label={isMobile ? "" : "Security"} 
                sx={{ 
                  minHeight: 64,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
                }} 
              />
              <Tab 
                icon={<PaymentIcon />} 
                label={isMobile ? "" : "Subscription"} 
                sx={{ 
                  minHeight: 64,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': { color: darkMode ? '#8ab4f8' : '#1a73e8' },
                }} 
              />
            </Tabs>

            {/* Personal Info Tab */}
            <TabPanel value={activeTab} index={0}>
              <form onSubmit={handleUpdateProfile}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        color: darkMode ? '#e8eaed' : '#202124',
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      }}
                    >
                      Personal Information
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                      }}
                    >
                      Update your personal details and contact information
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSaving}
                      startIcon={isSaving ? null : <Save />}
                      sx={{ 
                        borderRadius: '12px',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        fontWeight: 500,
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        "&:hover": {
                          backgroundColor: '#3367d6',
                          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                        },
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </TabPanel>

            {/* Business Details Tab */}
            <TabPanel value={activeTab} index={1}>
              <form onSubmit={handleUpdateBusiness}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        color: darkMode ? '#e8eaed' : '#202124',
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      }}
                    >
                      Business Information
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                      }}
                    >
                      Manage your business details and registration information
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  <TextField
                    fullWidth
                    label="Business Name"
                    value={businessFormData.businessName}
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Business Address"
                    multiline
                    rows={2}
                    value={businessFormData.address}
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={businessFormData.city}
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="State"
                      value={businessFormData.state}
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, state: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Pincode"
                      value={businessFormData.pincode}
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Country"
                    value={businessFormData.country}
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, country: e.target.value }))}
                    required
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="GST Number"
                    value={businessFormData.gstNumber}
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                    placeholder="e.g., 07AABCU9603R1ZM"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Business Phone"
                      value={businessFormData.phone}
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Business Email"
                      type="email"
                      value={businessFormData.email}
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSaving}
                      startIcon={isSaving ? null : <Save />}
                      sx={{ 
                        borderRadius: '12px',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        fontWeight: 500,
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        "&:hover": {
                          backgroundColor: '#3367d6',
                          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                        },
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Business Details'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    }}
                  >
                    Notification Preferences
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    }}
                  >
                    Control how and when you receive notifications
                  </Typography>
                </Box>
                
                <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Stack spacing={2}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.preferences?.emailNotifications || false}
                          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                            Email Notifications
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Receive important updates and reports via email
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.preferences?.smsNotifications || false}
                          onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                            SMS Notifications
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Get instant alerts via SMS
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.preferences?.lowStockAlerts || false}
                          onChange={(e) => handlePreferenceChange('lowStockAlerts', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                            Low Stock Alerts
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Get notified when inventory is running low
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profile.preferences?.monthlyReports || false}
                          onChange={(e) => handlePreferenceChange('monthlyReports', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                            Monthly Reports
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Receive comprehensive monthly business reports
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                </Stack>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    }}
                  >
                    Security Settings
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    }}
                  >
                    Manage your account security and password
                  </Typography>
                </Box>
                
                <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                {/* Change Password */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                    Change Password
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      label="Current Password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                            >
                              {showCurrentPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm New Password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        },
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                        sx={{ 
                          borderRadius: '12px',
                          backgroundColor: '#4285f4',
                          color: 'white',
                          fontWeight: 500,
                          px: { xs: 2, sm: 3, md: 4 },
                          py: { xs: 0.75, sm: 1 },
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                          "&:hover": {
                            backgroundColor: '#3367d6',
                            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                          },
                        }}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                {/* Session Information */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                    Account Information
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}
                  >
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Member since
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                          {new Date(profile.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Last login
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                          {new Date().toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Account status
                        </Typography>
                        <Chip 
                          label={profile.isActive ? 'Active' : 'Inactive'} 
                          size="small" 
                          sx={{ 
                            backgroundColor: profile.isActive 
                              ? (darkMode ? '#0d652d' : '#d9f0e1')
                              : (darkMode ? '#3c4043' : '#f5f5f5'),
                            color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368'),
                            fontWeight: 500,
                          }} 
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            {/* Subscription Tab */}
            <TabPanel value={activeTab} index={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    }}
                  >
                    Subscription Details
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    }}
                  >
                    Manage your subscription plan and billing information
                  </Typography>
                </Box>
                
                <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                {/* Current Subscription */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                    Current Subscription
                  </Typography>
                  {subscriptionStatus ? (
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                        position: 'relative',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: getPlanColor(subscriptionStatus.plan) }}>
                              {PRICING_PLANS[subscriptionStatus.plan]?.name || 'Free Trial'}
                            </Typography>
                            <Chip 
                              label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                              size="small" 
                              sx={{ 
                                backgroundColor: subscriptionStatus.isActive 
                                  ? (darkMode ? '#0d652d' : '#d9f0e1')
                                  : (darkMode ? '#420000' : '#fce8e6'),
                                color: subscriptionStatus.isActive ? '#34a853' : '#ea4335',
                                fontWeight: 500,
                              }} 
                            />
                          </Box>
                          
                          <Stack spacing={0.5}>
                            {subscriptionStatus.currentPeriodEnd && (
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {subscriptionStatus.isActive ? 'Renews on' : 'Expired on'}: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-IN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                            )}
                            {subscriptionStatus.daysRemaining !== undefined && (
                              <Typography variant="body2" sx={{ 
                                color: subscriptionStatus.daysRemaining > 7 
                                  ? (darkMode ? '#34a853' : '#0d652d')
                                  : (darkMode ? '#fbbc04' : '#653c00'),
                                fontWeight: 500,
                              }}>
                                {subscriptionStatus.daysRemaining} days remaining
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        
                        <Button
                          variant="contained"
                          startIcon={<UpgradeIcon />}
                          onClick={() => setUpgradeDialogOpen(true)}
                          sx={{ 
                            borderRadius: '12px',
                            backgroundColor: '#4285f4',
                            color: 'white',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            "&:hover": {
                              backgroundColor: '#3367d6',
                              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                            },
                          }}
                        >
                          Upgrade Plan
                        </Button>
                      </Box>
                    </Paper>
                  ) : (
                    <Typography color="text.secondary">Loading subscription details...</Typography>
                  )}
                </Box>

                {subscriptionStatus && (
                  <>
                    <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                    {/* Current Plan Features */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                        Current Plan Features
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
                        gap: 2 
                      }}>
                        {PRICING_PLANS[subscriptionStatus.plan]?.features.map((feature: string, index: number) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1,
                            }}
                          >
                            <CheckIcon fontSize="small" sx={{ color: '#34a853', mt: 0.25 }} />
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {feature}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Box>

        {/* Upgrade Plan Dialog */}
        <Dialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              maxHeight: '90vh',
            }
          }}
        >
          <DialogTitle sx={{ 
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            py: 2,
            px: 3,
          }}>
            <Box>
              <Typography variant="h5" component="div" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Upgrade Your Plan
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                Choose the plan that best fits your business needs
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, 
              gap: 3,
              mt: 1,
            }}>
              {Object.entries(PRICING_PLANS).map(([planKey, plan]) => {
                if (planKey === 'trial') return null;
                
                const isCurrentPlan = subscriptionStatus?.plan === planKey;
                
                return (
                  <Paper 
                    key={planKey}
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      border: isCurrentPlan ? 2 : 1,
                      borderColor: isCurrentPlan 
                        ? '#4285f4' 
                        : (darkMode ? '#3c4043' : '#dadce0'),
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: darkMode 
                          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                          : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      },
                      ...(plan.popular && {
                        border: 2,
                        borderColor: '#34a853',
                      })
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: '#34a853',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderBottomLeftRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Star fontSize="inherit" />
                        Most Popular
                      </Box>
                    )}
                    
                    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                          {plan.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: getPlanColor(planKey) }}>
                            ₹{plan.price}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {planKey === 'monthly' && '/month'}
                            {planKey === 'quarterly' && '/quarter'}
                            {planKey === 'yearly' && '/year'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0', mb: 3 }} />
                      
                      <Box sx={{ flex: 1, mb: 3 }}>
                        <List dense disablePadding>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckIcon fontSize="small" sx={{ color: '#34a853' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature} 
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  sx: { color: darkMode ? '#e8eaed' : '#202124' }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      <Button
                        variant={isCurrentPlan ? "outlined" : "contained"}
                        fullWidth
                        disabled={isCurrentPlan}
                        onClick={() => handleUpgradePlan(planKey)}
                        sx={{ 
                          borderRadius: '12px',
                          backgroundColor: isCurrentPlan ? 'transparent' : '#4285f4',
                          color: isCurrentPlan 
                            ? (darkMode ? '#8ab4f8' : '#1a73e8')
                            : 'white',
                          borderColor: isCurrentPlan 
                            ? (darkMode ? '#8ab4f8' : '#1a73e8')
                            : 'transparent',
                          fontWeight: 500,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: isCurrentPlan 
                              ? (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)')
                              : '#3367d6',
                            borderColor: isCurrentPlan 
                              ? (darkMode ? '#8ab4f8' : '#1a73e8')
                              : 'transparent',
                          },
                        }}
                      >
                        {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            px: 3,
            py: 2,
            borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          }}>
            <Button 
              onClick={() => setUpgradeDialogOpen(false)}
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 500,
                borderRadius: '12px',
                px: 3,
                py: 1,
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}