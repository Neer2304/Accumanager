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
  Fade,
  Grid,
  useMediaQuery,
  Divider,
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
  Search,
  FilterList,
  Inventory,
  Inventory2,
  TrendingUp,
  Group,
  Category as CategoryIcon,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

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
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);
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
            backgroundColor: darkMode ? '#202124' : '#ffffff',
          }}
        >
          <CircularProgress sx={{ color: '#4285f4' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Material Inventory">
      <Container maxWidth="lg" sx={{ 
        py: { xs: 2, sm: 3 }, 
        px: { xs: 1, sm: 2 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}>
        {/* Google-Styled Header */}
        <Box sx={{ mb: 4 }}>
          <Fade in>
            <Button
              startIcon={<BackIcon />}
              onClick={handleBack}
              sx={{ 
                mb: 2,
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                fontWeight: 400,
              }}
              size="small"
            >
              Back to Dashboard
            </Button>
          </Fade>

          <Breadcrumbs 
            sx={{ 
              mb: 2,
              fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
            }}
          >
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                "&:hover": { 
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              <HomeIcon sx={{ 
                mr: 0.5, 
                fontSize: getResponsiveTypography('16px', '18px', '20px')
              }} />
              Dashboard
            </MuiLink>
            <Typography 
              color={darkMode ? '#e8eaed' : '#202124'}
              fontWeight={400}
              fontSize={getResponsiveTypography('0.75rem', '0.8rem', '0.85rem')}
            >
              Material Inventory
            </Typography>
          </Breadcrumbs>

          <Fade in timeout={300}>
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
                <Typography 
                  variant={getResponsiveTypography('h5', 'h4', 'h4') as any}
                  fontWeight={500}
                  gutterBottom
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                    letterSpacing: '-0.02em',
                  }}
                >
                  Material Inventory
                </Typography>
                <Typography 
                  variant={isMobile ? "body2" : "body1"}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Manage and track your materials, stock levels, and usage
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ 
                  width: { xs: "100%", sm: "auto" },
                  flexWrap: 'wrap',
                }}
              >
                {!isOnline && (
                  <Chip
                    label="Offline Mode"
                    size="small"
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "center" },
                      backgroundColor: darkMode ? '#422006' : '#fef7e0',
                      color: darkMode ? '#fbbc04' : '#f57c00',
                      border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80',
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
                      fontWeight: 400,
                    }}
                  />
                )}

                {/* DOWNLOAD BUTTON WITH DROPDOWN MENU - Google Style */}
                <Box sx={{ 
                  display: "flex", 
                  gap: 1, 
                  alignItems: "center",
                  flexWrap: 'wrap',
                }}>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadClick}
                    variant="contained"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      borderRadius: '12px',
                      alignSelf: { xs: "flex-start", sm: "center" },
                      backgroundColor: '#4285f4',
                      color: 'white',
                      fontWeight: 500,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.75, sm: 1 },
                      fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                      "&:hover": {
                        backgroundColor: '#3367d6',
                        boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                      },
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
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          </Fade>

          {/* DOWNLOAD MENU - Google Style */}
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
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                borderRadius: '12px',
                boxShadow: darkMode 
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
              }
            }}
          >
            <MenuItem 
              onClick={handleDownloadCSV}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileDownloadIcon fontSize="small" />
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Download CSV
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={handleDownloadExcel}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ExcelIcon fontSize="small" />
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Download Excel
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={handleDownloadPDF}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.875rem',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PdfIcon fontSize="small" />
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Download PDF
                </Typography>
              </Box>
            </MenuItem>
            <Divider sx={{ 
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              my: 0.5,
            }} />
            <MenuItem 
              onClick={handleExportAll}
              sx={{
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloudDownloadIcon fontSize="small" />
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  Export All Data
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* Main Content - Google Styled */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 1400,
            margin: "0 auto",
            minHeight: "100vh",
          }}
        >
          {/* Stats Header - Google Style */}
          <Fade in timeout={400}>
            <Paper
              sx={{
                p: { xs: 3, sm: 4 },
                mb: 3,
                borderRadius: '16px',
                background: darkMode 
                  ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
                  : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
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
                    <Typography 
                      variant={getResponsiveTypography('h5', 'h4', 'h4') as any}
                      fontWeight={500}
                      color="white"
                      sx={{ 
                        fontSize: getResponsiveTypography('1.25rem', '1.5rem', '1.75rem'),
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Material Inventory
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body2" : "body1"}
                      sx={{
                        opacity: 0.95,
                        color: 'white',
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                      }}
                    >
                      Manage and track your materials, stock levels, and usage
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Button
                      startIcon={<Refresh />}
                      onClick={handleRefresh}
                      variant="outlined"
                      disabled={loading}
                      sx={{ 
                        borderRadius: '12px',
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                      }}
                    >
                      Refresh
                    </Button>
                    <Button
                      startIcon={<Add />}
                      onClick={handleCreateMaterial}
                      variant="contained"
                      sx={{ 
                        borderRadius: '12px',
                        backgroundColor: '#34a853',
                        color: 'white',
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: '#2d9248',
                          boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                        },
                        fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                      }}
                    >
                      Add Material
                    </Button>
                  </Stack>
                </Box>

                {/* Quick Stats - Google Style */}
                <Box sx={{ 
                  display: "flex", 
                  gap: 3, 
                  mt: 3, 
                  flexWrap: "wrap",
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 1.5,
                      mb: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                    }}>
                      <Inventory sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
                      }}
                    >
                      Total Materials
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={500}
                      color="white"
                      sx={{ 
                        fontSize: getResponsiveTypography('1.25rem', '1.5rem', '1.75rem'),
                      }}
                    >
                      {pagination.total}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 1.5,
                      mb: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                    }}>
                      <Group sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
                      }}
                    >
                      Selected
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={500}
                      color="#fbbc04"
                      sx={{ 
                        fontSize: getResponsiveTypography('1.25rem', '1.5rem', '1.75rem'),
                      }}
                    >
                      {selectedMaterials.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 1.5,
                      mb: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                    }}>
                      <TrendingUp sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
                      }}
                    >
                      Page {pagination.page} of {pagination.pages}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={500}
                      color="white"
                      sx={{ 
                        fontSize: getResponsiveTypography('1.25rem', '1.5rem', '1.75rem'),
                      }}
                    >
                      {pagination.limit} per page
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* EVERYTHING BELOW REMAINS THE SAME FUNCTIONALITY BUT WITH GOOGLE STYLING */}
          {/* Bulk Actions - Google Style */}
          {selectedMaterials.length > 0 && (
            <Fade in timeout={500}>
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Typography 
                    variant="body1" 
                    fontWeight={500}
                    sx={{ 
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontSize: getResponsiveTypography('0.9rem', '0.95rem', '1rem'),
                    }}
                  >
                    {selectedMaterials.length} material(s) selected
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<Delete />}
                      onClick={handleBulkDelete}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: '8px',
                        borderColor: darkMode ? '#ea4335' : '#d93025',
                        color: darkMode ? '#ea4335' : '#d93025',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: darkMode ? '#ea4335' : '#d93025',
                          backgroundColor: darkMode ? 'rgba(234,67,53,0.1)' : 'rgba(217,48,37,0.1)',
                        },
                      }}
                    >
                      Delete Selected
                    </Button>
                    <Button
                      onClick={clearSelection}
                      variant="text"
                      size="small"
                      sx={{ 
                        borderRadius: '8px',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 400,
                      }}
                    >
                      Clear Selection
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Fade>
          )}

          {/* Filters - Keep as is but with dark mode support */}
          <MaterialFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* View Mode Toggle - Google Style */}
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
            <Typography 
              variant={isMobile ? "body2" : "body1"}
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
              }}
            >
              Showing {materials.length} of {pagination.total} materials
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<GridView />}
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "contained" : "outlined"}
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                  fontWeight: 500,
                  backgroundColor: viewMode === "grid" ? '#4285f4' : 'transparent',
                  color: viewMode === "grid" ? 'white' : (darkMode ? '#e8eaed' : '#202124'),
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  "&:hover": {
                    borderColor: viewMode === "grid" ? '#4285f4' : (darkMode ? '#5f6368' : '#202124'),
                  },
                }}
              >
                Grid
              </Button>
              <Button
                startIcon={<ViewList />}
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "contained" : "outlined"}
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                  fontWeight: 500,
                  backgroundColor: viewMode === "list" ? '#4285f4' : 'transparent',
                  color: viewMode === "list" ? 'white' : (darkMode ? '#e8eaed' : '#202124'),
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  "&:hover": {
                    borderColor: viewMode === "list" ? '#4285f4' : (darkMode ? '#5f6368' : '#202124'),
                  },
                }}
              >
                List
              </Button>
            </Stack>
          </Box>

          {/* Error Alert - Google Style */}
          {error && (
            <Fade in>
              <Alert
                severity="error"
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#422006' : '#fef7e0',
                  color: darkMode ? '#fbbc04' : '#f57c00',
                  border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80',
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  fontWeight: 400,
                }}
                onClose={() => setError(null)}
              >
                {typeof error === "string" ? error : "An error occurred"}
              </Alert>
            </Fade>
          )}

          {/* Material Grid - Pass dark mode prop */}
          <MaterialGrid
            materials={materials}
            loading={loading}
            selectedMaterials={selectedMaterials}
            viewMode={viewMode}
            onMaterialSelect={(material) => toggleMaterialSelection(material._id)}
            onMaterialEdit={handleEditMaterial}
            onMaterialDelete={handleDeleteMaterial}
            onMaterialUse={handleUseMaterial}
            onMaterialRestock={handleRestockMaterial}
            onViewDetails={handleViewDetails}
            onCreateMaterial={handleCreateMaterial}
            emptyMessage="No materials found. Add your first material to get started."
            // darkMode={darkMode}
          />

          {/* Pagination - Google Style */}
          {pagination.pages > 1 && (
            <Fade in>
              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  borderRadius: '12px',
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                }}
              >
                <Button
                  onClick={() => handleFiltersChange({ page: pagination.page - 1 })}
                  disabled={pagination.page === 1 || loading}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                    "&:hover": {
                      borderColor: darkMode ? '#5f6368' : '#202124',
                    },
                    "&.Mui-disabled": {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#5f6368' : '#9aa0a6',
                    }
                  }}
                >
                  Previous
                </Button>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                  }}
                >
                  Page {pagination.page} of {pagination.pages}
                </Typography>

                <Button
                  onClick={() => handleFiltersChange({ page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages || loading}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                    "&:hover": {
                      borderColor: darkMode ? '#5f6368' : '#202124',
                    },
                    "&.Mui-disabled": {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#5f6368' : '#9aa0a6',
                    }
                  }}
                >
                  Next
                </Button>
              </Paper>
            </Fade>
          )}

          {/* Dialogs - These will maintain their existing functionality */}
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

          {/* Delete Confirmation Dialog - Google Style */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderRadius: '16px',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }
            }}
          >
            <DialogTitle 
              sx={{ 
                fontWeight: 500,
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Delete Material
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 300,
                  fontSize: getResponsiveTypography('0.9rem', '0.95rem', '1rem'),
                }}
              >
                Are you sure you want to delete &quot;
                {selectedMaterial?.name || "this material"}&quot;? This action
                cannot be undone.
              </Typography>
              {selectedMaterial?.currentStock &&
                selectedMaterial.currentStock > 0 && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mt: 2,
                      backgroundColor: darkMode ? '#422006' : '#fef7e0',
                      color: darkMode ? '#fbbc04' : '#f57c00',
                      border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80',
                      borderRadius: '8px',
                      fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                    }}
                  >
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
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 400,
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteMaterial}
                variant="contained"
                disabled={deleting}
                startIcon={
                  deleting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
                sx={{
                  backgroundColor: '#ea4335',
                  color: 'white',
                  fontWeight: 500,
                  borderRadius: '8px',
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  "&:hover": {
                    backgroundColor: '#d93025',
                  },
                  "&.Mui-disabled": {
                    backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }
                }}
              >
                {deleting ? "Deleting..." : "Delete Material"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Snackbar - Google Style */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage("")}
            message={successMessage}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            ContentProps={{
              sx: {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderRadius: '8px',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                fontWeight: 400,
              }
            }}
          />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default MaterialListPage;