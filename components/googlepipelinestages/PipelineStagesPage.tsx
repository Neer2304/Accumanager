// components/googlepipelinestages/PipelineStagesPage.tsx
'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Alert,
  Snackbar,
  alpha,
  useTheme,
  SelectChangeEvent,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCompany } from '@/lib/companyContext';

// Import components
import { StagesHeader } from './components/StagesHeader';
import { StagesStats } from './components/StagesStats';
import { StagesFilters } from './components/StagesFilters';
import { StagesList } from './components/StagesList';
import { StageMenu } from './components/StageMenu';

// Import dialogs
import { AddStageDialog } from './components/StagesDialogs/AddStageDialog';
import { EditStageDialog } from './components/StagesDialogs/EditStageDialog';
import { DeleteStageDialog } from './components/StagesDialogs/DeleteStageDialog';
import { StageDetailDialog } from './components/StagesDialogs/StageDetailDialog';

// Import hooks
import { usePipelineStages } from './hooks/usePipelineStages';
import { useStageForm } from './hooks/useStageForm';
import { useStageDialogs } from './hooks/useStageDialogs';

// Import constants
import { GOOGLE_COLORS } from './constants';
import { BusinessIcon } from "@/assets/icons/AboutIcons";
import { Button } from "../ui/Button";
import { AddIcon } from "@/assets/icons/InventoryIcons";

function PipelineStagesContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  // Custom hooks
  const {
    filteredStages,
    members,
    loading,
    submitting,
    error,
    success,
    setError,
    setSuccess,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    selectedStage,
    setSelectedStage,
    pipelineStats,
    fetchStages,
    fetchMembers,
    reorderStages,
    toggleStageStatus,
    deleteStage
  } = usePipelineStages(selectedCompanyId);

  const {
    formData,
    validationErrors,
    submitting: formSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleColorChange,
    setFormForEdit,
    resetForm,
    addStage,
    updateStage
  } = useStageForm(selectedCompanyId, filteredStages);

  const {
    detailDialogOpen,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    colorPickerOpen,
    anchorEl,
    setDetailDialogOpen,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setColorPickerOpen,
    setAnchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleViewDetails,
    handleEdit,
    handleDelete,
    closeAllDialogs
  } = useStageDialogs();

  // Set first company as default when companies load
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany._id);
    }
  }, [companies, selectedCompanyId]);

  // Fetch members and stages when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchMembers(selectedCompanyId);
      fetchStages();
    }
  }, [selectedCompanyId, fetchMembers, fetchStages]);

  // Handlers
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedStages = items.map((item, index) => ({
      id: item._id,
      order: index
    }));

    // Optimistically update UI
    const success = await reorderStages(reorderedStages);
    if (!success) {
      fetchStages(); // Revert on failure
    }
  };

  const handleAddStage = async () => {
    const result = await addStage();
    if (result.success) {
      setSuccess("Pipeline stage added successfully");
      setAddDialogOpen(false);
      fetchStages();
      resetForm();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const handleUpdateStage = async () => {
    if (!selectedStage) return;
    
    const result = await updateStage(selectedStage._id);
    if (result.success) {
      setSuccess("Pipeline stage updated successfully");
      setEditDialogOpen(false);
      fetchStages();
      resetForm();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const handleDeleteStage = async () => {
    if (!selectedStage) return;
    
    const success = await deleteStage(selectedStage._id);
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedStage(null);
    }
  };

  const handleToggleStatus = async (stage: any) => {
    await toggleStageStatus(stage);
  };

  // Loading state
  if (companiesLoading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
          <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Loading companies...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!selectedCompanyId && companies.length === 0) {
    return (
      <Box sx={{
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa',
        p: 3
      }}>
        <Paper sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '24px'
        }}>
          <BusinessIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No Companies Found
          </Typography>
          <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            You need to create a company before managing pipeline stages.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/companies/create')}
            sx={{
              bgcolor: GOOGLE_COLORS.blue,
              '&:hover': { bgcolor: '#1557b0' },
              borderRadius: '24px',
              px: 4
            }}
          >
            Create Company
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: darkMode ? '#202124' : '#f8f9fa',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      <StagesHeader
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Alerts */}
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            onClose={() => setSuccess(null)}
            sx={{
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.green, 0.1) : alpha(GOOGLE_COLORS.green, 0.05),
              color: darkMode ? '#81c995' : GOOGLE_COLORS.green,
              border: `1px solid ${alpha(GOOGLE_COLORS.green, 0.2)}`,
            }}
          >
            {success}
          </Alert>
        </Snackbar>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 4,
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              border: `1px solid ${alpha(GOOGLE_COLORS.red, 0.2)}`,
            }}
          >
            {error}
          </Alert>
        )}

        <StagesStats stats={pipelineStats} />

        <StagesFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery("")}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onRefresh={fetchStages}
          onAddClick={() => {
            resetForm();
            setAddDialogOpen(true);
          }}
        />

        <StagesList
          stages={filteredStages}
          loading={loading}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onDragEnd={handleDragEnd}
          onViewDetails={(stage) => {
            setSelectedStage(stage);
            setDetailDialogOpen(true);
          }}
          onEdit={(stage) => {
            setSelectedStage(stage);
            setFormForEdit(stage);
            setEditDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onMenuOpen={handleMenuOpen}
          onAddClick={() => {
            resetForm();
            setAddDialogOpen(true);
          }}
        />
      </Container>

      {/* Dialogs */}
      <AddStageDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddStage}
        formData={formData}
        validationErrors={validationErrors}
        members={members}
        stages={filteredStages}
        colorPickerOpen={colorPickerOpen}
        onColorPickerToggle={() => setColorPickerOpen(!colorPickerOpen)}
        onColorPickerClose={() => setColorPickerOpen(false)}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSwitchChange={handleSwitchChange}
        onColorChange={handleColorChange}
        submitting={formSubmitting}
        darkMode={darkMode}
      />

      <EditStageDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateStage}
        formData={formData}
        validationErrors={validationErrors}
        members={members}
        stages={filteredStages}
        selectedStage={selectedStage}
        colorPickerOpen={colorPickerOpen}
        onColorPickerToggle={() => setColorPickerOpen(!colorPickerOpen)}
        onColorPickerClose={() => setColorPickerOpen(false)}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSwitchChange={handleSwitchChange}
        onColorChange={handleColorChange}
        submitting={formSubmitting}
        darkMode={darkMode}
      />

      <DeleteStageDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteStage}
        stage={selectedStage}
        submitting={submitting}
        darkMode={darkMode}
      />

      <StageDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        stage={selectedStage}
        members={members}
        darkMode={darkMode}
      />

      <StageMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        stage={selectedStage}
        onViewDetails={() => {
          handleMenuClose();
          setDetailDialogOpen(true);
        }}
        onEdit={() => {
          if (selectedStage) {
            handleMenuClose();
            setFormForEdit(selectedStage);
            setEditDialogOpen(true);
          }
        }}
        onToggleStatus={() => {
          if (selectedStage) {
            handleMenuClose();
            handleToggleStatus(selectedStage);
          }
        }}
        onDelete={() => {
          handleMenuClose();
          setDeleteDialogOpen(true);
        }}
      />
    </Box>
  );
}

// Main exported component with layout wrapper
export default function PipelineStagesPage() {
  return (
    <MainLayout title="Pipeline Stages">
      <PipelineStagesContent />
    </MainLayout>
  );
}