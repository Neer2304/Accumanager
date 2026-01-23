// app/(pages)/live-projects/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Alert, CircularProgress, Typography, IconButton } from '@mui/material';
import { Construction, MoreVert } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

// Import components
import { DevelopmentNotice } from '@/components/live-projects/DevelopmentNotice';
import { HeaderSection } from '@/components/live-projects/HeaderSection';
import { StatsOverview } from '@/components/live-projects/StatsOverview';
import { ProjectsList } from '@/components/live-projects/ProjectsList';
import { SidebarSection } from '@/components/live-projects/SidebarSection';

// Import hooks and types
import { useLiveProjectsData } from '@/components/live-projects/hooks/useLiveProjectsData';
import { LiveProject, ProjectUpdate } from '@/components/live-projects/types';

export default function LiveProjectsPage() {
  const {
    loading,
    error,
    projects,
    updates,
    autoRefresh,
    setAutoRefresh,
    setError,
    refreshData
  } = useLiveProjectsData();

  const [showDemoAlert, setShowDemoAlert] = useState(true);

  if (loading) {
    return (
      <MainLayout title="Live Projects">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your projects...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Live Projects">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        
        {/* Development Notice */}
        {showDemoAlert && (
          <DevelopmentNotice 
            onClose={() => setShowDemoAlert(false)}
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <MoreVert />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Header */}
        <HeaderSection 
          onRefresh={refreshData}
          loading={loading}
        />

        {/* Stats Overview */}
        <StatsOverview projects={projects} />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Projects List */}
          <Box sx={{ flex: 2 }}>
            <ProjectsList 
              projects={projects}
              autoRefresh={autoRefresh}
              onAutoRefreshChange={setAutoRefresh}
            />
          </Box>

          {/* Right Sidebar */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 350 } }}>
            <SidebarSection 
              updates={updates}
              projects={projects}
            />
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}