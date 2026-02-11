'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Badge,
  Tooltip,
  alpha,
  LinearProgress,
  Fab,
  Breadcrumbs,
  Link as MuiLink,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Sort as SortIcon,
  CloudOff as CloudOffIcon,
  CloudQueue as CloudQueueIcon,
  Sync as SyncIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Category as CategoryIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { offlineStorage } from "@/utils/offlineStorage";
import { useRouter } from "next/navigation";
import { Product } from "@/types/indexs";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    products,
    isLoading,
    error,
    isOnline,
    stats,
    lowStockProducts,
    expiredProducts,
    refetch,
    clearError,
  } = useProducts();

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);

  // Load sync status
  useEffect(() => {
    const loadSyncStatus = async () => {
      try {
        const status = await offlineStorage.getSyncStatus();
        setSyncStatus(status);
      } catch (error) {
        console.error("Failed to load sync status:", error);
      }
    };

    loadSyncStatus();
    const interval = setInterval(loadSyncStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      showSnackbar("Back online - syncing data...", "success");
      handleManualSync();
    };

    const handleOffline = () => {
      showSnackbar("You are offline - changes saved locally", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
      clearError();
    }
  }, [error, clearError]);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const handleManualSync = async () => {
    if (!isOnline) {
      showSnackbar("Cannot sync while offline", "warning");
      return;
    }

    try {
      showSnackbar("Syncing products...", "info");
      await offlineStorage.processSyncQueue();
      await refetch();
      showSnackbar("Sync completed successfully", "success");
    } catch (error) {
      console.error("Sync failed:", error);
      showSnackbar("Sync failed", "error");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p: Product) => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product: Product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        product.gstDetails.hsnCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    result.sort((a: Product, b: Product) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "price":
          valueA = a.basePrice;
          valueB = b.basePrice;
          break;
        case "stock":
          const stockA = a.variations.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) +
            a.batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
          const stockB = b.variations.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) +
            b.batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
          valueA = stockA;
          valueB = stockB;
          break;
        case "createdAt":
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return result;
  }, [products, searchTerm, selectedCategories, sortBy, sortOrder]);

  // Handle sort selection
  const handleSortSelect = (option: "name" | "price" | "stock" | "createdAt") => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("desc");
    }
    setSortAnchor(null);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Export products to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Brand",
      "HSN Code",
      "Base Price",
      "Total Stock",
      "Total Value",
    ];
    const csvData = products.map((product: Product) => {
      const totalStock = product.variations.reduce(
        (sum: number, v: any) => sum + (v.stock || 0),
        0
      ) + product.batches.reduce(
        (sum: number, b: any) => sum + (b.quantity || 0),
        0
      );
      const totalValue = product.variations.reduce(
        (sum: number, v: any) => sum + (v.price || 0) * (v.stock || 0),
        0
      ) + product.batches.reduce(
        (sum: number, b: any) => sum + (b.sellingPrice || 0) * (b.quantity || 0),
        0
      );
      return [
        product.name,
        product.sku || "",
        product.category,
        product.brand || "",
        product.gstDetails.hsnCode,
        product.basePrice,
        totalStock,
        totalValue,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showSnackbar("Products exported to CSV", "success");
    setMoreMenuAnchor(null);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSortBy("createdAt");
    setSortOrder("desc");
    showSnackbar("Filters reset", "info");
  };

  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <MainLayout title="Products">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 400,
            flexDirection: 'column',
            gap: 3,
          }}>
            <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Loading products...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Products">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header - Google Material Design Style */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Tooltip title="Back to Dashboard">
              <IconButton
                onClick={handleBack}
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <BackIcon sx={{ color: darkMode ? '#e8eaed' : '#202124' }} />
              </IconButton>
            </Tooltip>
            <Breadcrumbs>
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </MuiLink>
              <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                Products
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                fontWeight={500}
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  letterSpacing: '-0.5px',
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                }}
              >
                Product Catalog
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                Manage your inventory and track {products.length} products
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                flexShrink: 0,
              }}
            >
              {/* Status Indicators */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  order: { xs: 1, sm: 0 },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                {!isOnline && (
                  <Chip
                    label="Offline"
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                      color: darkMode ? '#fdd663' : '#fbbc04',
                      border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.3)' : 'rgba(251, 188, 4, 0.2)'}`,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  />
                )}
                {syncStatus?.pendingSyncCount > 0 && (
                  <Chip
                    label={`${syncStatus.pendingSyncCount} pending`}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)',
                      color: darkMode ? '#fdd663' : '#fbbc04',
                      border: 'none',
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  />
                )}
              </Stack>

              {/* Action Buttons - Responsive */}
              {isMobile ? (
                <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/products/add")}
                    disabled={!isOnline}
                    sx={{
                      flex: 1,
                      minHeight: 44,
                      borderRadius: '24px',
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      color: darkMode ? '#202124' : '#ffffff',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  >
                    Add Product
                  </Button>
                  <IconButton
                    onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
                    sx={{
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: '24px',
                      width: 44,
                      height: 44,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                      },
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Stack>
              ) : isTablet ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/products/add")}
                    disabled={!isOnline}
                    sx={{
                      minHeight: 40,
                      borderRadius: '24px',
                      px: 2.5,
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      color: darkMode ? '#202124' : '#ffffff',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                      },
                    }}
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportToCSV}
                    disabled={products.length === 0}
                    sx={{
                      minHeight: 40,
                      borderRadius: '24px',
                      px: 2.5,
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  >
                    Export
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportToCSV}
                    disabled={products.length === 0}
                    sx={{
                      minHeight: 48,
                      borderRadius: '28px',
                      px: 3,
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/products/add")}
                    disabled={!isOnline}
                    sx={{
                      minHeight: 48,
                      borderRadius: '28px',
                      px: 3,
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      color: darkMode ? '#202124' : '#ffffff',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                        boxShadow: darkMode
                          ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                          : '0 4px 12px rgba(26, 115, 232, 0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  >
                    Add Product
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Status Bar - Google Material Design Style */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    backgroundColor: isOnline
                      ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)'
                      : darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                    border: `1px solid ${
                      isOnline
                        ? darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'
                        : darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'
                    }`,
                  }}
                >
                  {isOnline ? (
                    <CloudQueueIcon sx={{ fontSize: 16, color: darkMode ? '#34a853' : '#34a853' }} />
                  ) : (
                    <CloudOffIcon sx={{ fontSize: 16, color: darkMode ? '#fdd663' : '#fbbc04' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: isOnline
                        ? darkMode ? '#34a853' : '#34a853'
                        : darkMode ? '#fdd663' : '#fbbc04',
                    }}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>

                {syncStatus?.pendingSyncCount > 0 && (
                  <Tooltip title={`${syncStatus.pendingSyncCount} items waiting to sync`}>
                    <Badge
                      badgeContent={syncStatus.pendingSyncCount}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: darkMode ? '#fdd663' : '#fbbc04',
                          color: darkMode ? '#202124' : '#ffffff',
                          fontSize: '0.65rem',
                          height: 18,
                          minWidth: 18,
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={handleManualSync}
                        disabled={!isOnline}
                        sx={{
                          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)',
                          },
                        }}
                      >
                        <SyncIcon sx={{ fontSize: 18, color: darkMode ? '#fdd663' : '#fbbc04' }} />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Storage: {syncStatus?.storageUsage?.totalMB?.toFixed(1) || '0.0'} MB
                </Typography>

                {selectedCategories.length > 0 && (
                  <Chip
                    label={`${selectedCategories.length} categories`}
                    size="small"
                    onDelete={() => setSelectedCategories([])}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                color: darkMode ? '#f28b82' : '#c5221f',
                '& .MuiAlert-icon': {
                  color: darkMode ? '#f28b82' : '#c5221f',
                },
              }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={clearError}
                  sx={{
                    color: darkMode ? '#f28b82' : '#c5221f',
                    textTransform: 'none',
                  }}
                >
                  Dismiss
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Search and Filters - Google Material Design Style */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <TextField
                placeholder="Search products by name, category, brand, SKU, or HSN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}>
                        <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: '1rem' }}>
                          ✕
                        </Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
                sx={{ flex: 1, minWidth: { xs: "100%", sm: "300px" } }}
                size="small"
              />

              <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-end', sm: 'flex-start' }}>
                <Tooltip title="Sort">
                  <IconButton
                    onClick={(e) => setSortAnchor(e.currentTarget)}
                    sx={{
                      color: sortBy !== "createdAt"
                        ? darkMode ? '#8ab4f8' : '#1a73e8'
                        : darkMode ? '#9aa0a6' : '#5f6368',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: '12px',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                      },
                    }}
                  >
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Filter by category">
                  <IconButton
                    onClick={(e) => setFilterAnchor(e.currentTarget)}
                    sx={{
                      color: selectedCategories.length > 0
                        ? darkMode ? '#8ab4f8' : '#1a73e8'
                        : darkMode ? '#9aa0a6' : '#5f6368',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: '12px',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                      },
                    }}
                  >
                    <Badge
                      badgeContent={selectedCategories.length}
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          color: darkMode ? '#202124' : '#ffffff',
                          fontSize: '0.6rem',
                          height: 16,
                          minWidth: 16,
                        },
                      }}
                    >
                      <FilterIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {(searchTerm || selectedCategories.length > 0 || sortBy !== "createdAt") && (
                  <Button
                    size="small"
                    onClick={resetFilters}
                    sx={{
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: '20px',
                      px: 2,
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Active filters display */}
            {(selectedCategories.length > 0 || searchTerm) && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onDelete={() => handleCategorySelect(category)}
                    icon={<CategoryIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                      '& .MuiChip-deleteIcon': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  />
                ))}
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    size="small"
                    onDelete={() => setSearchTerm("")}
                    icon={<SearchIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                    }}
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Stats Cards - Google Material Design Style */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              "& > *": {
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
              },
            }}
          >
            <Card
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Total Products
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Card
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                    color: darkMode ? '#fdd663' : '#fbbc04',
                  }}
                >
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stats.lowStockCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Low Stock
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Card
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                    color: darkMode ? '#f28b82' : '#ea4335',
                  }}
                >
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stats.expiredCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Expired/Expiring
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Card
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                    color: darkMode ? '#81c995' : '#34a853',
                  }}
                >
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    ₹{stats.totalValue?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Total Value
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>

          {/* Tabs - Google Material Design Style */}
          <Paper
            sx={{
              borderRadius: '16px',
              mb: 3,
              overflow: 'hidden',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTabs-indicator': {
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  height: 3,
                },
                '& .MuiTab-root': {
                  fontWeight: 500,
                  textTransform: 'none',
                  minHeight: 48,
                  fontSize: '0.875rem',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab
                label={`All Products (${filteredProducts.length})`}
                icon={<InventoryIcon sx={{ fontSize: '1.1rem !important' }} />}
                iconPosition="start"
              />
              <Tab
                label={`Low Stock (${lowStockProducts.length})`}
                icon={<WarningIcon sx={{ fontSize: '1.1rem !important', color: darkMode ? '#fdd663' : '#fbbc04' }} />}
                iconPosition="start"
              />
              <Tab
                label="Categories"
                icon={<CategoryIcon sx={{ fontSize: '1.1rem !important' }} />}
                iconPosition="start"
              />
              <Tab
                label={`Expired (${expiredProducts.length})`}
                icon={<WarningIcon sx={{ fontSize: '1.1rem !important', color: darkMode ? '#f28b82' : '#ea4335' }} />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Products Grid */}
          <TabPanel value={tabValue} index={0}>
            {filteredProducts.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  No Products Found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}
                >
                  {searchTerm || selectedCategories.length > 0
                    ? "Try adjusting your search or filters"
                    : "Add your first product to get started"}
                </Typography>
                {!searchTerm && selectedCategories.length === 0 && (
                  <Button
                    variant="contained"
                    onClick={() => router.push("/products/add")}
                    disabled={!isOnline}
                    sx={{
                      borderRadius: '28px',
                      px: 4,
                      py: 1.25,
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      color: darkMode ? '#202124' : '#ffffff',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                      },
                    }}
                  >
                    Add First Product
                  </Button>
                )}
              </Paper>
            ) : (
              <>
                {/* Results Summary */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Showing {filteredProducts.length} of {products.length} products
                  </Typography>
                  <Chip
                    label={`Sorted by: ${sortBy} (${sortOrder})`}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                      fontSize: '0.75rem',
                    }}
                  />
                </Stack>

                {/* Products Grid */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    "& > *": {
                      flex: "1 1 300px",
                      maxWidth: "100%",
                      minWidth: { xs: "100%", sm: "300px", md: "calc(33.33% - 16px)" },
                    },
                  }}
                >
                  {filteredProducts.map((product: Product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isOnline={isOnline}
                      onSync={handleManualSync}
                    />
                  ))}
                </Box>
              </>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {lowStockProducts.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                    color: darkMode ? '#81c995' : '#34a853',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  All Stock Levels Good!
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  No products are currently low on stock.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  "& > *": {
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: { xs: "100%", sm: "300px", md: "calc(33.33% - 16px)" },
                  },
                }}
              >
                {lowStockProducts.map((product: Product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isOnline={isOnline}
                    onSync={handleManualSync}
                  />
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {categories.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  No Categories Found
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Add products to see categories.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  "& > *": {
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: { xs: "100%", sm: "300px", md: "calc(33.33% - 16px)" },
                  },
                }}
              >
                {categories.map((category) => {
                  const categoryProducts = products.filter(
                    (p: Product) => p.category === category
                  );
                  const totalStock = categoryProducts.reduce(
                    (sum: number, p: Product) =>
                      sum +
                      p.variations.reduce((vSum: number, v: any) => vSum + (v.stock || 0), 0) +
                      p.batches.reduce((bSum: number, b: any) => bSum + (b.quantity || 0), 0),
                    0
                  );
                  const totalValue = categoryProducts.reduce(
                    (sum: number, p: Product) =>
                      sum +
                      p.variations.reduce((vSum: number, v: any) => vSum + (v.price || 0) * (v.stock || 0), 0) +
                      p.batches.reduce((bSum: number, b: any) => bSum + (b.sellingPrice || 0) * (b.quantity || 0), 0),
                    0
                  );
                  const lowStock = categoryProducts.filter((p: Product) =>
                    p.variations.some((v: any) => (v.stock || 0) <= 10) ||
                    p.batches.some((b: any) => (b.quantity || 0) <= 10)
                  ).length;

                  return (
                    <Card
                      key={category}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        height: '100%',
                        '&:hover': {
                          boxShadow: darkMode
                            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                            : '0 8px 16px rgba(0, 0, 0, 0.08)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            }}
                          >
                            <CategoryIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {category}
                          </Typography>
                        </Stack>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {categoryProducts.length} Products
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {Math.round((categoryProducts.length / products.length) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(categoryProducts.length / products.length) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: darkMode ? '#3c4043' : '#e8eaed',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>

                        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                        <Stack direction="row" spacing={2}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              Total Stock
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {totalStock}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              Total Value
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              ₹{totalValue.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              Low Stock
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#fdd663' : '#fbbc04' }}>
                              {lowStock}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedCategories([category]);
                            setTabValue(0);
                          }}
                          sx={{
                            borderRadius: '20px',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            },
                          }}
                        >
                          View Products
                        </Button>
                      </Stack>
                    </Card>
                  );
                })}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {expiredProducts.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                    color: darkMode ? '#81c995' : '#34a853',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  No Expired Products!
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  All product batches are up-to-date.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  "& > *": {
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: { xs: "100%", sm: "300px", md: "calc(33.33% - 16px)" },
                  },
                }}
              >
                {expiredProducts.map((product: Product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isOnline={isOnline}
                    onSync={handleManualSync}
                  />
                ))}
              </Box>
            )}
          </TabPanel>

          {/* Sort Menu - Google Material Design Style */}
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={() => setSortAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: darkMode
                  ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                  : '0 8px 16px rgba(0, 0, 0, 0.08)',
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => handleSortSelect("name")}
              selected={sortBy === "name"}
              sx={{
                minWidth: 200,
                py: 1.5,
                px: 2.5,
                color: sortBy === "name"
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? " ↑" : " ↓")}
            </MenuItem>
            <MenuItem
              onClick={() => handleSortSelect("price")}
              selected={sortBy === "price"}
              sx={{
                py: 1.5,
                px: 2.5,
                color: sortBy === "price"
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Price {sortBy === "price" && (sortOrder === "asc" ? " ↑" : " ↓")}
            </MenuItem>
            <MenuItem
              onClick={() => handleSortSelect("stock")}
              selected={sortBy === "stock"}
              sx={{
                py: 1.5,
                px: 2.5,
                color: sortBy === "stock"
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Stock Level {sortBy === "stock" && (sortOrder === "asc" ? " ↑" : " ↓")}
            </MenuItem>
            <MenuItem
              onClick={() => handleSortSelect("createdAt")}
              selected={sortBy === "createdAt"}
              sx={{
                py: 1.5,
                px: 2.5,
                color: sortBy === "createdAt"
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Recently Added {sortBy === "createdAt" && (sortOrder === "asc" ? " ↑" : " ↓")}
            </MenuItem>
          </Menu>

          {/* Filter Menu - Google Material Design Style */}
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(null)}
            PaperProps={{
              sx: {
                maxHeight: 300,
                width: 250,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: darkMode
                  ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                  : '0 8px 16px rgba(0, 0, 0, 0.08)',
                mt: 1,
              },
            }}
          >
            <MenuItem
              dense
              sx={{
                fontWeight: 600,
                color: darkMode ? '#e8eaed' : '#202124',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                pointerEvents: 'none',
              }}
            >
              Categories
            </MenuItem>
            <MenuItem
              dense
              onClick={() => setSelectedCategories([])}
              sx={{
                color: selectedCategories.length === 0
                  ? darkMode ? '#8ab4f8' : '#1a73e8'
                  : darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              All Categories
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category}
                dense
                onClick={() => handleCategorySelect(category)}
                sx={{
                  pl: 3,
                  color: selectedCategories.includes(category)
                    ? darkMode ? '#8ab4f8' : '#1a73e8'
                    : darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                {category}
              </MenuItem>
            ))}
          </Menu>

          {/* More Actions Menu (Mobile) - Google Material Design Style */}
          <Menu
            anchorEl={moreMenuAnchor}
            open={Boolean(moreMenuAnchor)}
            onClose={() => setMoreMenuAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: darkMode
                  ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                  : '0 8px 16px rgba(0, 0, 0, 0.08)',
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={exportToCSV}
              disabled={products.length === 0}
              sx={{
                py: 1.5,
                px: 2.5,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              <FileDownloadIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              Export to CSV
            </MenuItem>
            <MenuItem
              onClick={handleManualSync}
              disabled={!isOnline}
              sx={{
                py: 1.5,
                px: 2.5,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              <SyncIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              Sync Now
            </MenuItem>
          </Menu>

          {/* Snackbar - Google Material Design Style */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{
                width: "100%",
                borderRadius: '12px',
                backgroundColor: darkMode
                  ? snackbar.severity === 'success' ? 'rgba(52, 168, 83, 0.1)' :
                    snackbar.severity === 'error' ? 'rgba(234, 67, 53, 0.1)' :
                    snackbar.severity === 'warning' ? 'rgba(251, 188, 4, 0.1)' :
                    'rgba(138, 180, 248, 0.1)'
                  : snackbar.severity === 'success' ? 'rgba(52, 168, 83, 0.05)' :
                    snackbar.severity === 'error' ? 'rgba(234, 67, 53, 0.05)' :
                    snackbar.severity === 'warning' ? 'rgba(251, 188, 4, 0.05)' :
                    'rgba(26, 115, 232, 0.05)',
                border: `1px solid ${
                  snackbar.severity === 'success' ? darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)' :
                  snackbar.severity === 'error' ? darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)' :
                  snackbar.severity === 'warning' ? darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)' :
                  darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'
                }`,
                color: darkMode
                  ? snackbar.severity === 'success' ? '#81c995' :
                    snackbar.severity === 'error' ? '#f28b82' :
                    snackbar.severity === 'warning' ? '#fdd663' :
                    '#8ab4f8'
                  : snackbar.severity === 'success' ? '#1e7e34' :
                    snackbar.severity === 'error' ? '#c5221f' :
                    snackbar.severity === 'warning' ? '#b45a1c' :
                    '#1a73e8',
                '& .MuiAlert-icon': {
                  color: 'inherit',
                },
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Refresh Button - Google Material Design Style */}
          <Fab
            color="primary"
            size="medium"
            onClick={() => refetch()}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              boxShadow: darkMode
                ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                : '0 4px 12px rgba(26, 115, 232, 0.3)',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              },
            }}
          >
            <RefreshIcon />
          </Fab>
        </Box>
      </Container>
    </MainLayout>
  );
}