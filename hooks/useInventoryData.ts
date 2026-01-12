import { useState, useEffect } from 'react';

export interface ProductVariation {
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  sku?: string;
}

export interface ProductBatch {
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  mfgDate: string;
  expDate: string;
}

export interface GSTDetails {
  type: string;
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  utgstRate: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: GSTDetails;
  variations?: ProductVariation[];
  batches?: ProductBatch[];
  tags?: string[];
  isReturnable: boolean;
  returnPeriod: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMetrics {
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalStockValue: number;
  totalSellingValue: number;
  profitMargin: number;
  marginPercentage: number;
}

export interface InventoryMetricCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface UseInventoryDataReturn {
  products: Product[];
  metrics: InventoryMetrics;
  metricCards: InventoryMetricCard[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  calculateTotalStock: (product: Product) => number;
  getStockStatus: (product: Product) => 'in_stock' | 'low_stock' | 'out_of_stock' | 'over_stock';
  getMinStockLevel: (product: Product) => number;
  getCategoryColor: (category: string, theme: any) => string;
}

export const useInventoryData = (): UseInventoryDataReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      let processedProducts: Product[] = [];
      if (Array.isArray(productsData)) {
        processedProducts = productsData;
      } else if (productsData && Array.isArray(productsData.products)) {
        processedProducts = productsData.products;
      } else if (productsData && typeof productsData === 'object') {
        processedProducts = [productsData];
      }
      
      setProducts(processedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('❌ Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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

  // Get category color
  const getCategoryColor = (category: string, theme: any): string => {
    const colors: Record<string, string> = {
      'Electronics': theme.palette.primary.main,
      'Food & Beverages': theme.palette.success.main,
      'Fitness': theme.palette.warning.main,
      'Home & Kitchen': theme.palette.secondary.main,
      'default': theme.palette.text.secondary,
    };
    return colors[category] || colors.default;
  };

  // Calculate inventory metrics
  const calculateMetrics = (): InventoryMetrics => {
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

  // Get metric cards for display
  const getMetricCards = (metrics: InventoryMetrics): InventoryMetricCard[] => {
    return [
      { 
        title: 'Total Products', 
        value: metrics.totalItems, 
        change: products.length > 0 ? 12.5 : 0,
        icon: 'Inventory',
        trend: 'up'
      },
      { 
        title: 'In Stock', 
        value: metrics.inStock, 
        change: metrics.inStock > 0 ? 8.2 : 0,
        icon: 'CheckCircle',
        trend: 'up'
      },
      { 
        title: 'Low Stock', 
        value: metrics.lowStock, 
        change: metrics.lowStock > 0 ? -3.4 : 0,
        icon: 'Warning',
        trend: 'down'
      },
      { 
        title: 'Out of Stock', 
        value: metrics.outOfStock, 
        change: metrics.outOfStock > 0 ? 1.8 : 0,
        icon: 'Error',
        trend: 'up'
      },
    ];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const metrics = calculateMetrics();
  const metricCards = getMetricCards(metrics);

  return {
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
  };
};