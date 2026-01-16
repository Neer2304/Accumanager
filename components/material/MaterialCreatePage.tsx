"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Add,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { MaterialForm } from './components/MaterialForm';
import { useMaterials } from './hooks/useMaterials';
import { MaterialFormData, defaultMaterialFormData } from './types/material.types';

export const MaterialCreatePage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  
  const {
    loading,
    error,
    createMaterial,
    setError,
  } = useMaterials();

  const [formData, setFormData] = useState<MaterialFormData>(defaultMaterialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: keyof MaterialFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const material = await createMaterial(formData);
      router.push(`/materials/${material._id}`);
    } catch (err) {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/materials');
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout title="Add New Material">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Add New Material">
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        maxWidth: 1400, 
        margin: '0 auto',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 2 
          }}>
            <Box>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/materials')}
                sx={{ mb: 1 }}
              >
                Back to Materials
              </Button>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Add New Material
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new material for your inventory
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                onClick={handleCancel}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                startIcon={<Add />}
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting}
                sx={{ borderRadius: 2 }}
              >
                {submitting ? 'Creating...' : 'Create Material'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {typeof error === 'string' ? error : 'An error occurred'}
          </Alert>
        )}

        {/* Form */}
        <MaterialForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={submitting}
          error={typeof error === 'string' ? error : undefined}
          onCancel={handleCancel}
          isEdit={false}
        />
      </Box>
    </MainLayout>
  );
};