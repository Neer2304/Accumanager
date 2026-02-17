// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Fade,
  Container,
  LinearProgress,
  Typography,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  GoogleProfileSkeleton,
  GoogleProfileHeader,
  GoogleProfileStats,
  GoogleProfileTabs,
  GoogleProfilePersonal,
  GoogleProfileBusiness,
  GoogleProfileNotifications,
  GoogleProfileSecurity,
  GoogleProfileSubscription,
  GoogleProfileUpgradeDialog,
  UserProfile,
  BusinessData,
  SubscriptionStatus,
  ProfileFormData,
  BusinessFormData,
  PasswordData,
  SnackbarState,
  PRICING_PLANS,
  getProgressColor,
} from '@/components/googleprofile';
import { TabPanel } from './GoogleProfileTabs';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    gstNumber: '',
    businessAddress: '',
  });
  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 600);
      setIsTablet(window.innerWidth >= 600 && window.innerWidth < 900);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

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
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load business data',
        severity: 'error'
      });
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
      } else if (profileResponse.status === 401) {
        logout();
      } else {
        const errorData = await profileResponse.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to load profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      setSnackbar({
        open: true,
        message: 'Network error while loading profile',
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
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Network error while updating profile',
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
          setSnackbar({
            open: true,
            message: data.message || 'Failed to update business',
            severity: 'error'
          });
        }
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to update business',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating business:', error);
      setSnackbar({
        open: true,
        message: 'Network error while updating business',
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
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to update preferences',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setSnackbar({
        open: true,
        message: 'Network error while updating preferences',
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

    setIsSaving(true);

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
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to change password',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setSnackbar({
        open: true,
        message: 'Network error while changing password',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
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
        
        // Poll for payment status
        checkPaymentStatus(paymentData.paymentId);
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to create payment',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setSnackbar({
        open: true,
        message: 'Network error while creating payment',
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
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);
  };

  const getUsagePercentage = (resource: string) => {
    if (!profile?.usage || !subscriptionStatus?.limits) return 0;
    
    let limit = 0;
    let usage = 0;
    
    switch (resource) {
      case 'products':
        limit = subscriptionStatus.limits.products;
        usage = profile.usage.products || 0;
        break;
      case 'customers':
        limit = subscriptionStatus.limits.customers;
        usage = profile.usage.customers || 0;
        break;
      case 'invoices':
        limit = subscriptionStatus.limits.invoices;
        usage = profile.usage.invoices || 0;
        break;
      case 'storage':
        limit = subscriptionStatus.limits.storageMB;
        usage = profile.usage.storageMB || 0;
        break;
      default:
        return 0;
    }
    
    return limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    initializeUserData();
  };

  if (isLoading) {
    return <GoogleProfileSkeleton />;
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <MainLayout title="Profile">
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
        </Container>
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
        <GoogleProfileHeader 
          profile={profile}
          businessName={businessData?.businessName}
          subscriptionStatus={subscriptionStatus}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
          onRefresh={handleRefreshData}
          onUpgradeClick={() => setUpgradeDialogOpen(true)}
        />

        {/* Snackbar Alert */}
        {snackbar.open && (
          <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 2 }}>
            <Fade in>
              <Alert 
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                sx={{ 
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
          </Box>
        )}

        <GoogleProfileStats 
          profile={profile}
          subscriptionStatus={subscriptionStatus}
          darkMode={darkMode}
          getUsagePercentage={getUsagePercentage}
        />

        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <GoogleProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isMobile={isMobile}
            darkMode={darkMode}
          >
            <TabPanel value={activeTab} index={0} darkMode={darkMode}>
              <GoogleProfilePersonal
                formData={formData}
                onFormChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                onSave={handleUpdateProfile}
                isSaving={isSaving}
                darkMode={darkMode}
                isMobile={isMobile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1} darkMode={darkMode}>
              <GoogleProfileBusiness
                formData={businessFormData}
                onFormChange={(field, value) => setBusinessFormData(prev => ({ ...prev, [field]: value }))}
                onSave={handleUpdateBusiness}
                isSaving={isSaving}
                darkMode={darkMode}
                isMobile={isMobile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2} darkMode={darkMode}>
              <GoogleProfileNotifications
                profile={profile}
                onPreferenceChange={handlePreferenceChange}
                darkMode={darkMode}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={3} darkMode={darkMode}>
              <GoogleProfileSecurity
                passwords={passwords}
                onPasswordChange={(field, value) => setPasswords(prev => ({ ...prev, [field]: value }))}
                onPasswordSave={handleChangePassword}
                showPassword={showPassword}
                onTogglePassword={(field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
                isSaving={isSaving}
                profile={profile}
                darkMode={darkMode}
                isMobile={isMobile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={4} darkMode={darkMode}>
              <GoogleProfileSubscription
                subscriptionStatus={subscriptionStatus}
                onUpgradeClick={() => setUpgradeDialogOpen(true)}
                darkMode={darkMode}
              />
            </TabPanel>
          </GoogleProfileTabs>
        </Box>

        <GoogleProfileUpgradeDialog
          open={upgradeDialogOpen}
          onClose={() => setUpgradeDialogOpen(false)}
          currentPlan={subscriptionStatus?.plan}
          onUpgrade={handleUpgradePlan}
          darkMode={darkMode}
        />
      </Box>
    </MainLayout>
  );
}