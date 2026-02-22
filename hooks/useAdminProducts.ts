// hooks/useAdminProducts.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminProductService } from '@/services/adminProductService';
import { AdminProductStatsService } from '@/services/adminProductStatsService';
import { ProductFilters } from '@/types/product';
import {
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  removeProduct,
  bulkRemoveProducts,
  clearSelectedProduct,
  setFilters,
  setPage,
  resetFilters,
  setPagination,
  setStats,
  setLoading,
  setSubmitting,
  setError,
  setSuccess,
  clearMessages,
} from '@/store/slices/adminProductsSlice';

interface UseAdminProductsReturn {
  // State
  products: any[];
  selectedProduct: any | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalProducts: number;
  };
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;

  // CRUD Actions
  loadProducts: () => Promise<void>;
  loadProduct: (id: string) => Promise<any | null>;
  createProduct: (productData: Partial<any>) => Promise<any | null>;
  updateProduct: (id: string, productData: Partial<any>) => Promise<any | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  exportProducts: () => Promise<void>;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setProductsPage: (page: number) => void;
  resetAllFilters: () => void;
  applyFilters: (newFilters: Partial<ProductFilters>) => void;

  // Selection Actions
  selectProduct: (product: any | null) => void;
  clearSelected: () => void;

  // Stats
  loadStats: () => Promise<void>;

  // Messages
  clearError: () => void;
  clearSuccess: () => void;
  clearAllMessages: () => void;

  // Helpers
  getTotalPages: () => number;
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
  getPaginatedProducts: () => any[];
}

export const useAdminProducts = (autoLoad: boolean = true): UseAdminProductsReturn => {
  const dispatch = useDispatch();

  // Selectors
  const products = useSelector((state: any) => state.adminProducts.items);
  const selectedProduct = useSelector((state: any) => state.adminProducts.selectedProduct);
  const filters = useSelector((state: any) => state.adminProducts.filters);
  const pagination = useSelector((state: any) => state.adminProducts.pagination);
  const stats = useSelector((state: any) => state.adminProducts.stats);
  const loading = useSelector((state: any) => state.adminProducts.loading);
  const submitting = useSelector((state: any) => state.adminProducts.submitting);
  const error = useSelector((state: any) => state.adminProducts.error);
  const success = useSelector((state: any) => state.adminProducts.success);

  // Load products with current filters
  const loadProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      const response = await AdminProductService.getProducts(filters);
      
      dispatch(setProducts(response.products));
      dispatch(setPagination({
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load products'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters]);

  // Load single product
  const loadProduct = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      const product = await AdminProductService.getProduct(id);
      dispatch(setSelectedProduct(product));
      return product;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load product'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Create product
  const createProduct = useCallback(async (productData: Partial<any>) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const newProduct = await AdminProductService.createProduct(productData);
      dispatch(addProduct(newProduct));
      dispatch(setSuccess('Product created successfully'));
      return newProduct;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to create product'));
      return null;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Update product
  const updateProduct = useCallback(async (id: string, productData: Partial<any>) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      const updatedProduct = await AdminProductService.updateProduct(id, productData);
      dispatch(updateProduct(updatedProduct));
      dispatch(setSuccess('Product updated successfully'));
      return updatedProduct;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update product'));
      return null;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Delete product
  const deleteProduct = useCallback(async (id: string) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      await AdminProductService.deleteProduct(id);
      dispatch(removeProduct(id));
      dispatch(setSuccess('Product deleted successfully'));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to delete product'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Bulk delete
  const bulkDelete = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      dispatch(setError('No products selected'));
      return false;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearMessages());

      await AdminProductService.bulkDeleteProducts(ids);
      dispatch(bulkRemoveProducts(ids));
      dispatch(setSuccess(`${ids.length} products deleted successfully`));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to delete products'));
      return false;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  // Export products
  const exportProducts = useCallback(async () => {
    try {
      await AdminProductService.exportProducts();
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to export products'));
    }
  }, [dispatch]);

  // Load stats
  const loadStats = useCallback(async () => {
    const stats = await AdminProductStatsService.getStats();
    dispatch(setStats(stats));
  }, [dispatch]);

  // Filter actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch(setFilters({ search: query, page: 1 }));
  }, [dispatch]);

  const setCategoryFilter = useCallback((category: string) => {
    dispatch(setFilters({ category, page: 1 }));
  }, [dispatch]);

  const setProductsPage = useCallback((page: number) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const applyFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Selection
  const selectProduct = useCallback((product: any | null) => {
    dispatch(setSelectedProduct(product));
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedProduct());
  }, [dispatch]);

  // Messages
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const clearSuccess = useCallback(() => {
    dispatch(setSuccess(null));
  }, [dispatch]);

  const clearAllMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  // Pagination helpers
  const getTotalPages = useCallback(() => pagination.pages, [pagination.pages]);
  const hasNextPage = useCallback(() => pagination.page < pagination.pages, [pagination]);
  const hasPrevPage = useCallback(() => pagination.page > 1, [pagination.page]);
  const getPaginatedProducts = useCallback(() => products, [products]);

  // Auto-load on mount and filter changes
  useEffect(() => {
    if (autoLoad) {
      loadProducts();
      loadStats();
    }
  }, [autoLoad, loadProducts, loadStats, filters.page, filters.search, filters.category]);

  return {
    // State
    products,
    selectedProduct,
    filters,
    pagination,
    stats,
    loading,
    submitting,
    error,
    success,

    // CRUD Actions
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    exportProducts,

    // Filter Actions
    setSearchQuery,
    setCategoryFilter,
    setProductsPage,
    resetAllFilters,
    applyFilters,

    // Selection
    selectProduct,
    clearSelected,

    // Stats
    loadStats,

    // Messages
    clearError,
    clearSuccess,
    clearAllMessages,

    // Helpers
    getTotalPages,
    hasNextPage,
    hasPrevPage,
    getPaginatedProducts,
  };
};