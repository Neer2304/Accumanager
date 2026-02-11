"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

// Product Components
import ProductGridHeader from '@/components/products/ProductGridHeader';
import ProductFilters from '@/components/products/ProductFilters';
import ProductStatusChip from '@/components/products/ProductStatusChip';
import ProductStockBadge from '@/components/products/ProductStockBadge';
import ProductPriceDisplay from '@/components/products/ProductPriceDisplay';
import ProductActions from '@/components/products/ProductActions';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  basePrice: number;
  variations: Array<any>;
  batches: Array<any>;
  isActive: boolean;
  createdAt: string;
  stock?: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, search, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
      });
      
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setTotal(data.pagination.total);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getStockTotal = (product: Product) => {
    if (product.stock !== undefined) return product.stock;
    
    let totalStock = 0;
    if (product.variations?.length > 0) {
      product.variations.forEach(v => totalStock += v.stock || 0);
    }
    if (product.batches?.length > 0) {
      product.batches.forEach(b => totalStock += b.quantity || 0);
    }
    return totalStock || 0;
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchProducts(); // Refresh the list
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete product');
        }
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <ProductGridHeader
            title="Product Management"
            subtitle="Manage your product catalog"
            onRefresh={fetchProducts}
            onCreate={handleAddProduct}
            darkMode={darkMode}
          />
        </Box>

        {/* Filters */}
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onClearFilters={handleClearFilters}
          darkMode={darkMode}
        />

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Products Table Card */}
        <Paper sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          mb: 2,
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <TableCell sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Product
                  </TableCell>
                  <TableCell sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Category
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Price
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Created
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    borderBottom: 'none',
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                      <Typography 
                        variant="body2" 
                        color={darkMode ? '#9aa0a6' : '#5f6368'} 
                        sx={{ mt: 2 }}
                      >
                        Loading products...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        {search || categoryFilter ? 'No products match your filters' : 'No products found'}
                      </Typography>
                      {!search && !categoryFilter && (
                        <Button
                          variant="contained"
                          onClick={handleAddProduct}
                          sx={{
                            mt: 2,
                            backgroundColor: '#1a73e8',
                            '&:hover': {
                              backgroundColor: '#1669c1',
                            },
                            borderRadius: '8px',
                          }}
                        >
                          Add Your First Product
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const stockTotal = getStockTotal(product);
                    
                    return (
                      <TableRow 
                        key={product._id} 
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
                          <Typography fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} fontFamily="monospace">
                            {product.sku}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <ProductStatusChip
                            status={product.category as any}
                            size="small"
                            darkMode={darkMode}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <ProductPriceDisplay
                            price={product.basePrice}
                            size="small"
                            darkMode={darkMode}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <ProductStockBadge
                            stock={stockTotal}
                            size="small"
                            darkMode={darkMode}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <ProductStatusChip
                            status={product.isActive ? 'active' : 'inactive'}
                            size="small"
                            darkMode={darkMode}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                            {new Date(product.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <ProductActions
                            onView={() => handleViewProduct(product._id)}
                            onEdit={() => handleEditProduct(product._id)}
                            onDelete={() => handleDeleteProduct(product._id)}
                            variant="icon"
                            size="small"
                            darkMode={darkMode}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            '& .MuiTablePagination-selectIcon': {
              color: darkMode ? '#e8eaed' : '#202124',
            },
          }}
        />
      </Container>
    </Box>
  );
}