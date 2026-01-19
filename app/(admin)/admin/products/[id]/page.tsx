// app/admin/products/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Category,
  AttachMoney,
  Inventory,
  Description,
  LocalOffer,
  CalendarToday,
  Person,
  Receipt,
  Numbers,
  Store,
  Visibility,
  Share,
  Download,
  Print,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  Security,
  Business,
  Label,
  ShoppingCart,
} from '@mui/icons-material';

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      const productId = params.id;
      console.log('🔄 Fetching product ID:', productId);
      
      if (!productId || productId === 'undefined') {
        setError('Invalid product ID');
        return;
      }
      
      const response = await fetch(`/api/admin/products/${productId}`);
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.error('❌ API Error:', data);
        
        if (response.status === 401) {
          throw new Error('Please log in to access this page');
        }
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid product ID');
        }
        
        throw new Error(data.message || `Failed to load product (${response.status})`);
      }
      
      const data = await response.json();
      console.log('✅ Product loaded:', data);
      setProduct(data);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to load product');
      
      // Auto-redirect on auth errors
      if (err.message.includes('log in') || err.message.includes('Unauthorized')) {
        setTimeout(() => router.push('/admin/login'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProduct();
  };

  const handleEdit = () => {
    router.push(`/admin/products/${params.id}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  // Calculate total stock
  const calculateTotalStock = (product: any) => {
    let total = 0;
    if (product.variations?.length > 0) {
      product.variations.forEach((v: any) => total += v.stock || 0);
    }
    if (product.batches?.length > 0) {
      product.batches.forEach((b: any) => total += b.quantity || 0);
    }
    return total;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get stock status color
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'error', label: 'Out of Stock' };
    if (stock < 10) return { color: 'warning', label: 'Low Stock' };
    return { color: 'success', label: 'In Stock' };
  };

  // Render tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'variations':
        return renderVariations();
      case 'batches':
        return renderBatches();
      case 'gst':
        return renderGSTDetails();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <Stack spacing={3}>
      {/* Product Stats */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              <Typography variant="h4">{product.name?.charAt(0)}</Typography>
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {product.description || 'No description available'}
              </Typography>
            </Box>
            <Badge 
              badgeContent={product.isActive ? 'Active' : 'Inactive'} 
              color={product.isActive ? 'success' : 'error'}
              sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', padding: '0 8px' } }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={4} justifyContent="space-around">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Base Price</Typography>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {formatCurrency(product.basePrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Cost Price</Typography>
              <Typography variant="h5">
                {formatCurrency(product.baseCostPrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Stock Status</Typography>
              <Typography variant="h5" color={getStockStatus(calculateTotalStock(product)).color}>
                {calculateTotalStock(product)} units
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        <Card sx={{ minWidth: 200, flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main' }}>
                <Category />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Category</Typography>
                <Typography variant="body1" fontWeight="medium">{product.category}</Typography>
                {product.subCategory && (
                  <Typography variant="caption" color="text.secondary">
                    {product.subCategory}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'secondary.50', color: 'secondary.main' }}>
                <Business />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Brand</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {product.brand || 'No Brand'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'success.50', color: 'success.main' }}>
                <Label />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">SKU</Typography>
                <Typography variant="body1" fontWeight="medium" fontFamily="monospace">
                  {product.sku || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Stock Summary */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory /> Inventory Summary
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Total Stock</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {calculateTotalStock(product)} units
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(calculateTotalStock(product) * 2, 100)} 
                // color={getStockStatus(calculateTotalStock(product)).color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Stack direction="row" spacing={3}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ bgcolor: 'info.50', color: 'info.main', margin: '0 auto 8px' }}>
                  <LocalOffer />
                </Avatar>
                <Typography variant="h5">{product.variations?.length || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Variations</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.50', color: 'warning.main', margin: '0 auto 8px' }}>
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h5">{product.batches?.length || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Batches</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ bgcolor: 'success.50', color: 'success.main', margin: '0 auto 8px' }}>
                  {product.isReturnable ? <CheckCircle /> : <Cancel />}
                </Avatar>
                <Typography variant="h5">{product.isReturnable ? 'Yes' : 'No'}</Typography>
                <Typography variant="caption" color="text.secondary">Returnable</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderVariations = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalOffer /> Product Variations
          </Typography>
          <Chip label={`${product.variations?.length || 0} variations`} color="primary" />
        </Stack>
        
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell><strong>Variation</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell align="right"><strong>Price</strong></TableCell>
                <TableCell align="right"><strong>Cost</strong></TableCell>
                <TableCell align="right"><strong>Stock</strong></TableCell>
                <TableCell align="right"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.variations?.map((variation: any, index: number) => (
                <TableRow 
                  key={index}
                  hover
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.50', color: 'primary.main' }}>
                        {variation.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{variation.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={variation.sku || 'N/A'} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(variation.price || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(variation.costPrice || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={variation.stock || 0} 
                      size="small"
                    //   color={getStockStatus(variation.stock || 0).color}
                      sx={{ minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={getStockStatus(variation.stock || 0).label}
                      size="small"
                    //   color={getStockStatus(variation.stock || 0).color}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderBatches = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory /> Product Batches
          </Typography>
          <Chip label={`${product.batches?.length || 0} batches`} color="primary" />
        </Stack>
        
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell><strong>Batch No.</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Cost Price</strong></TableCell>
                <TableCell align="right"><strong>Selling Price</strong></TableCell>
                <TableCell><strong>MFG Date</strong></TableCell>
                <TableCell><strong>EXP Date</strong></TableCell>
                <TableCell><strong>Received</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.batches?.map((batch: any, index: number) => (
                <TableRow 
                  key={index}
                  hover
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={batch.batchNumber} 
                      size="small"
                      sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {batch.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1">
                      {formatCurrency(batch.costPrice || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium" color="primary.main">
                      {formatCurrency(batch.sellingPrice || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={batch.expDate && new Date(batch.expDate) < new Date() ? 'error' : 'inherit'}>
                      {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderGSTDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt /> GST & Tax Details
        </Typography>
        
        {product.gstDetails ? (
          <Stack spacing={3}>
            {/* GST Summary */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.50', color: 'primary.main' }}>
                  <Receipt fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">GST Type</Typography>
                  <Typography variant="h6" textTransform="uppercase">
                    {product.gstDetails.type?.replace('_', ' + ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">HSN Code</Typography>
                  <Typography variant="h6" fontFamily="monospace">
                    {product.gstDetails.hsnCode}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Tax Rates */}
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {product.gstDetails.cgstRate > 0 && (
                <Card sx={{ flex: 1, minWidth: 150, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">CGST</Typography>
                    <Typography variant="h4" color="primary.main">
                      {product.gstDetails.cgstRate}%
                    </Typography>
                    <Typography variant="caption">Central GST</Typography>
                  </CardContent>
                </Card>
              )}
              
              {product.gstDetails.sgstRate > 0 && (
                <Card sx={{ flex: 1, minWidth: 150, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">SGST</Typography>
                    <Typography variant="h4" color="secondary.main">
                      {product.gstDetails.sgstRate}%
                    </Typography>
                    <Typography variant="caption">State GST</Typography>
                  </CardContent>
                </Card>
              )}
              
              {product.gstDetails.igstRate > 0 && (
                <Card sx={{ flex: 1, minWidth: 150, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">IGST</Typography>
                    <Typography variant="h4" color="info.main">
                      {product.gstDetails.igstRate}%
                    </Typography>
                    <Typography variant="caption">Interstate GST</Typography>
                  </CardContent>
                </Card>
              )}
            </Stack>

            {/* Price Breakdown */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Price Breakdown</Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Base Price</Typography>
                  <Typography variant="body1">{formatCurrency(product.basePrice)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">GST ({product.gstDetails.cgstRate + product.gstDetails.sgstRate}%)</Typography>
                  <Typography variant="body1">
                    {formatCurrency(product.basePrice * (product.gstDetails.cgstRate + product.gstDetails.sgstRate) / 100)}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total Price</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {formatCurrency(product.basePrice * (1 + (product.gstDetails.cgstRate + product.gstDetails.sgstRate) / 100))}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No GST details available</Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading product details...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Error display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
              <Button color="inherit" size="small" onClick={handleBack}>
                Back
              </Button>
            </Stack>
          }
        >
          <Typography fontWeight="medium">{error}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Product ID: {params.id}
          </Typography>
        </Alert>
      )}

      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={1}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              >
                Back to Products
              </Button>
              {product && (
                <Typography variant="h4" fontWeight="bold">
                  {product.name}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                Product Details & Management
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title="View Product">
                <IconButton color="info">
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton>
                  <Print />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
              <Button
                startIcon={<Edit />}
                onClick={handleEdit}
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
              >
                Edit Product
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      {product && (
        <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
          <Stack 
            direction="row" 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: <Description /> },
              { id: 'variations', label: 'Variations', icon: <LocalOffer />, count: product.variations?.length },
              { id: 'batches', label: 'Batches', icon: <Inventory />, count: product.batches?.length },
              { id: 'gst', label: 'GST & Tax', icon: <Receipt /> },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 0,
                  borderBottom: activeTab === tab.id ? 3 : 0,
                  borderColor: 'primary.main',
                  color: activeTab === tab.id ? 'primary.main' : 'text.secondary',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  minWidth: 120,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Chip 
                    label={tab.count} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </Button>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Main Content */}
      {product && (
        <Box sx={{ mb: 4 }}>
          {renderTabContent()}
        </Box>
      )}

      {/* Footer Stats */}
      {product && (
        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <Stack direction="row" spacing={4} justifyContent="space-around" alignItems="center">
              <Stack alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                  Created
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
              
              <Divider orientation="vertical" flexItem />
              
              <Stack alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <Person sx={{ fontSize: 14, mr: 0.5 }} />
                  Created By
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  User #{product.userId?.slice(-6)}
                </Typography>
              </Stack>
              
              <Divider orientation="vertical" flexItem />
              
              <Stack alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <Security sx={{ fontSize: 14, mr: 0.5 }} />
                  Product ID
                </Typography>
                <Typography variant="caption" fontFamily="monospace">
                  {product._id}
                </Typography>
              </Stack>
              
              <Divider orientation="vertical" flexItem />
              
              <Stack alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <Numbers sx={{ fontSize: 14, mr: 0.5 }} />
                  Status
                </Typography>
                <Chip 
                  label={product.isActive ? 'Active' : 'Inactive'} 
                  color={product.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}