"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

// Settings Components
import {
  SettingsHeader,
  SettingsSection,
  SettingsFieldGroup,
  PriceInput,
  SettingsActions,
} from '@/components/settings';

// Common Components
import {
  FormInput,
  FormSwitch,
} from '@/components/common';

interface AppSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  enableRegistration: boolean;
  trialDays: number;
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  security: {
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'AccuManage',
    siteUrl: 'https://accumanae.com',
    supportEmail: 'mehtaneer143@gmail.com',
    enableRegistration: true,
    trialDays: 14,
    pricing: {
      monthly: 499,
      quarterly: 1299,
      yearly: 3999,
    },
    security: {
      requireEmailVerification: false,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: 'AccuManage',
      siteUrl: 'https://accumanae.com',
      supportEmail: 'support@accumanae.com',
      enableRegistration: true,
      trialDays: 14,
      pricing: {
        monthly: 499,
        quarterly: 1299,
        yearly: 3999,
      },
      security: {
        requireEmailVerification: false,
        maxLoginAttempts: 5,
        sessionTimeout: 24,
      },
    });
    setSuccess('Settings reset to defaults!');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <SettingsHeader />
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* General Settings */}
      <SettingsSection
        title="General Settings"
        subtitle="Configure basic application settings"
        icon={<SettingsIcon />}
        iconColor="primary.main"
      >
        <SettingsFieldGroup columns={2}>
          <FormInput
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            fullWidth
          />
          <FormInput
            label="Site URL"
            name="siteUrl"
            value={settings.siteUrl}
            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            fullWidth
          />
          <FormInput
            label="Support Email"
            name="supportEmail"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            fullWidth
          />
          <FormInput
            label="Trial Days"
            name="trialDays"
            type="number"
            value={settings.trialDays.toString()}
            onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) || 14 })}
            fullWidth
          />
        </SettingsFieldGroup>
        
        <Box sx={{ mt: 2 }}>
          <FormSwitch
            label="Enable User Registration"
            checked={settings.enableRegistration}
            onChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
            helper="Allow new users to register on the platform"
          />
        </Box>
      </SettingsSection>

      {/* Pricing Settings */}
      <SettingsSection
        title="Pricing Settings"
        subtitle="Configure subscription pricing (INR)"
        icon={<PaymentIcon />}
        iconColor="warning.main"
      >
        <SettingsFieldGroup columns={3}>
          <PriceInput
            label="Monthly Price"
            value={settings.pricing.monthly}
            onChange={(value) => setSettings({
              ...settings,
              pricing: { ...settings.pricing, monthly: value }
            })}
          />
          <PriceInput
            label="Quarterly Price"
            value={settings.pricing.quarterly}
            onChange={(value) => setSettings({
              ...settings,
              pricing: { ...settings.pricing, quarterly: value }
            })}
          />
          <PriceInput
            label="Yearly Price"
            value={settings.pricing.yearly}
            onChange={(value) => setSettings({
              ...settings,
              pricing: { ...settings.pricing, yearly: value }
            })}
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection
        title="Security Settings"
        subtitle="Configure application security settings"
        icon={<SecurityIcon />}
        iconColor="error.main"
      >
        <SettingsFieldGroup columns={2}>
          <Box>
            <FormSwitch
              label="Require Email Verification"
              checked={settings.security.requireEmailVerification}
              onChange={(checked) => setSettings({
                ...settings,
                security: { ...settings.security, requireEmailVerification: checked }
              })}
              helper="Users must verify email before accessing the platform"
            />
          </Box>
          
          <FormInput
            label="Max Login Attempts"
            name="maxLoginAttempts"
            type="number"
            value={settings.security.maxLoginAttempts.toString()}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) || 5 }
            })}
            fullWidth
            helper="Maximum failed login attempts before account lock"
          />
          
          <FormInput
            label="Session Timeout (hours)"
            name="sessionTimeout"
            type="number"
            value={settings.security.sessionTimeout.toString()}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) || 24 }
            })}
            fullWidth
            helper="User session timeout in hours"
          />
        </SettingsFieldGroup>
      </SettingsSection>

      {/* Actions */}
      <SettingsActions
        onSave={handleSave}
        onReset={handleReset}
        saving={saving}
      />
    </Box>
  );
}