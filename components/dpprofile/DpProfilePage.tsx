/* eslint-disable @typescript-eslint/no-unused-vars */
// components/dpprofile/DpProfilePage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Alert, Fade, useTheme, useMediaQuery } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  DpProfileSkeleton,
  DpProfileHeader,
  DpProfileStats,
  DpProfileTabs,
  DpProfilePersonal,
  DpProfileBusiness,
  DpProfileNotifications,
  DpProfileSecurity,
  DpProfileSubscription,
  DpProfileUpgradeDialog,
  UserProfile,
  BusinessData,
  SubscriptionStatus,
  ProfileFormData,
  BusinessFormData,
  PasswordData,
  SnackbarState,
  PRICING_PLANS,
  getProgressColor,
  dpColors,
} from './index';

function TabPanel({ children, value, index, darkMode }: { children: React.ReactNode; value: number; index: number; darkMode?: boolean }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ padding: value === index ? '24px' : 0 }}>
      {value === index && children}
    </div>
  );
}

export default function DpProfilePage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState<ProfileFormData>({ name: '', email: '', phone: '', businessName: '', gstNumber: '', businessAddress: '' });
  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({ businessName: '', address: '', city: '', state: '', pincode: '', country: 'India', gstNumber: '', phone: '', email: '' });
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState<PasswordData>({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeUserData();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/business', { credentials: 'include' });
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
      setSnackbar({ open: true, message: 'Failed to load business data', severity: 'error' });
    }
  };

  const initializeUserData = async () => {
    try {
      const profileResponse = await fetch('/api/profile', { credentials: 'include' });
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
        const subscriptionResponse = await fetch('/api/subscription/status', { credentials: 'include' });
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setSubscriptionStatus(subscriptionData.data);
        }
      } else if (profileResponse.status === 401) {
        logout();
      } else {
        const errorData = await profileResponse.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to load profile', severity: 'error' });
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      setSnackbar({ open: true, message: 'Network error while loading profile', severity: 'error' });
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSnackbar({ open: true, message: 'Profile updated! Maximum effort! 🦸', severity: 'success' });
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to update profile', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error while updating profile', severity: 'error' });
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(businessFormData),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.business) {
          setBusinessData(data.business);
          setSnackbar({ open: true, message: 'Business details updated! Chimichanga time! 🌯', severity: 'success' });
        }
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to update business', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error while updating business', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = async (preference: keyof UserProfile['preferences'], value: boolean) => {
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [preference]: value }),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSnackbar({ open: true, message: 'Preferences updated! 🎯', severity: 'success' });
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to update preferences', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error while updating preferences', severity: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match! Try again!', severity: 'error' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters! Maximum effort!', severity: 'error' });
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Password changed! Now you\'re secure like a vault! 🔒', severity: 'success' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else if (response.status === 401) {
        logout();
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to change password', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error while changing password', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });
      if (response.ok) {
        const result = await response.json();
        window.open(result.data.upiUrl, '_blank');
        setSnackbar({ open: true, message: `Payment initiated for ${PRICING_PLANS[plan].name}! Chimichanga celebration incoming! 🎉`, severity: 'success' });
        setUpgradeDialogOpen(false);
      } else {
        const errorData = await response.json();
        setSnackbar({ open: true, message: errorData.message || 'Failed to create payment', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error while creating payment', severity: 'error' });
    }
  };

  const getUsagePercentage = (resource: string) => {
    if (!profile?.usage || !subscriptionStatus?.limits) return 0;
    const limits: Record<string, number> = {
      products: subscriptionStatus.limits.products,
      customers: subscriptionStatus.limits.customers,
      invoices: subscriptionStatus.limits.invoices,
      storage: subscriptionStatus.limits.storageMB,
    };
    const usage: Record<string, number> = {
      products: profile.usage.products || 0,
      customers: profile.usage.customers || 0,
      invoices: profile.usage.invoices || 0,
      storage: profile.usage.storageMB || 0,
    };
    return limits[resource] > 0 ? Math.min((usage[resource] / limits[resource]) * 100, 100) : 0;
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    initializeUserData();
  };

  if (isLoading) {
    return <DpProfileSkeleton />;
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <MainLayout title="Profile">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ borderRadius: '12px', border: `2px solid ${dpColors.error}` }}>Please log in to view your profile! 🦸</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Profile">
      <Box sx={{ minHeight: '100vh', backgroundColor: dpColors.bg }}>
        <DpProfileHeader
          profile={profile}
          businessName={businessData?.businessName}
          subscriptionStatus={subscriptionStatus}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
          onRefresh={handleRefreshData}
          onUpgradeClick={() => setUpgradeDialogOpen(true)}
        />

        {snackbar.open && (
          <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 2 }}>
            <Fade in>
              <Alert
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                sx={{ borderRadius: '12px', backgroundColor: dpColors.surface, border: `2px solid ${snackbar.severity === 'success' ? '#34a853' : dpColors.error}`, color: dpColors.ink }}
              >
                {snackbar.severity === 'success' ? '🦸 ' : '💀 '}{snackbar.message}
              </Alert>
            </Fade>
          </Box>
        )}

        <DpProfileStats
          profile={profile}
          subscriptionStatus={subscriptionStatus}
          darkMode={darkMode}
          getUsagePercentage={getUsagePercentage}
        />

        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <DpProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} darkMode={darkMode}>
            <TabPanel value={activeTab} index={0} darkMode={darkMode}>
              <DpProfilePersonal
                formData={formData}
                onFormChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                onSave={handleUpdateProfile}
                isSaving={isSaving}
                darkMode={darkMode}
                isMobile={isMobile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1} darkMode={darkMode}>
              <DpProfileBusiness
                formData={businessFormData}
                onFormChange={(field, value) => setBusinessFormData(prev => ({ ...prev, [field]: value }))}
                onSave={handleUpdateBusiness}
                isSaving={isSaving}
                darkMode={darkMode}
                isMobile={isMobile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2} darkMode={darkMode}>
              <DpProfileNotifications
                profile={profile}
                onPreferenceChange={handlePreferenceChange}
                darkMode={darkMode}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={3} darkMode={darkMode}>
              <DpProfileSecurity
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
              <DpProfileSubscription
                subscriptionStatus={subscriptionStatus}
                onUpgradeClick={() => setUpgradeDialogOpen(true)}
                darkMode={darkMode}
              />
            </TabPanel>
          </DpProfileTabs>
        </Box>

        <DpProfileUpgradeDialog
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