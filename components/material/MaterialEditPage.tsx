"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { MaterialForm } from "./components/MaterialForm";
import { useMaterials } from "./hooks/useMaterials";
import {
  MaterialFormData,
  defaultMaterialFormData,
} from "./types/material.types";

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

  const [formData, setFormData] = useState<MaterialFormData>(
    defaultMaterialFormData
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMaterial(id as string);
    }
  }, [id, fetchMaterial]);

  useEffect(() => {
    if (currentMaterial) {
      setFormData({
        name: currentMaterial.name,
        sku: currentMaterial.sku,
        description: currentMaterial.description || "",
        category: currentMaterial.category,
        unit: currentMaterial.unit,
        currentStock: currentMaterial.currentStock, // Changed from initialStock
        minimumStock: currentMaterial.minimumStock,
        maximumStock: currentMaterial.maximumStock || undefined,
        unitCost: currentMaterial.unitCost,
        supplierName: currentMaterial.supplierName || "",
        supplierCode: currentMaterial.supplierCode || "",
        supplierContact: currentMaterial.supplierContact || "",
        leadTime: currentMaterial.leadTime || undefined,
        storageLocation: currentMaterial.storageLocation || "",
        shelf: currentMaterial.shelf || "",
        bin: currentMaterial.bin || "",
        lowStockAlert: currentMaterial.lowStockAlert,
        expirationDate: currentMaterial.expirationDate
          ? new Date(currentMaterial.expirationDate).toISOString().split("T")[0]
          : undefined,
        batchNumber: currentMaterial.batchNumber || "",
      });
    }
  }, [currentMaterial]);

  const handleInputChange = (field: keyof MaterialFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!id) {
        throw new Error("Material ID is missing");
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
      <MainLayout title="Edit Material">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!currentMaterial) {
    return (
      <MainLayout title="Edit Material">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            Material not found
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/materials")}
            variant="outlined"
          >
            Back to Materials
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Material">
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 1400,
          margin: "0 auto",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push(`/materials/${id}`)}
                sx={{ mb: 1 }}
              >
                Back to Material
              </Button>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Edit Material: {currentMaterial.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update material information and settings
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
                startIcon={<Save />}
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting}
                sx={{ borderRadius: 2 }}
              >
                {submitting ? "Saving..." : "Save Changes"}
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
            {typeof error === "string" ? error : "An error occurred"}
          </Alert>
        )}

        {/* Form */}
        <MaterialForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={submitting}
          error={typeof error === "string" ? error : undefined}
          onCancel={handleCancel}
          isEdit={true}
        />
      </Box>
    </MainLayout>
  );
};
