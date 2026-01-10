// app/products/page.tsx - COMPLETE FIXED VERSION
"use client";

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
} from "@mui/material";
import {
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
} from "@mui/icons-material";
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
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
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
    severity: "info" as "success" | "error" | "info" | "warning",
  });
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "stock" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
          const stockA = a.variations.reduce((sum: number, v: any) => sum + v.stock, 0);
          const stockB = b.variations.reduce((sum: number, v: any) => sum + v.stock, 0);
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
  const handleSortSelect = (
    option: "name" | "price" | "stock" | "createdAt"
  ) => {
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
        (sum: number, v: any) => sum + v.stock,
        0
      );
      const totalValue = product.variations.reduce(
        (sum: number, v: any) => sum + v.price * v.stock,
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
      <MainLayout title="Product Management">
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading Products...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isOnline ? "Fetching from server" : "Loading from local storage"}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Product Management">
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", px: { xs: 2, sm: 3 } }}>
        {/* Status Bar */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "background.default",
            position: "sticky",
            top: 70,
            zIndex: 1000,
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isOnline ? (
                <>
                  <CloudQueueIcon color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    Online
                  </Typography>
                </>
              ) : (
                <>
                  <CloudOffIcon color="warning" fontSize="small" />
                  <Typography variant="body2" color="warning.main">
                    Offline
                  </Typography>
                </>
              )}

              {syncStatus?.pendingSyncCount > 0 && (
                <Tooltip
                  title={`${syncStatus.pendingSyncCount} items waiting to sync`}
                >
                  <Badge
                    badgeContent={syncStatus.pendingSyncCount}
                    color="warning"
                    sx={{ ml: 1 }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleManualSync}
                      disabled={!isOnline}
                      sx={{
                        bgcolor: "warning.light",
                        "&:hover": { bgcolor: "warning.main" },
                      }}
                    >
                      <SyncIcon fontSize="small" />
                    </IconButton>
                  </Badge>
                </Tooltip>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Storage: {syncStatus?.storageUsage?.totalMB?.toFixed(1)} MB
              </Typography>

              {selectedCategories.length > 0 && (
                <Chip
                  label={`${selectedCategories.length} categories`}
                  size="small"
                  onDelete={() => setSelectedCategories([])}
                />
              )}
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={clearError}>
                Dismiss
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                📦 Product Catalog
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isOnline
                  ? "Manage your inventory in real-time"
                  : "Offline Mode - Viewing local data"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={exportToCSV}
                disabled={products.length === 0}
                size="small"
              >
                Export
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/products/add")}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:disabled": {
                    bgcolor: alpha("#667eea", 0.5),
                  },
                }}
                disabled={!isOnline}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Paper
            sx={{ p: 3, mb: 3, borderRadius: "12px", position: "relative" }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                placeholder="Search products by name, category, brand, SKU, or HSN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                      >
                        ✕
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: { xs: "100%", sm: "300px" } }}
                size="small"
              />

              <IconButton
                onClick={(e) => setSortAnchor(e.currentTarget)}
                color={sortBy !== "createdAt" ? "primary" : "default"}
                size="small"
              >
                <SortIcon />
              </IconButton>

              <IconButton
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                color={selectedCategories.length > 0 ? "primary" : "default"}
                size="small"
              >
                <FilterIcon />
              </IconButton>

              {(searchTerm ||
                selectedCategories.length > 0 ||
                sortBy !== "createdAt") && (
                <Button size="small" onClick={resetFilters} sx={{ ml: "auto" }}>
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Active filters display */}
            {(selectedCategories.length > 0 || searchTerm) && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onDelete={() => handleCategorySelect(category)}
                    icon={<CategoryIcon fontSize="small" />}
                  />
                ))}
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    size="small"
                    onDelete={() => setSearchTerm("")}
                    icon={<SearchIcon fontSize="small" />}
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Stats Cards - Using Box instead of Grid */}
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
                p: 2,
                textAlign: "center",
                borderLeft: "4px solid",
                borderColor: "primary.main",
                height: "100%",
              }}
            >
              <InventoryIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Products
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: "center",
                borderLeft: "4px solid",
                borderColor: "warning.main",
                height: "100%",
              }}
            >
              <WarningIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {stats.lowStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: "center",
                borderLeft: "4px solid",
                borderColor: "error.main",
                height: "100%",
              }}
            >
              <WarningIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {stats.expiredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expired/Expiring
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: "center",
                borderLeft: "4px solid",
                borderColor: "success.main",
                height: "100%",
              }}
            >
              <InventoryIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                ₹{stats.totalValue?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </Card>
          </Box>

          {/* Tabs */}
          <Paper sx={{ borderRadius: "12px", mb: 3, overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  minHeight: 48,
                },
                bgcolor: "background.paper",
              }}
            >
              <Tab
                label={`All Products (${filteredProducts.length})`}
                icon={<InventoryIcon fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Low Stock (${lowStockProducts.length})`}
                icon={<WarningIcon fontSize="small" color="warning" />}
                iconPosition="start"
              />
              <Tab
                label="Categories"
                icon={<CategoryIcon fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Expired (${expiredProducts.length})`}
                icon={<WarningIcon fontSize="small" color="error" />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Box>

        {/* Products Grid */}
        <TabPanel value={tabValue} index={0}>
          {filteredProducts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
              <InventoryIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || selectedCategories.length > 0
                  ? "Try adjusting your search or filters"
                  : "Add your first product to get started"}
              </Typography>
              {!searchTerm && selectedCategories.length === 0 && (
                <Button
                  variant="contained"
                  onClick={() => router.push("/products/add")}
                  disabled={!isOnline}
                >
                  Add First Product
                </Button>
              )}
            </Paper>
          ) : (
            <>
              {/* Results Summary */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sorted by: {sortBy} ({sortOrder})
                </Typography>
              </Box>

              {/* Products Grid using Box instead of Grid */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  "& > *": {
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: { xs: "100%", sm: "300px" },
                  },
                }}
              >
                {filteredProducts.map((product: Product) => (
                  <Box key={product._id}>
                    <ProductCard
                      product={product}
                      isOnline={isOnline}
                      onSync={handleManualSync}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {lowStockProducts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
              <InventoryIcon
                sx={{
                  fontSize: 64,
                  color: "success.main",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="success.main" gutterBottom>
                All Stock Levels Good!
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                  minWidth: { xs: "100%", sm: "300px" },
                },
              }}
            >
              {lowStockProducts.map((product: Product) => (
                <Box key={product._id}>
                  <ProductCard
                    product={product}
                    isOnline={isOnline}
                    onSync={handleManualSync}
                  />
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {categories.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
              <CategoryIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Categories Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                  minWidth: { xs: "100%", sm: "300px" },
                },
              }}
            >
              {categories.map((category) => {
                const categoryProducts = products.filter(
                  (p: Product) => p.category === category
                );
                const categoryStats = {
                  totalProducts: categoryProducts.length,
                  totalStock: categoryProducts.reduce(
                    (sum: number, p: Product) =>
                      sum +
                      p.variations.reduce((vSum: number, v: any) => vSum + v.stock, 0),
                    0
                  ),
                  totalValue: categoryProducts.reduce(
                    (sum: number, p: Product) =>
                      sum +
                      p.variations.reduce((vSum: number, v: any) => vSum + v.price * v.stock, 0),
                    0
                  ),
                  lowStock: categoryProducts.filter((p: Product) =>
                    p.variations.some((v: any) => v.stock <= 10)
                  ).length,
                };

                return (
                  <Box key={category} sx={{ flex: "1 1 300px" }}>
                    <Card sx={{ p: 3, height: "100%" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <CategoryIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {category}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {categoryProducts.length} Products
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            (categoryProducts.length / products.length) * 100,
                            100
                          )}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Box sx={{ flex: "1 1 100px" }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Stock
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {categoryStats.totalStock}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 100px" }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Value
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ₹{categoryStats.totalValue.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 100px" }}>
                          <Typography variant="caption" color="text.secondary">
                            Low Stock
                          </Typography>
                          <Typography
                            variant="body2"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {categoryStats.lowStock}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => {
                          setSelectedCategories([category]);
                          setTabValue(0);
                        }}
                      >
                        View Products
                      </Button>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {expiredProducts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
              <InventoryIcon
                sx={{
                  fontSize: 64,
                  color: "success.main",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="success.main" gutterBottom>
                No Expired Products!
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                  minWidth: { xs: "100%", sm: "300px" },
                },
              }}
            >
              {expiredProducts.map((product: Product) => (
                <Box key={product._id}>
                  <ProductCard
                    product={product}
                    isOnline={isOnline}
                    onSync={handleManualSync}
                  />
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchor}
          open={Boolean(sortAnchor)}
          onClose={() => setSortAnchor(null)}
        >
          <MenuItem
            onClick={() => handleSortSelect("name")}
            selected={sortBy === "name"}
          >
            Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </MenuItem>
          <MenuItem
            onClick={() => handleSortSelect("price")}
            selected={sortBy === "price"}
          >
            Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
          </MenuItem>
          <MenuItem
            onClick={() => handleSortSelect("stock")}
            selected={sortBy === "stock"}
          >
            Stock Level{" "}
            {sortBy === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
          </MenuItem>
          <MenuItem
            onClick={() => handleSortSelect("createdAt")}
            selected={sortBy === "createdAt"}
          >
            Recently Added{" "}
            {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
          </MenuItem>
        </Menu>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{ sx: { maxHeight: 300, width: 250 } }}
        >
          <MenuItem dense sx={{ fontWeight: "bold" }}>
            Categories
          </MenuItem>
          <MenuItem dense onClick={() => setSelectedCategories([])}>
            <Typography
              variant="body2"
              color={
                selectedCategories.length === 0 ? "primary" : "text.secondary"
              }
            >
              All Categories
            </Typography>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem
              key={category}
              dense
              onClick={() => handleCategorySelect(category)}
              sx={{ pl: 3 }}
            >
              <Typography
                variant="body2"
                color={
                  selectedCategories.includes(category)
                    ? "primary"
                    : "text.secondary"
                }
              >
                {category}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Refresh Button */}
        <Fab
          color="primary"
          size="medium"
          onClick={() => refetch()}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <RefreshIcon />
        </Fab>
      </Box>
    </MainLayout>
  );
}