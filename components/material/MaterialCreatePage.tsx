"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  Add,
} from '@mui/icons-material';
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
              startIcon={<Cancel />}
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
          {error}
        </Alert>
      )}

      {/* Form */}
      <MaterialForm
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={submitting}
        error={error}
        onCancel={handleCancel}
        isEdit={false}
      />
    </Container>
  );
};