'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CardContent,
  Chip,
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
  alpha,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'
import { Alert } from '../ui/Alert';

export default function InventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  
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

  const handleBack = () => {
    window.history.back();
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
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Inventory
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              {INVENTORY_CONTENT.page.icon} {INVENTORY_CONTENT.page.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
              }}
            >
              {products.length} {INVENTORY_CONTENT.page.subtitle}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 3,
              alignItems: 'center',
            }}>
              <Chip
                label={`${metrics.totalProducts || 0} Total Products`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                  borderColor: alpha('#4285f4', 0.3),
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
              <Chip
                label={`₹${metrics.totalStockValue?.toLocaleString() || '0'} Total Value`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                  borderColor: alpha('#34a853', 0.3),
                  color: darkMode ? '#81c995' : '#34a853',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
              {metrics.lowStock > 0 && (
                <Chip
                  label={`${metrics.lowStock} Low Stock`}
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                    borderColor: alpha('#fbbc04', 0.3),
                    color: darkMode ? '#fdd663' : '#fbbc04',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              title="Error Loading Inventory"
              message={typeof error === 'string' ? error : 'An error occurred'}
              dismissible
              onDismiss={() => {}}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
                border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
                color: darkMode ? '#f28b82' : '#ea4335',
              }}
            />
          )}

          {/* Header Controls */}
          <Card
            title="Inventory Management"
            subtitle={`${filteredProducts.length} products filtered • ${metrics.totalProducts || 0} total in inventory`}
            action={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {}}
                  iconLeft={<InventoryIcon name="Filter" />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
                >
                  {INVENTORY_CONTENT.buttons.filter}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleExport}
                  iconLeft={<InventoryIcon name="Download" />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
                >
                  {INVENTORY_CONTENT.buttons.export}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  iconLeft={<InventoryIcon name="Refresh" />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
                >
                  {INVENTORY_CONTENT.buttons.refresh}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpenDialog(true)}
                  iconLeft={<InventoryIcon name="Add" />}
                  size="medium"
                  sx={{
                    backgroundColor: '#4285f4',
                    '&:hover': {
                      backgroundColor: '#3367d6',
                    }
                  }}
                >
                  {INVENTORY_CONTENT.buttons.addStock}
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <TextField
                fullWidth
                placeholder={INVENTORY_CONTENT.filters.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon name="Search" color={darkMode ? '#9aa0a6' : '#5f6368'} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }
                }}
                size={isMobile ? "small" : "medium"}
              />
              
              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: 2,
                }
              }} size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}>
                  {INVENTORY_CONTENT.filters.categoryLabel}
                </InputLabel>
                <Select
                  value={filterCategory}
                  label={INVENTORY_CONTENT.filters.categoryLabel}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                  }}
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
          </Card>

          {/* Stats Overview */}
          <InventoryMetrics metrics={metricCards} theme={theme} />

          {/* Financial Overview */}
          <FinancialOverview metrics={metrics} theme={theme} />

          {/* Content Tabs */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              px: 2,
              py: 1,
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1,
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flex: 1,
                  flexWrap: 'wrap',
                  gap: 1,
                  pb: { xs: 1, sm: 0 },
                  borderBottom: { xs: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, sm: 'none' },
                }}>
                  <Button
                    variant={activeTab === 0 ? "contained" : "outlined"}
                    onClick={() => setActiveTab(0)}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      backgroundColor: activeTab === 0 ? '#4285f4' : 'transparent',
                      borderColor: activeTab === 0 ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0',
                      color: activeTab === 0 ? 'white' : darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        backgroundColor: activeTab === 0 ? '#3367d6' : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    {INVENTORY_CONTENT.tabs.allProducts}
                  </Button>
                  
                  <Button
                    variant={activeTab === 1 ? "contained" : "outlined"}
                    onClick={() => setActiveTab(1)}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      backgroundColor: activeTab === 1 ? '#fbbc04' : 'transparent',
                      borderColor: activeTab === 1 ? '#fbbc04' : darkMode ? '#3c4043' : '#dadce0',
                      color: activeTab === 1 ? 'white' : darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        backgroundColor: activeTab === 1 ? '#e6a900' : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <InventoryIcon name="Warning" size="small" />
                      {INVENTORY_CONTENT.tabs.lowStock}
                      {metrics.lowStock > 0 && (
                        <Chip 
                          label={metrics.lowStock} 
                          size="small" 
                          sx={{ 
                            height: 16, 
                            fontSize: '0.6rem', 
                            minWidth: 16,
                            backgroundColor: '#fbbc04',
                            color: 'white',
                            ml: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  </Button>
                  
                  <Button
                    variant={activeTab === 2 ? "contained" : "outlined"}
                    onClick={() => setActiveTab(2)}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      backgroundColor: activeTab === 2 ? '#ea4335' : 'transparent',
                      borderColor: activeTab === 2 ? '#ea4335' : darkMode ? '#3c4043' : '#dadce0',
                      color: activeTab === 2 ? 'white' : darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        backgroundColor: activeTab === 2 ? '#d32f2f' : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <InventoryIcon name="Error" size="small" />
                      {INVENTORY_CONTENT.tabs.outOfStock}
                      {metrics.outOfStock > 0 && (
                        <Chip 
                          label={metrics.outOfStock} 
                          size="small" 
                          sx={{ 
                            height: 16, 
                            fontSize: '0.6rem', 
                            minWidth: 16,
                            backgroundColor: '#ea4335',
                            color: 'white',
                            ml: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  </Button>
                  
                  <Button
                    variant={activeTab === 3 ? "contained" : "outlined"}
                    onClick={() => setActiveTab(3)}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      backgroundColor: activeTab === 3 ? '#34a853' : 'transparent',
                      borderColor: activeTab === 3 ? '#34a853' : darkMode ? '#3c4043' : '#dadce0',
                      color: activeTab === 3 ? 'white' : darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        backgroundColor: activeTab === 3 ? '#2d9248' : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    {INVENTORY_CONTENT.tabs.bestSellers}
                  </Button>
                </Box>
                
                <Typography variant="caption" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  whiteSpace: 'nowrap',
                  pt: { xs: 1, sm: 0 },
                }}>
                  Showing {filteredProducts.length} products
                </Typography>
              </Box>
            </Box>

            {/* Products Table */}
            <Box sx={{ p: 0 }}>
              <ProductTable
                products={filteredProducts}
                calculateTotalStock={calculateTotalStock}
                getStockStatus={getStockStatus}
                getMinStockLevel={getMinStockLevel}
                getCategoryColor={getCategoryColor}
                theme={theme}
                isMobile={isMobile}
              />
            </Box>
          </Paper>

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
          ContentProps={{
            sx: {
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: 2,
            }
          }}
        />
      </Box>
    </MainLayout>
  );
}