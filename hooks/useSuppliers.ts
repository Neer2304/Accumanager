import { useState, useEffect, useCallback } from 'react';

export interface Supplier {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  rating?: number;
  totalOrders?: number;
  totalSpent?: number;
  leadTime?: number;
  paymentTerms?: string;
  materialsSupplied?: string[];
  notes?: string;
  lastOrderDate?: string;
  createdAt?: string;
  updatedAt?: string;
  supplierCode?: string;
  averageMonthlyUsage?: number;
  lowStockAlert?: boolean;
  batchNumber?: string;
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  reorderPoint?: number;
  unit?: string;
  unitCost?: number;
  currentStock?: number;
  totalValue?: number;
  description?: string;
  category?: string;
  sku?: string;
  totalQuantityUsed?: number;
  materials?: Array<{
    _id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    unit: string;
    unitCost: number;
    totalValue: number;
    status: string;
    minimumStock: number;
    reorderPoint: number;
    lastRestocked?: string;
    lastUsed?: string;
  }>;
  performance?: {
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
  };
}

export interface SupplierFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalOrders: number;
  totalSpent: number;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ActivityHistory {
  type: 'usage' | 'restock';
  id: string;
  date: string;
  materialId: string;
  materialName: string;
  materialSku: string;
  supplierName: string;
  supplierCode?: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  purchaseOrder?: string;
  user?: string;
  project?: string;
  note?: string;
  status: string;
  icon: string;
  color: string;
  details?: string;
}

