// components/googleadminproductid/hooks/useProductDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, StockStatus } from '../components/types';

export const useProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProduct = useCallback(async () => {
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
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, fetchProduct]);

  const handleRefresh = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleEdit = useCallback(() => {
    router.push(`/admin/products/${params.id}/edit`);
  }, [params.id, router]);

  const handleBack = useCallback(() => {
    router.push('/admin/products');
  }, [router]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Calculate total stock
  const calculateTotalStock = useCallback((product: Product | null): number => {
    if (!product) return 0;
    let total = 0;
    if (product.variations?.length > 0) {
      product.variations.forEach((v: Variation) => total += v.stock || 0);
    }
    if (product.batches?.length > 0) {
      product.batches.forEach((b: Batch) => total += b.quantity || 0);
    }
    return total;
  }, []);

  // Format currency
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Get stock status
  const getStockStatus = useCallback((stock: number): StockStatus => {
    if (stock === 0) return { color: '#ea4335', label: 'Out of Stock' };
    if (stock < 10) return { color: '#fbbc04', label: 'Low Stock' };
    return { color: '#34a853', label: 'In Stock' };
  }, []);

  return {
    product,
    loading,
    error,
    activeTab,
    totalStock: calculateTotalStock(product),
    fetchProduct: handleRefresh,
    handleEdit,
    handleBack,
    handleTabChange,
    formatCurrency,
    getStockStatus,
  };
};