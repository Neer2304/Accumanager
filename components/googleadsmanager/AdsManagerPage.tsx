// components/googleadsmanager/AdsManagerPage.tsx
'use client'

import React from 'react';
import {
  Box,
  Container,
  Alert,
  useTheme
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { AdsHeader } from './components/AdsHeader';
import { AdsStats } from './components/AdsStats';
import { AdsSettings } from './components/AdsSettings';
import { CampaignsTable } from './components/CampaignsTable';
import { CreateAdDialog } from './components/CreateAdDialog';

// Import hooks
import { useAdsManager } from './hooks/useAdsManager';

function AdsManagerContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    campaigns,
    stats,
    settings,
    openAdDialog,
    success,
    error,
    setOpenAdDialog,
    setSuccess,
    setError,
    handleToggleAdStatus,
    handleDeleteCampaign,
    handleCreateCampaign,
    handleEditCampaign,
    updateSettings,
  } = useAdsManager();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        <AdsHeader onCreateClick={() => setOpenAdDialog(true)} />

        {/* Alerts */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #34a853',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#34a853' },
            }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Stats Overview */}
        <AdsStats stats={stats} />

        {/* Ad Settings */}
        <AdsSettings settings={settings} onSettingsChange={updateSettings} />

        {/* Campaigns Table */}
        <CampaignsTable
          campaigns={campaigns}
          onToggleStatus={handleToggleAdStatus}
          onDelete={handleDeleteCampaign}
          onEdit={handleEditCampaign}
        />

        {/* Create Ad Dialog */}
        <CreateAdDialog
          open={openAdDialog}
          onClose={() => setOpenAdDialog(false)}
          onSubmit={handleCreateCampaign}
        />
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function AdsManagerPage() {
  return (
    <MainLayout title="Ad Management">
      <AdsManagerContent />
    </MainLayout>
  );
}