export interface MaterialHistory {
  type: 'usage' | 'restock';
  id: string;
  date: string;
  quantity: number;
  user: string;
  project?: string;
  note?: string;
  cost: number;
  total: number;
  status: string;
  icon: string;
  color: string;
  supplier?: string;
  purchaseOrder?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierMaterials, setSupplierMaterials] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([]);
  const [materialHistory, setMaterialHistory] = useState<MaterialHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState<SupplierStats>({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalOrders: 0,
    totalSpent: 0,
  });

  // Default filters
  const defaultFilters: SupplierFilters = {
    search: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 20,
  };

  const [filters, setFilters] = useState<SupplierFilters>(defaultFilters);

  // Fetch all suppliers
  const fetchSuppliers = useCallback(async (customFilters?: Partial<SupplierFilters>) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = { ...filters, ...customFilters };
      
      // Build query string
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/material/suppliers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuppliers(data.data.suppliers || []);
        setPagination({
          page: (data.data.pagination?.page || 1) - 1,
          limit: data.data.pagination?.limit || 20,
          total: data.data.pagination?.total || 0,
          pages: data.data.pagination?.pages || 1,
        });
        setStats(data.data.stats || {
          totalSuppliers: 0,
          activeSuppliers: 0,
          totalOrders: 0,
          totalSpent: 0,
        });
        
        // Update filters if custom filters were provided
        if (customFilters) {
          setFilters(prev => ({ ...prev, ...customFilters }));
        }
      } else {
        throw new Error(data.message || 'Failed to fetch suppliers');
      }
    } catch (err) {
      console.error('Fetch suppliers error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single supplier details
  const fetchSupplierDetails = useCallback(async (supplierId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/material/suppliers/${encodeURIComponent(supplierId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSelectedSupplier(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch supplier details');
      }
    } catch (err) {
      console.error('Fetch supplier details error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching supplier details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch supplier materials
  const fetchSupplierMaterials = useCallback(async (supplierName: string, page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/material/suppliers/${encodeURIComponent(supplierName)}/materials?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSupplierMaterials(data.data.materials || []);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch supplier materials');
      }
    } catch (err) {
      console.error('Fetch supplier materials error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching supplier materials');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch supplier activity history
  const fetchSupplierActivity = useCallback(async (options: {
    supplierName?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.supplierName) params.append('supplier', options.supplierName);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);

      const response = await fetch(`/api/material/suppliers/history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setActivityHistory(data.data.activity || []);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch supplier activity');
      }
    } catch (err) {
      console.error('Fetch supplier activity error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching supplier activity');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch material history
  const fetchMaterialHistory = useCallback(async (materialId: string, options: {
    type?: 'all' | 'usage' | 'restock';
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.type && options.type !== 'all') params.append('type', options.type);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);

      const response = await fetch(`/api/material/${materialId}/history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMaterialHistory(data.data.history || []);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch material history');
      }
    } catch (err) {
      console.error('Fetch material history error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching material history');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SupplierFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Delete supplier
  const deleteSupplier = useCallback(async (supplierName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/material/suppliers/${encodeURIComponent(supplierName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Refresh suppliers list
        await fetchSuppliers();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Failed to delete supplier');
      }
    } catch (err) {
      console.error('Delete supplier error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting supplier');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  // Export suppliers data
  const exportSuppliers = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would call your export API
      // For now, we'll simulate it
      console.log(`Exporting suppliers as ${format}...`);
      
      // Create export data
      const exportData = suppliers.map(supplier => ({
        name: supplier.name,
        code: supplier.supplierCode || '',
        status: supplier.status,
        contact: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        materials: supplier.materialsSupplied?.length || 0,
        totalOrders: supplier.totalOrders || 0,
        totalSpent: supplier.totalSpent || 0,
        leadTime: supplier.leadTime || 0,
        lastOrder: supplier.lastOrderDate ? new Date(supplier.lastOrderDate).toLocaleDateString() : 'Never',
      }));

      // Simulate file download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppliers_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error('Export suppliers error:', err);
      setError(err instanceof Error ? err.message : 'Error exporting suppliers');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [suppliers]);

  // Clear selected supplier
  const clearSelectedSupplier = useCallback(() => {
    setSelectedSupplier(null);
  }, []);

  // Clear activity history
  const clearActivityHistory = useCallback(() => {
    setActivityHistory([]);
  }, []);

  // Clear material history
  const clearMaterialHistory = useCallback(() => {
    setMaterialHistory([]);
  }, []);

  // Clear supplier materials
  const clearSupplierMaterials = useCallback(() => {
    setSupplierMaterials([]);
  }, []);

  // Get supplier by name
  const getSupplierByName = useCallback((name: string): Supplier | undefined => {
    return suppliers.find(supplier => supplier.name.toLowerCase() === name.toLowerCase());
  }, [suppliers]);

  // Get suppliers by status
  const getSuppliersByStatus = useCallback((status: string): Supplier[] => {
    return suppliers.filter(supplier => supplier.status === status);
  }, [suppliers]);

  // Search suppliers
  const searchSuppliers = useCallback((query: string): Supplier[] => {
    if (!query.trim()) return suppliers;
    
    const lowerQuery = query.toLowerCase();
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(lowerQuery) ||
      supplier.supplierCode?.toLowerCase().includes(lowerQuery) ||
      supplier.email?.toLowerCase().includes(lowerQuery) ||
      supplier.phone?.toLowerCase().includes(lowerQuery) ||
      supplier.contactPerson?.toLowerCase().includes(lowerQuery)
    );
  }, [suppliers]);

  // Calculate supplier statistics
  const calculateStatistics = useCallback(() => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const totalOrders = suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0);
    const totalSpent = suppliers.reduce((sum, s) => sum + (s.totalSpent || 0), 0);
    
    return {
      totalSuppliers,
      activeSuppliers,
      totalOrders,
      totalSpent,
      averageOrdersPerSupplier: totalSuppliers > 0 ? totalOrders / totalSuppliers : 0,
      averageSpentPerSupplier: totalSuppliers > 0 ? totalSpent / totalSuppliers : 0,
    };
  }, [suppliers]);

  // Initialize with data
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    // State
    suppliers,
    selectedSupplier,
    supplierMaterials,
    activityHistory,
    materialHistory,
    loading,
    error,
    pagination,
    stats,
    filters,
    
    // Actions
    fetchSuppliers,
    fetchSupplierDetails,
    fetchSupplierMaterials,
    fetchSupplierActivity,
    fetchMaterialHistory,
    updateFilters,
    resetFilters,
    deleteSupplier,
    exportSuppliers,
    clearSelectedSupplier,
    clearActivityHistory,
    clearMaterialHistory,
    clearSupplierMaterials,
    
    // Utility functions
    getSupplierByName,
    getSuppliersByStatus,
    searchSuppliers,
    calculateStatistics,
    
    // Error handling
    clearError: () => setError(null),
  };
};

export default useSuppliers;