// components/googleadminsettings/AdminSettingsPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';

// Import components
import { SettingsHeader } from './components/SettingsHeader';
import { GeneralSettings } from './components/GeneralSettings';
import { PricingSettings } from './components/PricingSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { SettingsActions } from './components/SettingsActions';
import { SettingsLoadingState } from './components/SettingsLoadingState';
import { SettingsErrorAlert } from './components/SettingsErrorAlert';
import { SettingsSuccessAlert } from './components/SettingsSuccessAlert';

// Import hooks
import { useAdminSettings } from './hooks/useAdminSettings';

export default function AdminSettingsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    settings,
    loading,
    saving,
    error,
    success,
    setError,
    setSuccess,
    saveSettings,
    resetSettings,
    updateSettings,
    updatePricing,
    updateSecurity,
  } = useAdminSettings();

  if (loading) {
    return <SettingsLoadingState />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <Container maxWidth="xl">
        <SettingsHeader />
        
        {/* Error Alert */}
        {error && (
          <SettingsErrorAlert message={error} onClose={() => setError('')} />
        )}

        {/* Success Alert */}
        {success && (
          <SettingsSuccessAlert message={success} onClose={() => setSuccess('')} />
        )}

        {/* General Settings */}
        <GeneralSettings settings={settings} onUpdate={updateSettings} />

        {/* Pricing Settings */}
        <PricingSettings settings={settings} onUpdate={updatePricing} />

        {/* Security Settings */}
        <SecuritySettings settings={settings} onUpdate={updateSecurity} />

        {/* Actions */}
        <SettingsActions
          onSave={saveSettings}
          onReset={resetSettings}
          saving={saving}
        />
      </Container>
    </Box>
  );
}