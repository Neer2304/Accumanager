"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
} from '@mui/icons-material';
import { MaterialForm } from './components/MaterialForm';
import { useMaterials } from './hooks/useMaterials';
import { MaterialFormData, defaultMaterialFormData } from './types/material.types';

export const MaterialEditPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const {
    currentMaterial,
    loading,
    error,
    fetchMaterial,
    updateMaterial,
    setError,
  } = useMaterials();

  const [formData, setFormData] = useState<MaterialFormData>(defaultMaterialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMaterial(id as string);
    }
  }, [id]);

  useEffect(() => {
    if (currentMaterial) {
      setFormData({
        name: currentMaterial.name,
        sku: currentMaterial.sku,
        description: currentMaterial.description || '',
        category: currentMaterial.category,
        unit: currentMaterial.unit,
        initialStock: currentMaterial.currentStock,
        minimumStock: currentMaterial.minimumStock,
        maximumStock: currentMaterial.maximumStock,
        unitCost: currentMaterial.unitCost,
        supplierName: currentMaterial.supplierName || '',
        supplierCode: currentMaterial.supplierCode || '',
        supplierContact: currentMaterial.supplierContact || '',
        leadTime: currentMaterial.leadTime,
        storageLocation: currentMaterial.storageLocation || '',
        shelf: currentMaterial.shelf || '',
        bin: currentMaterial.bin || '',
        lowStockAlert: currentMaterial.lowStockAlert,
        expirationDate: currentMaterial.expirationDate,
        batchNumber: currentMaterial.batchNumber || '',
      });
    }
  }, [currentMaterial]);

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

      if (!id) {
        throw new Error('Material ID is missing');
      }

      await updateMaterial(id as string, formData);
      router.push(`/materials/${id}`);
    } catch (err) {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/materials/${id}`);
  };

  if (loading && !currentMaterial) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!currentMaterial) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Material not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/materials')}
          sx={{ mt: 2 }}
        >
          Back to Materials
        </Button>
      </Container>
    );
  }

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
              onClick={() => router.push(`/materials/${id}`)}
              sx={{ mb: 1 }}
            >
              Back to Material
            </Button>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Edit Material
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update material information and settings
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
              startIcon={<Save />}
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
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
        isEdit={true}
      />
    </Container>
  );
};