'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  useTheme,
  Stack,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useInventoryData } from '@/hooks/useInventoryData';
import { INVENTORY_CONTENT } from './InventoryContent';
import { InventoryIcon } from './InventoryIcons';
import { InventoryMetrics } from './common/InventoryMetrics';
import { FinancialOverview } from './common/FinancialOverview';
import { ProductTable } from './common/ProductTable';
import { StockAlerts } from './common/StockAlerts';
import { AddStockDialog } from './AddStockDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';

export default function InventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    products,
    metrics,
    metricCards,
    loading,
    error,
    fetchProducts,
    calculateTotalStock,
    getStockStatus,
    getMinStockLevel,
    getCategoryColor,
  } = useInventoryData();

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleRefresh = () => {
    fetchProducts();
    setSnackbar({ open: true, message: INVENTORY_CONTENT.snackbar.refreshed, severity: 'success' });
  };

  const handleAddStock = async (formData: any) => {
    try {
      console.log('Adding stock:', formData);
      // Implement your API call here
      setSnackbar({ open: true, message: INVENTORY_CONTENT.snackbar.stockAdded, severity: 'success' });
      setOpenDialog(false);
      fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: INVENTORY_CONTENT.snackbar.failedToAdd, severity: 'error' });
    }
  };

  const handleExport = () => {
    // Implement export functionality
    setSnackbar({ open: true, message: INVENTORY_CONTENT.snackbar.exportStarted, severity: 'success' });
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.gstDetails?.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    // Apply tab filters
    let matchesTab = true;
    if (activeTab === 1) { // Low Stock
      matchesTab = getStockStatus(product) === 'low_stock';
    } else if (activeTab === 2) { // Out of Stock
      matchesTab = getStockStatus(product) === 'out_of_stock';
    } else if (activeTab === 3) { // Best Sellers
      matchesTab = calculateTotalStock(product) * product.basePrice > 10000;
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  if (loading) {
    return (
      <MainLayout title={INVENTORY_CONTENT.page.title}>
        <LoadingState />
      </MainLayout>
    );
  }

  if (error && !loading) {
    return (
      <MainLayout title={INVENTORY_CONTENT.page.title}>
        <ErrorState 
          error={error} 
          onRetry={fetchProducts}
          retryText={INVENTORY_CONTENT.buttons.retry}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={INVENTORY_CONTENT.page.title}>
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        maxWidth: 1400, 
        margin: '0 auto',
        minHeight: '100vh',
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  color: 'text.primary',
                }}
              >
                {INVENTORY_CONTENT.page.icon} {INVENTORY_CONTENT.page.title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {products.length} {INVENTORY_CONTENT.page.subtitle}
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="outlined"
                startIcon={<InventoryIcon name="Filter" />}
                onClick={() => {}}
                sx={{ borderRadius: 2 }}
              >
                {INVENTORY_CONTENT.buttons.filter}
              </Button>
              <Button
                variant="outlined"
                startIcon={<InventoryIcon name="Download" />}
                onClick={handleExport}
                sx={{ borderRadius: 2 }}
              >
                {INVENTORY_CONTENT.buttons.export}
              </Button>
              <Button
                variant="outlined"
                startIcon={<InventoryIcon name="Refresh" />}
                onClick={handleRefresh}
                sx={{ borderRadius: 2 }}
              >
                {INVENTORY_CONTENT.buttons.refresh}
              </Button>
              <Button
                variant="contained"
                startIcon={<InventoryIcon name="Add" />}
                onClick={() => setOpenDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                {INVENTORY_CONTENT.buttons.addStock}
              </Button>
            </Stack>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Quick Stats Cards */}
          <InventoryMetrics metrics={metricCards} theme={theme} />

          {/* Financial Overview Card */}
          <FinancialOverview metrics={metrics} theme={theme} />
        </Box>

        {/* Filters and Search */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ 
            borderRadius: 3,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' }
              }}>
                <TextField
                  fullWidth
                  placeholder={INVENTORY_CONTENT.filters.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon name="Search" color="text.secondary" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 2,
                    }
                  }}
                  size={isMobile ? "small" : "medium"}
                />
                
                <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }} size={isMobile ? "small" : "medium"}>
                  <InputLabel>{INVENTORY_CONTENT.filters.categoryLabel}</InputLabel>
                  <Select
                    value={filterCategory}
                    label={INVENTORY_CONTENT.filters.categoryLabel}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">{INVENTORY_CONTENT.filters.allCategories}</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: getCategoryColor(category, theme) 
                          }} />
                          {category}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Content Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: isMobile ? '0.875rem' : '1rem',
                minHeight: 48,
              },
            }}
          >
            <Tab label={INVENTORY_CONTENT.tabs.allProducts} />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon name="Warning" size="small" />
                  {INVENTORY_CONTENT.tabs.lowStock}
                  {metrics.lowStock > 0 && (
                    <Chip 
                      label={metrics.lowStock} 
                      size="small" 
                      color="warning"
                      sx={{ height: 20, fontSize: '0.75rem', minWidth: 20 }}
                    />
                  )}
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon name="Error" size="small" />
                  {INVENTORY_CONTENT.tabs.outOfStock}
                  {metrics.outOfStock > 0 && (
                    <Chip 
                      label={metrics.outOfStock} 
                      size="small" 
                      color="error"
                      sx={{ height: 20, fontSize: '0.75rem', minWidth: 20 }}
                    />
                  )}
                </Box>
              } 
            />
            <Tab label={INVENTORY_CONTENT.tabs.bestSellers} />
          </Tabs>
        </Box>

        {/* Products Table */}
        <Card sx={{ 
          borderRadius: 3,
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <ProductTable
              products={filteredProducts}
              calculateTotalStock={calculateTotalStock}
              getStockStatus={getStockStatus}
              getMinStockLevel={getMinStockLevel}
              getCategoryColor={getCategoryColor}
              theme={theme}
              isMobile={isMobile}
            />
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Box sx={{ mt: 4 }}>
          <StockAlerts
            lowStock={metrics.lowStock}
            outOfStock={metrics.outOfStock}
            productsCount={products.length}
            onViewLowStock={() => setActiveTab(1)}
            onViewOutOfStock={() => setActiveTab(2)}
          />
        </Box>
      </Box>

      {/* Add Stock Dialog */}
      <AddStockDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        products={products}
        onAddStock={handleAddStock}
        isMobile={isMobile}
        theme={theme}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </MainLayout>
  );
}