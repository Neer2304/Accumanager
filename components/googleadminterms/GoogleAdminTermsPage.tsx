// app/admin/terms/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

import {
  GoogleTermsSkeleton,
  GoogleTermsHeader,
  GoogleTermsList,
  GoogleTermsDialog,
  GoogleTermsAlerts,
  TermsHistory,
  TermsFormData,
} from '@/components/googleadminterms';

export default function TermsManagementPage() {
  const router = useRouter();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [termsHistory, setTermsHistory] = useState<TermsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchTermsHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/terms/history');
      
      if (!response.ok) throw new Error('Failed to fetch terms history');
      
      const history = await response.json();
      setTermsHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsHistory();
  }, []);

  const handleCreateNewTerms = async (formData: TermsFormData) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create new terms');
      }
      
      setSuccess('Terms & Conditions created successfully!');
      setCreateDialogOpen(false);
      fetchTermsHistory();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create terms');
    }
  };

  const handleDeleteTerms = async (termsId: string) => {
    if (!window.confirm('Are you sure you want to delete these terms? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/terms/${termsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete terms');
      }
      
      setSuccess('Terms & Conditions deleted successfully!');
      fetchTermsHistory();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete terms');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/terms/${id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && termsHistory.length === 0) {
    return <GoogleTermsSkeleton />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        <GoogleTermsHeader
          onCreateClick={() => setCreateDialogOpen(true)}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        <GoogleTermsAlerts
          error={error}
          success={success}
          onErrorClose={() => setError(null)}
          onSuccessClose={() => setSuccess(null)}
          darkMode={darkMode}
        />

        <GoogleTermsList
          termsHistory={termsHistory}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteTerms}
          formatDate={formatDate}
          darkMode={darkMode}
        />

        <GoogleTermsDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateNewTerms}
          darkMode={darkMode}
        />
      </Container>
    </Box>
  );
}