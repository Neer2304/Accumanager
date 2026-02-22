// hooks/useAdminProductDetail.ts
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminProductService } from '@/services/adminProductService';
import {
  setSelectedProduct,
  setLoading,
  setError,
  clearMessages,
} from '@/store/slices/adminProductsSlice';

interface UseAdminProductDetailReturn {
  product: any | null;
  loading: boolean;
  error: string | null;
  loadProduct: (id: string) => Promise<any | null>;
  updateProduct: (id: string, data: Partial<any>) => Promise<any | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  clearProduct: () => void;
}

export const useAdminProductDetail = (productId?: string): UseAdminProductDetailReturn => {
  const dispatch = useDispatch();

  const product = useSelector((state: any) => state.adminProducts.selectedProduct);
  const loading = useSelector((state: any) => state.adminProducts.loading);
  const error = useSelector((state: any) => state.adminProducts.error);

  const loadProduct = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      const productData = await AdminProductService.getProduct(id);
      dispatch(setSelectedProduct(productData));
      return productData;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load product'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateProduct = useCallback(async (id: string, data: Partial<any>) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      const updatedProduct = await AdminProductService.updateProduct(id, data);
      dispatch(setSelectedProduct(updatedProduct));
      return updatedProduct;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update product'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearMessages());

      await AdminProductService.deleteProduct(id);
      dispatch(setSelectedProduct(null));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to delete product'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const clearProduct = useCallback(() => {
    dispatch(setSelectedProduct(null));
  }, [dispatch]);

  // Auto-load if productId provided
  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId, loadProduct]);

  return {
    product,
    loading,
    error,
    loadProduct,
    updateProduct,
    deleteProduct,
    clearProduct,
  };
};