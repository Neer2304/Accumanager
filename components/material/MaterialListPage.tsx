import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  GridView,
  ViewList,
  Delete,
  Archive,
  Refresh,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MaterialGrid } from './components/MaterialGrid';
import { MaterialFilters } from './components/MaterialFilters';
import { MaterialUseDialog } from './components/MaterialUseDialog';
import { MaterialRestockDialog } from './components/MaterialRestockDialog';
import { useMaterials } from './hooks/useMaterials';
import { 
  Material, 
  MaterialFilters as FiltersType,
  UseMaterialRequest,
  RestockMaterialRequest,
  defaultMaterialFilters,
} from './types/material.types';

export const MaterialListPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  
  const {
    materials,
    selectedMaterials,
    loading,
    error,
    pagination,
    fetchMaterials,
    deleteMaterial,
    useMaterial,
    restockMaterial,
    bulkAction,
    toggleMaterialSelection,
    selectAllMaterials,
    clearSelection,
    setError,
  } = useMaterials();

  const [filters, setFilters] = useState<FiltersType>(defaultMaterialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchMaterials(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreateMaterial = () => {
    router.push('/materials/create');
  };

  const handleEditMaterial = (material: Material) => {
    router.push(`/materials/${material._id}/edit`);
  };

  const handleViewDetails = (material: Material) => {
    router.push(`/materials/${material._id}`);
  };

  const handleUseMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setUseDialogOpen(true);
  };

  const handleRestockMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setRestockDialogOpen(true);
  };

  const handleDeleteMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMaterial = async () => {
    if (selectedMaterial) {
      try {
        await deleteMaterial(selectedMaterial._id);
        setSuccessMessage('Material deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedMaterial(null);
      } catch (err) {
        // Error is handled by hook
      }
    }
  };

  const confirmUseMaterial = async (request: UseMaterialRequest) => {
    try {
      await useMaterial(request);
      setSuccessMessage('Material usage recorded successfully');
      setUseDialogOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      // Error is handled by hook
    }
  };

  const confirmRestockMaterial = async (request: RestockMaterialRequest) => {
    try {
      await restockMaterial(request);
      setSuccessMessage('Material restocked successfully');
      setRestockDialogOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      // Error is handled by hook
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMaterials.length === 0) return;
    
    try {
      await bulkAction(selectedMaterials, 'delete');
      setSuccessMessage(`${selectedMaterials.length} materials deleted successfully`);
      clearSelection();
    } catch (err) {
      // Error is handled by hook
    }
  };

  const handleRefresh = () => {
    fetchMaterials(filters);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export materials');
  };

  const handleImport = () => {
    // Implement import functionality
    console.log('Import materials');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
            <Typography variant="h4" fontWeight="bold" color="primary">
              Material Inventory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track your materials, stock levels, and usage
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Refresh />}
              onClick={handleRefresh}
              variant="outlined"
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              startIcon={<Add />}
              onClick={handleCreateMaterial}
              variant="contained"
            >
              Add Material
            </Button>
          </Stack>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Materials
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {pagination.total}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Selected
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary">
              {selectedMaterials.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Page {pagination.page} of {pagination.pages}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {pagination.limit} per page
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Bulk Actions */}
      {selectedMaterials.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body1" fontWeight={600}>
              {selectedMaterials.length} material(s) selected
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                variant="outlined"
                color="error"
                size="small"
              >
                Delete Selected
              </Button>
              <Button
                onClick={clearSelection}
                variant="text"
                size="small"
              >
                Clear Selection
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Filters */}
      <MaterialFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* View Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {materials.length} of {pagination.total} materials
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<GridView />}
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            size="small"
          >
            Grid
          </Button>
          <Button
            startIcon={<ViewList />}
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
          >
            List
          </Button>
        </Stack>
      </Box>

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

      {/* Material Grid */}
      <MaterialGrid
        materials={materials}
        loading={loading}
        selectedMaterials={selectedMaterials}
        viewMode={viewMode}
        onMaterialSelect={toggleMaterialSelection}
        onMaterialEdit={handleEditMaterial}
        onMaterialDelete={handleDeleteMaterial}
        onMaterialUse={handleUseMaterial}
        onMaterialRestock={handleRestockMaterial}
        onViewDetails={handleViewDetails}
        onCreateMaterial={handleCreateMaterial}
        emptyMessage="No materials found. Add your first material to get started."
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Paper
          sx={{
            p: 2,
            mt: 3,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            onClick={() => handleFiltersChange({ page: pagination.page - 1 })}
            disabled={pagination.page === 1 || loading}
            variant="outlined"
            size="small"
          >
            Previous
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Page {pagination.page} of {pagination.pages}
          </Typography>
          
          <Button
            onClick={() => handleFiltersChange({ page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages || loading}
            variant="outlined"
            size="small"
          >
            Next
          </Button>
        </Paper>
      )}

      {/* Dialogs */}
      <MaterialUseDialog
        open={useDialogOpen}
        material={selectedMaterial}
        onClose={() => {
          setUseDialogOpen(false);
          setSelectedMaterial(null);
        }}
        onSubmit={confirmUseMaterial}
        loading={loading}
      />

      <MaterialRestockDialog
        open={restockDialogOpen}
        material={selectedMaterial}
        onClose={() => {
          setRestockDialogOpen(false);
          setSelectedMaterial(null);
        }}
        onSubmit={confirmRestockMaterial}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Material
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedMaterial?.name}"? This action cannot be undone.
          </Typography>
          {selectedMaterial?.currentStock > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This material still has {selectedMaterial.currentStock} {selectedMaterial.unit} in stock.
              Deleting it will remove all stock and usage history.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteMaterial}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Material'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Container>
  );
};