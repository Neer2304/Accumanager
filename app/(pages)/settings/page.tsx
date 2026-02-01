"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Import components
import { Alert2 } from '@/components/ui/alert2';
import { Button2 } from '@/components/ui/button2';
import { Card2 } from '@/components/ui/card2';
import { CombinedIcon } from '@/components/ui/icons2';
import { BusinessSettings } from '@/components/settings/BusinessSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { SubscriptionSettings } from '@/components/settings/SubscriptionSettings';
import { BackupSettings } from '@/components/settings/BackupSettings';
import { UpgradeDialog } from '@/components/settings/UpgradeDialog';
import { SettingsData, SubscriptionStatus } from '@/types/settings';

// Tab Panel Component
function TabPanel({ children, value, index }: { children: React.ReactNode, value: number, index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const defaultSettings: SettingsData = {
    business: {
      name: 'My Business',
      taxRate: 18,
      invoicePrefix: 'INV',
      gstNumber: '',
      businessAddress: '',
      phone: '',
      email: '',
      website: '',
      logoUrl: ''
    },
    notifications: {
      email: true,
      push: true,
      salesAlerts: true,
      lowStockAlerts: true,
      newCustomerAlerts: true,
      billingReminders: true,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
      loginAlerts: true,
      ipWhitelist: []
    },
    appearance: {
      language: 'en',
      dateFormat: 'dd/MM/yyyy',
      compactMode: false,
      dashboardLayout: 'standard',
      primaryColor: '#667eea'
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await loadSettings();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          setLogoPreview(data.settings.business?.logoUrl || '');
        } else {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        handleSettingChange('business', 'logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackup = async (type: string) => {
    try {
      const response = await fetch(`/api/settings/backup?type=${type}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.${type === 'csv' ? 'csv' : 'json'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
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
        const paymentData = result.data;
        window.open(paymentData.upiUrl, '_blank');
        setUpgradeDialogOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const tabs = [
    { label: 'Business', icon: <CombinedIcon name="Business" /> },
    { label: 'Notifications', icon: <CombinedIcon name="Notifications" /> },
    { label: 'Security', icon: <CombinedIcon name="Security" /> },
    { label: 'Appearance', icon: <CombinedIcon name="Palette" /> },
    { label: 'Subscription', icon: <CombinedIcon name="Payment" /> },
    { label: 'Backup', icon: <CombinedIcon name="Backup" /> }
  ];

  if (loading) {
    return (
      <MainLayout title="Settings">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <CombinedIcon name="Settings" size={64} sx={{ mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" color="text.secondary">
              Loading Settings...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  const displaySettings = settings || defaultSettings;

  return (
    <MainLayout title="Settings">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CombinedIcon name="Settings" size={32} />
                Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure your application preferences and manage business settings
              </Typography>
            </Box>
            
            {subscriptionStatus && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button2
                  variant="contained"
                  iconLeft={<CombinedIcon name="Upgrade" size={16} />}
                  onClick={() => setUpgradeDialogOpen(true)}
                  sx={{ borderRadius: '20px' }}
                >
                  Upgrade
                </Button2>
              </Box>
            )}
          </Box>
        </Box>

        {/* Save Status Alert */}
        {saveStatus === 'success' && (
          <Alert2 
            severity="success" 
            message="Settings saved successfully!"
            dismissible
            onDismiss={() => setSaveStatus('idle')}
            sx={{ mb: 3 }}
          />
        )}
        {saveStatus === 'error' && (
          <Alert2 
            severity="error" 
            message="Failed to save settings. Please try again."
            action={<Button2 onClick={handleSaveSettings} size="small">Retry</Button2>}
            sx={{ mb: 3 }}
          />
        )}

        {/* Main Content */}
        <Card2 sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { 
                  fontWeight: 600, 
                  textTransform: 'none',
                  minHeight: 64,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  gap: 1,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={isMobile ? undefined : tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Business Tab */}
            <TabPanel value={activeTab} index={0}>
              <BusinessSettings
                settings={displaySettings.business}
                logoPreview={logoPreview}
                onSettingChange={(key, value) => handleSettingChange('business', key, value)}
                onLogoUpload={handleLogoUpload}
              />
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={1}>
              <NotificationSettings
                settings={displaySettings.notifications}
                onSettingChange={(key, value) => handleSettingChange('notifications', key, value)}
              />
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={2}>
              <SecuritySettings
                settings={displaySettings.security}
                onSettingChange={(key, value) => handleSettingChange('security', key, value)}
              />
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={activeTab} index={3}>
              <AppearanceSettings
                settings={displaySettings.appearance}
                onSettingChange={(key, value) => handleSettingChange('appearance', key, value)}
              />
            </TabPanel>

            {/* Subscription Tab */}
            <TabPanel value={activeTab} index={4}>
              <SubscriptionSettings
                subscription={subscriptionStatus}
                onUpgradeClick={() => setUpgradeDialogOpen(true)}
              />
            </TabPanel>

            {/* Backup Tab */}
            <TabPanel value={activeTab} index={5}>
              <BackupSettings onBackup={handleBackup} />
            </TabPanel>
          </Box>
        </Card2>

        {/* Save Button */}
        <Box sx={{ 
          position: 'sticky', 
          bottom: 20, 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Button2
            variant="contained"
            iconLeft={saveStatus === 'saving' ? 
              <CircularProgress size={20} sx={{ color: 'white' }} /> : 
              <CombinedIcon name="Save" size={20} />
            }
            onClick={handleSaveSettings}
            disabled={saveStatus === 'saving'}
            size="large"
            sx={{
              minWidth: 200,
              borderRadius: '20px',
              boxShadow: 4,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'}
          </Button2>
        </Box>

        {/* Upgrade Dialog */}
        <UpgradeDialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)}
          onUpgrade={handleUpgradePlan}
        />
      </Container>
    </MainLayout>
  );
}