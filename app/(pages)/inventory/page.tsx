"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  useTheme,
  Stack,
  Avatar,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import {
  Add,
  Search,
  Inventory as InventoryIcon,
  Warning,
  CheckCircle,
  Error,
  LocalShipping,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Download,
  MoreVert,
  TrendingUp,
  TrendingDown,
  BarChart,
  QrCode2,
  Category,
  PriceChange,
  MonetizationOn,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: {
    type: string;
    hsnCode: string;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    utgstRate: number;
  };
  variations?: Array<{
    name: string;
    price: number;
    costPrice: number;
    stock: number;
    sku?: string;
  }>;
  batches?: Array<{
    batchNumber: string;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    mfgDate: string;
    expDate: string;
  }>;
  tags?: string[];
  isReturnable: boolean;
  returnPeriod: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

export default function InventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching products from API...');
      const response = await fetch('/api/products', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view products');
        }
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const productsData = await response.json();
      console.log('📦 Products data received:', productsData);
      
      // Handle different response formats
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else if (productsData && Array.isArray(productsData.products)) {
        setProducts(productsData.products);
      } else if (productsData && typeof productsData === 'object') {
        setProducts([productsData]);
      } else {
        setProducts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('❌ Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate inventory metrics from actual product data
  const getInventoryMetrics = () => {
    const totalItems = products.length;
    
    const inStock = products.filter(product => {
      const totalStock = calculateTotalStock(product);
      return totalStock > 0;
    }).length;

    const lowStock = products.filter(product => {
      const totalStock = calculateTotalStock(product);
      const minStock = getMinStockLevel(product);
      return totalStock > 0 && totalStock <= minStock;
    }).length;

    const outOfStock = products.filter(product => {
      const totalStock = calculateTotalStock(product);
      return totalStock === 0;
    }).length;

    const totalStockValue = products.reduce((total, product) => {
      const totalStock = calculateTotalStock(product);
      return total + (totalStock * product.baseCostPrice);
    }, 0);

    const totalSellingValue = products.reduce((total, product) => {
      const totalStock = calculateTotalStock(product);
      return total + (totalStock * product.basePrice);
    }, 0);

    const profitMargin = totalSellingValue - totalStockValue;
    const marginPercentage = totalStockValue > 0 ? ((profitMargin / totalStockValue) * 100) : 0;

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      totalStockValue,
      totalSellingValue,
      profitMargin,
      marginPercentage,
    };
  };

  // Calculate total stock for a product
  const calculateTotalStock = (product: Product): number => {
    let totalStock = 0;

    if (product.variations && product.variations.length > 0) {
      totalStock += product.variations.reduce((sum, variation) => sum + (variation.stock || 0), 0);
    }

    if (product.batches && product.batches.length > 0) {
      totalStock += product.batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
    }

    return totalStock;
  };

  // Get minimum stock level
  const getMinStockLevel = (product: Product): number => {
    const categoryMinLevels: Record<string, number> = {
      'Electronics': 15,
      'Food & Beverages': 50,
      'Fitness': 10,
      'Home & Kitchen': 30,
      'default': 20,
    };
    
    return categoryMinLevels[product.category] || categoryMinLevels.default;
  };

  // Get stock status
  const getStockStatus = (product: Product) => {
    const currentStock = calculateTotalStock(product);
    const minStock = getMinStockLevel(product);

    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minStock) return 'low_stock';
    if (currentStock >= minStock * 3) return 'over_stock';
    return 'in_stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return theme.palette.success.main;
      case 'low_stock': return theme.palette.warning.main;
      case 'out_of_stock': return theme.palette.error.main;
      case 'over_stock': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle />;
      case 'low_stock': return <Warning />;
      case 'out_of_stock': return <Error />;
      case 'over_stock': return <LocalShipping />;
      default: return <InventoryIcon />;
    }
  };

  // Get category color based on theme
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': theme.palette.primary.main,
      'Food & Beverages': theme.palette.success.main,
      'Fitness': theme.palette.warning.main,
      'Home & Kitchen': theme.palette.secondary.main,
      'default': theme.palette.text.secondary,
    };
    return colors[category] || colors.default;
  };

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
    } else if (activeTab === 3) { // Best Sellers (you can customize this logic)
      // For now, show products with highest stock value
      matchesTab = calculateTotalStock(product) * product.basePrice > 10000;
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const metrics = getInventoryMetrics();

  // Prepare metrics for display
  const inventoryMetrics: InventoryMetric[] = [
    { 
      title: 'Total Products', 
      value: metrics.totalItems, 
      change: products.length > 0 ? 12.5 : 0, // You can calculate real change from historical data
      icon: <InventoryIcon />,
      trend: 'up'
    },
    { 
      title: 'In Stock', 
      value: metrics.inStock, 
      change: metrics.inStock > 0 ? 8.2 : 0,
      icon: <CheckCircle />,
      trend: 'up'
    },
    { 
      title: 'Low Stock', 
      value: metrics.lowStock, 
      change: metrics.lowStock > 0 ? -3.4 : 0,
      icon: <Warning />,
      trend: 'down'
    },
    { 
      title: 'Out of Stock', 
      value: metrics.outOfStock, 
      change: metrics.outOfStock > 0 ? 1.8 : 0,
      icon: <Error />,
      trend: 'up'
    },
  ];

  const handleRefresh = () => {
    fetchProducts();
    setSnackbar({ open: true, message: 'Inventory data refreshed', severity: 'success' });
  };

  const handleAddStock = async (formData: any) => {
    try {
      console.log('Adding stock:', formData);
      // Implement your API call here
      setSnackbar({ open: true, message: 'Stock added successfully', severity: 'success' });
      setOpenDialog(false);
      fetchProducts(); // Refresh the data
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add stock', severity: 'error' });
    }
  };

  const handleExport = () => {
    // Implement export functionality
    setSnackbar({ open: true, message: 'Export started', severity: 'success' });
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <MainLayout title="Inventory Management">
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 400,
        }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Inventory Management">
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
                📦 Inventory Management
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {products.length} products • Real-time tracking & analytics
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {}}
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                sx={{ borderRadius: 2 }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Add Stock
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
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 4
          }}>
            {inventoryMetrics.map((metric, index) => (
              <Card 
                key={index}
                sx={{ 
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[3],
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: metric.trend === 'up' 
                        ? alpha(theme.palette.success.main, 0.1)
                        : metric.trend === 'down'
                        ? alpha(theme.palette.warning.main, 0.1)
                        : alpha(theme.palette.info.main, 0.1),
                      color: metric.trend === 'up' 
                        ? theme.palette.success.main
                        : metric.trend === 'down'
                        ? theme.palette.warning.main
                        : theme.palette.info.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {metric.icon}
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: metric.trend === 'up' 
                        ? theme.palette.success.main
                        : metric.trend === 'down'
                        ? theme.palette.warning.main
                        : theme.palette.text.secondary
                    }}>
                      {metric.trend === 'up' ? <TrendingUp fontSize="small" /> : 
                       metric.trend === 'down' ? <TrendingDown fontSize="small" /> : null}
                      <Typography variant="caption" fontWeight="medium">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Financial Overview Card */}
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                Financial Overview
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 3,
                mt: 2
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PriceChange sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      Inventory Value
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    ₹{metrics.totalStockValue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Based on cost price
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <MonetizationOn sx={{ color: theme.palette.success.main }} />
                    <Typography variant="body2" color="text.secondary">
                      Sales Value
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    ₹{metrics.totalSellingValue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Based on selling price
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BarChart sx={{ color: theme.palette.warning.main }} />
                    <Typography variant="body2" color="text.secondary">
                      Profit Margin
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {metrics.marginPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹{metrics.profitMargin.toLocaleString()} potential profit
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
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
                  placeholder="Search products by name, brand, SKU, or HSN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 2,
                    }
                  }}
                  size={isMobile ? "small" : "medium"}
                />
                
                <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }} size={isMobile ? "small" : "medium"}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: getCategoryColor(category) 
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
            <Tab label="All Products" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning fontSize="small" />
                  Low Stock
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
                  <Error fontSize="small" />
                  Out of Stock
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
            <Tab label="Best Sellers" />
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
            <TableContainer>
              <Table>
                <TableHead sx={{ 
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : 'grey.50' 
                }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Category fontSize="small" />
                        Product
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Stock Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Value</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Last Updated</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <InventoryIcon sx={{ 
                            fontSize: 48, 
                            color: 'text.disabled', 
                            mb: 2 
                          }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No products found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm || filterCategory !== 'all' || activeTab !== 0
                              ? 'Try adjusting your search, filters, or tabs'
                              : 'Add your first product to get started'
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      const currentStock = calculateTotalStock(product);
                      const minStock = getMinStockLevel(product);
                      const stockValue = currentStock * product.baseCostPrice;
                      const status = getStockStatus(product);
                      const stockPercentage = Math.min((currentStock / (minStock * 3)) * 100, 100);
                      
                      return (
                        <TableRow 
                          key={product._id} 
                          hover
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { 
                              bgcolor: theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.action.hover, 0.05)
                                : 'action.hover' 
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: getCategoryColor(product.category), 
                                width: 40, 
                                height: 40,
                                color: 'white'
                              }}>
                                {product.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                                  {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  {product.brand && (
                                    <Chip
                                      label={product.brand}
                                      size="small"
                                      variant="outlined"
                                      sx={{ height: 20, fontSize: '0.65rem' }}
                                    />
                                  )}
                                  {product.variations && product.variations.length > 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                      {product.variations.length} variants
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={product.category}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(getCategoryColor(product.category), 0.1),
                                color: getCategoryColor(product.category),
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Box>
                              <Typography 
                                variant="h6" 
                                fontWeight="bold"
                                color={getStatusColor(status)}
                              >
                                {currentStock}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Min: {minStock}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={stockPercentage} 
                                sx={{ 
                                  mt: 0.5, 
                                  height: 4, 
                                  borderRadius: 2,
                                  bgcolor: alpha(getStatusColor(status), 0.2),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getStatusColor(status),
                                    borderRadius: 2,
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip
                              icon={getStatusIcon(status)}
                              label={
                                status === 'in_stock' ? 'In Stock' :
                                status === 'low_stock' ? 'Low Stock' :
                                status === 'out_of_stock' ? 'Out of Stock' : 'Over Stock'
                              }
                              size="small"
                              sx={{
                                bgcolor: alpha(getStatusColor(status), 0.1),
                                color: getStatusColor(status),
                                border: `1px solid ${alpha(getStatusColor(status), 0.2)}`,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                              ₹{stockValue.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @ ₹{product.baseCostPrice}/unit
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body2" color="text.primary">
                              {new Date(product.updatedAt).toLocaleDateString('en-IN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(product.updatedAt).toLocaleTimeString('en-IN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'text.secondary',
                                  '&:hover': { color: 'primary.main' }
                                }}
                              >
                                <QrCode2 fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'text.secondary',
                                  '&:hover': { color: 'success.main' }
                                }}
                              >
                                <BarChart fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'text.secondary',
                                  '&:hover': { color: 'warning.main' }
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Box sx={{ mt: 4 }}>
          {metrics.lowStock > 0 && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
              }}
              icon={<Warning />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Low Stock Alert
                  </Typography>
                  <Typography variant="body2">
                    {metrics.lowStock} product{metrics.lowStock > 1 ? 's' : ''} {metrics.lowStock > 1 ? 'are' : 'is'} running low on stock.
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setActiveTab(1)}
                >
                  View Details
                </Button>
              </Box>
            </Alert>
          )}
          
          {metrics.outOfStock > 0 && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
              }}
              icon={<Error />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Out of Stock Alert
                  </Typography>
                  <Typography variant="body2">
                    {metrics.outOfStock} product{metrics.outOfStock > 1 ? 's' : ''} {metrics.outOfStock > 1 ? 'are' : 'is'} out of stock.
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setActiveTab(2)}
                >
                  View Details
                </Button>
              </Box>
            </Alert>
          )}
          
          {metrics.lowStock === 0 && metrics.outOfStock === 0 && products.length > 0 && (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 2,
              }}
              icon={<CheckCircle />}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                All Stock Levels Are Optimal
              </Typography>
              <Typography variant="body2">
                All products are sufficiently stocked.
              </Typography>
            </Alert>
          )}
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

// Add Stock Dialog Component
interface AddStockDialogProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddStock: (data: any) => void;
  isMobile: boolean;
  theme: any;
}

function AddStockDialog({ open, onClose, products, onAddStock, isMobile, theme }: AddStockDialogProps) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    batchNumber: '',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStock(formData);
    setFormData({
      productId: '',
      quantity: '',
      batchNumber: '',
      costPrice: '',
      sellingPrice: '',
      supplier: '',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        fontWeight: 600,
        color: 'text.primary',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Add />
          Add New Stock
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Stack spacing={2}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Product</InputLabel>
              <Select
                value={formData.productId}
                label="Product"
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
              >
                {Array.isArray(products) && products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name} - {product.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              fullWidth
              label="Batch Number"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              required
              size={isMobile ? "small" : "medium"}
            />
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="Cost Price"
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
              />
              
              <TextField
                fullWidth
                label="Selling Price"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button 
            onClick={onClose} 
            size={isMobile ? "small" : "medium"}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            size={isMobile ? "small" : "medium"}
          >
            Add Stock
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}