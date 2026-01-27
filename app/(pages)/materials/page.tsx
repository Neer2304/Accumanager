"use client";

import React, { useState, useEffect } from "react";
import {
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
  CircularProgress,
  Container,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  GridView,
  ViewList,
  Delete,
  Refresh,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/Layout/MainLayout";
import { MaterialGrid } from "@/components/material/components/MaterialGrid";
import { MaterialFilters } from "@/components/material/components/MaterialFilters";
import { MaterialUseDialog } from "@/components/material/components/MaterialUseDialog";
import { MaterialRestockDialog } from "@/components/material/components/MaterialRestockDialog";
import { useMaterials } from "@/components/material/hooks/useMaterials";
import {
  Material,
  MaterialFilters as FiltersType,
  UseMaterialRequest,
  RestockMaterialRequest,
  defaultMaterialFilters,
} from "@/components/material/types/material.types";

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
    clearSelection,
    setError,
  } = useMaterials();

  const [filters, setFilters] = useState<FiltersType>(defaultMaterialFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    fetchMaterials(filters);
  }, [filters, fetchMaterials]);

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleCreateMaterial = () => {
    router.push("/materials/create");
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
    if (!selectedMaterial) return;

    try {
      setDeleting(true);
      await deleteMaterial(selectedMaterial._id);
      setSuccessMessage("Material deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      console.error("Error deleting material:", err);
    } finally {
      setDeleting(false);
    }
  };

  const confirmUseMaterial = async (request: UseMaterialRequest) => {
    try {
      await useMaterial(request);
      setSuccessMessage("Material usage recorded successfully");
      setUseDialogOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      console.error("Error using material:", err);
    }
  };

  const confirmRestockMaterial = async (request: RestockMaterialRequest) => {
    try {
      await restockMaterial(request);
      setSuccessMessage("Material restocked successfully");
      setRestockDialogOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      console.error("Error restocking material:", err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMaterials.length === 0) return;

    try {
      await bulkAction(selectedMaterials, "delete");
      setSuccessMessage(
        `${selectedMaterials.length} materials deleted successfully`,
      );
      clearSelection();
    } catch (err) {
      console.error("Error in bulk delete:", err);
    }
  };

  const handleRefresh = () => {
    fetchMaterials(filters);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDownloadCSV = () => {
    console.log("Downloading CSV...");
    handleDownloadMenuClose();
  };

  const handleDownloadExcel = () => {
    console.log("Downloading Excel...");
    handleDownloadMenuClose();
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    handleDownloadMenuClose();
  };

  const handleExportAll = () => {
    console.log("Exporting all data...");
    handleDownloadMenuClose();
  };

  const handleBack = () => {
    window.history.back();
  };

  // Loading state
  if (loading && !materials.length) {
    return (
      <MainLayout title="Material Inventory">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Material Inventory">
      {/* ONLY CHANGED THE HEADER PART - Everything else remains the same */}
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* NEW HEADER - Same style as Events page with Download button */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Material Inventory</Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Material Inventory
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and track your materials, stock levels, and usage
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {!isOnline && (
                <Chip
                  label="Offline Mode"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                />
              )}

              {/* DOWNLOAD BUTTON WITH DROPDOWN MENU */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadClick}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    alignSelf: { xs: "flex-start", sm: "center" },
                  }}
                >
                  Download
                </Button>

                <IconButton
                  size="small"
                  onClick={handleDownloadClick}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    alignSelf: "center",
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Add other chips if needed */}
            </Stack>
          </Box>

          {/* DOWNLOAD MENU */}
          <Menu
            anchorEl={downloadMenuAnchor}
            open={Boolean(downloadMenuAnchor)}
            onClose={handleDownloadMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleDownloadCSV}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileDownloadIcon fontSize="small" />
                <Typography variant="body2">Download CSV</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleDownloadExcel}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">Download Excel</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleDownloadPDF}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PdfIcon fontSize="small" />
                <Typography variant="body2">Download PDF</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleExportAll}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloudDownloadIcon fontSize="small" />
                <Typography variant="body2">Export All Data</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* EVERYTHING BELOW REMAINS EXACTLY THE SAME AS YOUR ORIGINAL CODE */}
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
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
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
                  sx={{ borderRadius: 2 }}
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<Add />}
                  onClick={handleCreateMaterial}
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Add Material
                </Button>
              </Stack>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
                    sx={{ borderRadius: 2 }}
                  >
                    Delete Selected
                  </Button>
                  <Button
                    onClick={clearSelection}
                    variant="text"
                    size="small"
                    sx={{ borderRadius: 2 }}
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
          />

          {/* View Mode Toggle */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Showing {materials.length} of {pagination.total} materials
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<GridView />}
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "contained" : "outlined"}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Grid
              </Button>
              <Button
                startIcon={<ViewList />}
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "contained" : "outlined"}
                size="small"
                sx={{ borderRadius: 2 }}
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
              {typeof error === "string" ? error : "An error occurred"}
            </Alert>
          )}

          {/* Material Grid */}
          <MaterialGrid
            materials={materials}
            loading={loading}
            selectedMaterials={selectedMaterials} // FIXED LINE
            viewMode={viewMode}
            onMaterialSelect={(material) =>
              toggleMaterialSelection(material._id)
            } // FIXED LINE
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={() =>
                  handleFiltersChange({ page: pagination.page - 1 })
                }
                disabled={pagination.page === 1 || loading}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Previous
              </Button>

              <Typography variant="body2" color="text.secondary">
                Page {pagination.page} of {pagination.pages}
              </Typography>

              <Button
                onClick={() =>
                  handleFiltersChange({ page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages || loading}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
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
            <DialogTitle>Delete Material</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete &quot;
                {selectedMaterial?.name || "this material"}&quot;? This action
                cannot be undone.
              </Typography>
              {selectedMaterial?.currentStock &&
                selectedMaterial.currentStock > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This material still has {selectedMaterial.currentStock}{" "}
                    {selectedMaterial.unit} in stock. Deleting it will remove
                    all stock and usage history.
                  </Alert>
                )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteMaterial}
                variant="contained"
                color="error"
                disabled={deleting}
                startIcon={
                  deleting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {deleting ? "Deleting..." : "Delete Material"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Snackbar */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage("")}
            message={successMessage}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default MaterialListPage;
