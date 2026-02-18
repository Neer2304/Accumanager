// components/googlecompaniescreate/CreateCompanyPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Paper,
  Alert,
  Container,
  useTheme,
  Divider
} from "@mui/material";
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCompany } from '@/lib/companyContext';

// Import components
import { CreateCompanyHeader } from './components/CreateCompanyHeader';
import { LimitReachedMessage } from './components/LimitReachedMessage';
import { BasicInfoForm } from './components/BasicInfoForm';
import { AddressForm } from './components/AddressForm';
import { PlanInfoCard } from './components/PlanInfoCard';
import { FormActions } from './components/FormActions';

// Import hooks
import { useCreateCompany } from './hooks/useCreateCompany';

// Import constants
import { GOOGLE_COLORS } from './constants';

function CreateCompanyContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { canCreateMore, limits } = useCompany();
  
  const {
    formData,
    loading,
    error,
    setError,
    handleSubmit,
    handleInputChange,
    handleSelectChange
  } = useCreateCompany();

  // Redirect if limit reached
  if (!canCreateMore) {
    return (
      <LimitReachedMessage 
        current={limits.current} 
        max={limits.max} 
      />
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      <CreateCompanyHeader darkMode={darkMode} />

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '24px',
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: '8px',
                backgroundColor: darkMode ? `rgba(217,48,37,0.1)` : `rgba(217,48,37,0.05)`,
                color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
                '& .MuiAlert-icon': { color: GOOGLE_COLORS.red }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <BasicInfoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              darkMode={darkMode}
            />

            <Divider sx={{ my: 4, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <AddressForm
              formData={formData}
              onInputChange={handleInputChange}
              darkMode={darkMode}
            />

            <Divider sx={{ my: 4, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <PlanInfoCard darkMode={darkMode} />

            <FormActions
              loading={loading}
              onCancel={() => window.history.back()}
              darkMode={darkMode}
            />
          </form>
        </Paper>

        <Box
          component="footer"
          sx={{ 
            textAlign: 'center',
            mt: 3,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: '0.75rem'
          }}
        >
          By creating a company, you agree to our Terms of Service and Privacy Policy.
          You can add team members after creating the company.
        </Box>
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function CreateCompanyPage() {
  return (
    <MainLayout title="Create Company">
      <CreateCompanyContent />
    </MainLayout>
  );
}