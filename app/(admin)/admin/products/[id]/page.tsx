// app/admin/products/[id]/page.tsx - GOOGLE MATERIAL DESIGN THEME
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
  useTheme,
  useMediaQuery,
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
  Refresh,
} from '@mui/icons-material';
import Link from 'next/link';

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
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
    if (stock === 0) return { color: '#ea4335', label: 'Out of Stock' };
    if (stock < 10) return { color: '#fbbc04', label: 'Low Stock' };
    return { color: '#34a853', label: 'In Stock' };
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
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              fontSize: '2rem',
            }}>
              {product.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>{product.name}</Typography>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ mt: 0.5 }}>
                {product.description || 'No description available'}
              </Typography>
            </Box>
            <Badge 
              badgeContent={product.isActive ? 'Active' : 'Inactive'} 
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '0.7rem', 
                  padding: '0 8px',
                  backgroundColor: product.isActive ? '#34a853' : '#ea4335',
                  color: '#ffffff',
                } 
              }}
            />
          </Stack>

          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-around" sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Base Price</Typography>
              <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                {formatCurrency(product.basePrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Cost Price</Typography>
              <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>
                {formatCurrency(product.baseCostPrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Stock Status</Typography>
              <Typography variant="h5" color={getStockStatus(calculateTotalStock(product)).color}>
                {calculateTotalStock(product)} units
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Category />
              </Avatar>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Category</Typography>
                <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>{product.category}</Typography>
                {product.subCategory && (
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {product.subCategory}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Business />
              </Avatar>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Brand</Typography>
                <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                  {product.brand || 'No Brand'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Label />
              </Avatar>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>SKU</Typography>
                <Typography variant="body1" fontWeight="medium" fontFamily="monospace" color={darkMode ? '#e8eaed' : '#202124'}>
                  {product.sku || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Stock Summary */}
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}>
            <Inventory /> Inventory Summary
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Total Stock</Typography>
                <Typography variant="body1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                  {calculateTotalStock(product)} units
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(calculateTotalStock(product) * 2, 100)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getStockStatus(calculateTotalStock(product)).color,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  margin: '0 auto 8px' 
                }}>
                  <LocalOffer />
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>{product.variations?.length || 0}</Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>Variations</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                  color: darkMode ? '#fbbc04' : '#fbbc04',
                  margin: '0 auto 8px' 
                }}>
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>{product.batches?.length || 0}</Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>Batches</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: product.isReturnable 
                    ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)')
                    : (darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'),
                  color: product.isReturnable 
                    ? (darkMode ? '#34a853' : '#34a853')
                    : (darkMode ? '#ea4335' : '#ea4335'),
                  margin: '0 auto 8px' 
                }}>
                  {product.isReturnable ? <CheckCircle /> : <Cancel />}
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>{product.isReturnable ? 'Yes' : 'No'}</Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>Returnable</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderVariations = () => (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
            mb: { xs: 1, sm: 0 }
          }}>
            <LocalOffer /> Product Variations
          </Typography>
          <Chip 
            label={`${product.variations?.length || 0} variations`} 
            sx={{
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              border: 'none',
            }}
          />
        </Stack>
        
        <TableContainer component={Paper} sx={{ 
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Variation
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  SKU
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Cost
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Stock
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.variations?.map((variation: any, index: number) => (
                <TableRow 
                  key={index}
                  hover
                  sx={{ 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    '&:hover': {
                      backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                    }
                  }}
                >
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        fontSize: '0.875rem',
                      }}>
                        {variation.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>{variation.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip 
                      label={variation.sku || 'N/A'} 
                      size="small" 
                      sx={{ 
                        fontFamily: 'monospace',
                        backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        border: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                      {formatCurrency(variation.price || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      {formatCurrency(variation.costPrice || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip 
                      label={variation.stock || 0} 
                      size="small"
                      sx={{ 
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        border: 'none',
                        minWidth: 60,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip 
                      label={getStockStatus(variation.stock || 0).label}
                      size="small"
                      sx={{ 
                        backgroundColor: `${getStockStatus(variation.stock || 0).color}20`,
                        color: getStockStatus(variation.stock || 0).color,
                        border: 'none',
                      }}
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
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
            mb: { xs: 1, sm: 0 }
          }}>
            <Inventory /> Product Batches
          </Typography>
          <Chip 
            label={`${product.batches?.length || 0} batches`} 
            sx={{
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              border: 'none',
            }}
          />
        </Stack>
        
        <TableContainer component={Paper} sx={{ 
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>Batch No.</strong>
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>Cost Price</strong>
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>Selling Price</strong>
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>MFG Date</strong>
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>EXP Date</strong>
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <strong>Received</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.batches?.map((batch: any, index: number) => {
                const isExpired = batch.expDate && new Date(batch.expDate) < new Date();
                
                return (
                  <TableRow 
                    key={index}
                    hover
                    sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      '&:hover': {
                        backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                      }
                    }}
                  >
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Chip 
                        label={batch.batchNumber} 
                        size="small"
                        sx={{ 
                          fontFamily: 'monospace', 
                          fontWeight: 'bold',
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                        {batch.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" color={darkMode ? '#e8eaed' : '#202124'}>
                        {formatCurrency(batch.costPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="medium" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                        {formatCurrency(batch.sellingPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                        {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" color={isExpired ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124')}>
                        {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'N/A'}
                        {isExpired && (
                          <Chip 
                            label="Expired" 
                            size="small" 
                            sx={{ 
                              ml: 1,
                              backgroundColor: 'rgba(234, 67, 53, 0.1)',
                              color: '#ea4335',
                              border: 'none',
                              fontSize: '0.65rem',
                            }}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderGSTDetails = () => {
    const gstDetails = product.gstDetails;
    
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}>
            <Receipt /> GST & Tax Details
          </Typography>
          
          {gstDetails ? (
            <Stack spacing={3}>
              {/* GST Summary */}
              <Paper sx={{ 
                p: 3, 
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}>
                    <Receipt fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>GST Type</Typography>
                    <Typography variant="h6" textTransform="uppercase" color={darkMode ? '#e8eaed' : '#202124'}>
                      {gstDetails.type?.replace('_', ' + ')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>HSN Code</Typography>
                    <Typography variant="h6" fontFamily="monospace" color={darkMode ? '#e8eaed' : '#202124'}>
                      {gstDetails.hsnCode}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Tax Rates */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                {gstDetails.cgstRate > 0 && (
                  <Card sx={{ 
                    flex: 1, 
                    minWidth: 150,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#                    202124' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <CardContent>
                      <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                        CGST
                      </Typography>
                      <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                        {gstDetails.cgstRate}%
                      </Typography>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        Central Goods & Services Tax
                      </Typography>
                    </CardContent>
                  </Card>
                )}
                
                {gstDetails.sgstRate > 0 && (
                  <Card sx={{ 
                    flex: 1, 
                    minWidth: 150,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <CardContent>
                      <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                        SGST
                      </Typography>
                      <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                        {gstDetails.sgstRate}%
                      </Typography>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        State Goods & Services Tax
                      </Typography>
                    </CardContent>
                  </Card>
                )}
                
                {gstDetails.igstRate > 0 && (
                  <Card sx={{ 
                    flex: 1, 
                    minWidth: 150,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <CardContent>
                      <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                        IGST
                      </Typography>
                      <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                        {gstDetails.igstRate}%
                      </Typography>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        Integrated Goods & Services Tax
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Stack>

              {/* Tax Calculation Example */}
              <Card sx={{ 
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                  }}>
                    Tax Calculation Example (for ₹1,000)
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Base Price</Typography>
                      <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>₹1,000.00</Typography>
                    </Stack>
                    
                    {gstDetails.cgstRate > 0 && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                          CGST ({gstDetails.cgstRate}%)
                        </Typography>
                        <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                          ₹{(1000 * gstDetails.cgstRate / 100).toFixed(2)}
                        </Typography>
                      </Stack>
                    )}
                    
                    {gstDetails.sgstRate > 0 && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                          SGST ({gstDetails.sgstRate}%)
                        </Typography>
                        <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                          ₹{(1000 * gstDetails.sgstRate / 100).toFixed(2)}
                        </Typography>
                      </Stack>
                    )}
                    
                    {gstDetails.igstRate > 0 && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                          IGST ({gstDetails.igstRate}%)
                        </Typography>
                        <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                          ₹{(1000 * gstDetails.igstRate / 100).toFixed(2)}
                        </Typography>
                      </Stack>
                    )}
                    
                    <Divider sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                        Total Price
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                        ₹{(
                          1000 + 
                          (1000 * gstDetails.cgstRate / 100) + 
                          (1000 * gstDetails.sgstRate / 100) + 
                          (1000 * gstDetails.igstRate / 100)
                        ).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : (
            <Alert severity="info" sx={{ 
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              No GST details configured for this product. Add GST details in the edit page.
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          flexDirection: 'column',
          gap: 3
        }}>
          <CircularProgress size={64} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="h6" color={darkMode ? '#e8eaed' : '#202124'}>
            Loading product details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3, 
            borderRadius: '16px',
            backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
            border: `1px solid ${darkMode ? '#ea4335' : '#ea4335'}`,
            color: darkMode ? '#ea4335' : '#d32f2f',
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefresh}
              sx={{ color: darkMode ? '#ea4335' : '#d32f2f' }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl">
        <Alert 
          severity="warning" 
          sx={{ 
            mt: 3, 
            borderRadius: '16px',
            backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
            border: `1px solid ${darkMode ? '#fbbc04' : '#fbbc04'}`,
            color: darkMode ? '#fbbc04' : '#ed6c02',
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleBack}
              sx={{ color: darkMode ? '#fbbc04' : '#ed6c02' }}
            >
              Back to Products
            </Button>
          }
        >
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Back to Products">
            <IconButton 
              onClick={handleBack}
              sx={{ 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
              Product Details
            </Typography>
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
              Manage and view detailed information about this product
            </Typography>
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              borderRadius: '24px',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              }
            }}
          >
            Edit Product
          </Button>
        </Stack>
      </Stack>

      {/* Product ID Badge */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Chip 
          icon={<Numbers />}
          label={`ID: ${product._id}`}
          sx={{
            backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontFamily: 'monospace',
            border: 'none',
          }}
        />
        <Chip 
          icon={<Store />}
          label={`Category: ${product.category}`}
          sx={{
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
            border: 'none',
          }}
        />
        {product.isActive ? (
          <Chip 
            icon={<CheckCircle />}
            label="Active"
            sx={{
              backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
              color: darkMode ? '#34a853' : '#34a853',
              border: 'none',
            }}
          />
        ) : (
          <Chip 
            icon={<Cancel />}
            label="Inactive"
            sx={{
              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
              color: darkMode ? '#ea4335' : '#ea4335',
              border: 'none',
            }}
          />
        )}
      </Stack>

      {/* Tabs Navigation */}
      <Paper sx={{ 
        mb: 3, 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden',
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0}>
          {[
            { key: 'overview', label: 'Overview', icon: <Visibility /> },
            { key: 'variations', label: 'Variations', icon: <LocalOffer /> },
            { key: 'batches', label: 'Batches', icon: <Inventory /> },
            { key: 'gst', label: 'GST & Tax', icon: <Receipt /> },
          ].map((tab) => (
            <Button
              key={tab.key}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.key)}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: 0,
                color: activeTab === tab.key 
                  ? (darkMode ? '#8ab4f8' : '#1a73e8')
                  : (darkMode ? '#9aa0a6' : '#5f6368'),
                borderBottom: activeTab === tab.key 
                  ? `3px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}` 
                  : '3px solid transparent',
                backgroundColor: activeTab === tab.key
                  ? (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)')
                  : 'transparent',
                '&:hover': {
                  backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                }
              }}
            >
              {tab.label}
              {tab.key === 'variations' && product.variations?.length > 0 && (
                <Chip 
                  label={product.variations.length}
                  size="small"
                  sx={{ 
                    ml: 1,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontSize: '0.65rem',
                    height: 20,
                  }}
                />
              )}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
        {renderTabContent()}
      </Box>

      {/* Action Buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<Print />}
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            }
          }}
        >
          Print
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            }
          }}
        >
          Export
        </Button>
        <Button
          variant="contained"
          startIcon={<Share />}
          sx={{
            backgroundColor: darkMode ? '#34a853' : '#34a853',
            color: '#ffffff',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              backgroundColor: darkMode ? '#2e8b47' : '#2e8b47',
            }
          }}
        >
          Share
        </Button>
      </Stack>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
}