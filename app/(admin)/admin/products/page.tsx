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
} from '@mui/material';
import { useRouter } from 'next/navigation';

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <ProductGridHeader
        title="Product Management"
        subtitle="Manage your product catalog"
        onRefresh={fetchProducts}
        onCreate={handleAddProduct}
      />

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {search || categoryFilter ? 'No products match your filters' : 'No products found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const stockTotal = getStockTotal(product);
                
                return (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{product.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <ProductStatusChip
                        status={product.category as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <ProductPriceDisplay
                        price={product.basePrice}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <ProductStockBadge
                        stock={stockTotal}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <ProductStatusChip
                        status={product.isActive ? 'active' : 'inactive'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <ProductActions
                        onView={() => handleViewProduct(product._id)}
                        onEdit={() => handleEditProduct(product._id)}
                        onDelete={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            // Handle delete
                          }
                        }}
                        variant="icon"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
      />
    </Box>
  );
}