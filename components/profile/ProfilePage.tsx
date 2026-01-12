'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { PROFILE_CONTENT } from './ProfileContent';
import { HeaderSection } from './sections/HeaderSection';
import { UsageStatsSection } from './sections/UsageStatsSection';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { BusinessInfoSection } from './sections/BusinessInfoSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { SecuritySection } from './sections/SecuritySection';
import { SubscriptionSection } from './sections/SubscriptionSection';
import { UpgradeDialog } from './sections/UpgradeDialog';
import { ProfileIcon } from './ProfileIcons';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
  const [activeTab, setActiveTab] = useState(0);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  
  const {
    profile,
    subscriptionStatus,
    loading,
    saving,
    error,
    success,
    formData,
    setFormData,
    updateProfile,
    updateBusinessProfile,
    updatePreference,
    changePassword,
    upgradePlan,
    checkPaymentStatus,
    getUsagePercentage,
    getPlanColor,
    setError,
    setSuccess,
  } = useProfileData();

  const { page } = PROFILE_CONTENT;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
  };

  const handleBusinessProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessProfile({
      businessName: formData.businessName,
      gstNumber: formData.gstNumber,
      businessAddress: formData.businessAddress,
      businessCity: formData.businessCity,
      businessState: formData.businessState,
      businessPincode: formData.businessPincode,
      businessCountry: formData.businessCountry,
      businessLogo: formData.businessLogo,
    });
  };

  const handlePreferenceChange = async (preference: string, value: boolean) => {
    await updatePreference(preference, value);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    return await changePassword(currentPassword, newPassword);
  };

  const handleUpgradeClick = async (plan: string) => {
    const paymentData = await upgradePlan(plan);
    if (paymentData) {
      window.open(paymentData.upiUrl, '_blank');
      setUpgradeDialogOpen(false);
      checkPaymentStatus(paymentData.paymentId);
    }
  };

  if (loading) {
    return (
      <MainLayout title={page.title}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>{page.loading}</Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout title={page.title}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {page.loginRequired}
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={page.title}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <HeaderSection
            profile={profile}
            subscriptionStatus={subscriptionStatus}
            getPlanColor={getPlanColor}
            onUpgradeClick={() => setUpgradeDialogOpen(true)}
          />

          <UsageStatsSection
            profile={profile}
            subscriptionStatus={subscriptionStatus}
            getUsagePercentage={getUsagePercentage}
          />

          <Card sx={{ border: 'none', boxShadow: 'none' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                px: 2,
                pt: 2 
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                icon={<ProfileIcon name="Person" />} 
                iconPosition="start"
                label="Personal Info" 
              />
              <Tab 
                icon={<ProfileIcon name="Business" />} 
                iconPosition="start"
                label="Business Details" 
              />
              <Tab 
                icon={<ProfileIcon name="Notifications" />} 
                iconPosition="start"
                label="Notifications" 
              />
              <Tab 
                icon={<ProfileIcon name="Security" />} 
                iconPosition="start"
                label="Security" 
              />
              <Tab 
                icon={<ProfileIcon name="Payment" />} 
                iconPosition="start"
                label="Subscription" 
              />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <PersonalInfoSection
                formData={{
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                }}
                saving={saving}
                onFormChange={handleFormChange}
                onSubmit={handlePersonalProfileSubmit}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <BusinessInfoSection
                formData={{
                  businessName: formData.businessName,
                  gstNumber: formData.gstNumber,
                  businessAddress: formData.businessAddress,
                  city: formData.businessCity,
                  state: formData.businessState,
                  pincode: formData.businessPincode,
                  country: formData.businessCountry,
                  phone: formData.phone,
                  email: formData.email,
                  logo: formData.businessLogo,
                }}
                saving={saving}
                onFormChange={handleFormChange}
                onSubmit={handleBusinessProfileSubmit}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <NotificationsSection
                profile={profile}
                onPreferenceChange={handlePreferenceChange}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <SecuritySection
                profile={profile}
                onChangePassword={handlePasswordChange}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <SubscriptionSection
                subscriptionStatus={subscriptionStatus}
                onUpgradeClick={() => setUpgradeDialogOpen(true)}
              />
            </TabPanel>
          </Card>

          <UpgradeDialog
            open={upgradeDialogOpen}
            currentPlan={subscriptionStatus?.plan || 'trial'}
            onClose={() => setUpgradeDialogOpen(false)}
            onUpgrade={handleUpgradeClick}
          />
        </Paper>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            if (error) setError('');
            if (success) setSuccess('');
          }}
        >
          <Alert 
            severity={error ? 'error' : 'success'}
            onClose={() => {
              if (error) setError('');
              if (success) setSuccess('');
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}