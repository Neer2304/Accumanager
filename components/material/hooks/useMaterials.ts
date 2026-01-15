import { useState, useCallback } from 'react';
import {
  Material,
  MaterialFilters,
  MaterialFormData,
  MaterialStats,
  UseMaterialRequest,
  RestockMaterialRequest,
  PaginatedMaterials,
  defaultMaterialFilters,
  validateMaterial,
} from '../types/material.types';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MaterialStats | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // API request helper
  const apiRequest = async <T>(
    endpoint: string,
    options?: RequestInit,
    customError?: string
  ): Promise<T> => {
    try {
      const response = await fetch(`/api/material${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: 'include',
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || customError || `Request failed with status ${response.status}`);
      }

      return data.data;
    } catch (err) {
      console.error('API request error:', err);
      throw err;
    }
  };

  // Fetch materials with filters
  const fetchMaterials = useCallback(async (filters: Partial<MaterialFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const data = await apiRequest<PaginatedMaterials>(`?${queryParams}`);
      
      setMaterials(data.materials);
      setPagination(data.pagination);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch materials';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single material
  const fetchMaterial = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const material = await apiRequest<Material>(`/${id}`);
      setCurrentMaterial(material);
      return material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create material
  const createMaterial = useCallback(async (materialData: MaterialFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate
      const validation = validateMaterial(materialData);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      const material = await apiRequest<Material>('', {
        method: 'POST',
        body: JSON.stringify(materialData),
      }, 'Failed to create material');

      // Add to local state
      setMaterials(prev => [material, ...prev]);
      
      return material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update material
  const updateMaterial = useCallback(async (id: string, updates: Partial<MaterialFormData>) => {
    try {
      setLoading(true);
      setError(null);

      const material = await apiRequest<Material>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }, 'Failed to update material');

      // Update in local state
      setMaterials(prev => prev.map(mat => 
        mat._id === id ? { ...mat, ...material } : mat
      ));
      
      // Update current material if it's the one being edited
      if (currentMaterial?._id === id) {
        setCurrentMaterial(material);
      }

      return material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMaterial]);

  // Delete material
  const deleteMaterial = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiRequest(`/${id}`, {
        method: 'DELETE',
      }, 'Failed to delete material');

      // Remove from local state
      setMaterials(prev => prev.filter(mat => mat._id !== id));
      setSelectedMaterials(prev => prev.filter(matId => matId !== id));
      
      // Clear current material if it's the one being deleted
      if (currentMaterial?._id === id) {
        setCurrentMaterial(null);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMaterial]);

  // Use material (reduce stock)
  const useMaterial = useCallback(async (request: UseMaterialRequest) => {
    try {
      setLoading(true);
      setError(null);

      const material = await apiRequest<Material>('/use', {
        method: 'POST',
        body: JSON.stringify(request),
      }, 'Failed to use material');

      // Update in local state
      setMaterials(prev => prev.map(mat => 
        mat._id === material._id ? material : mat
      ));

      return material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to use material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Restock material
  const restockMaterial = useCallback(async (request: RestockMaterialRequest) => {
    try {
      setLoading(true);
      setError(null);

      const material = await apiRequest<Material>('/restock', {
        method: 'POST',
        body: JSON.stringify(request),
      }, 'Failed to restock material');

      // Update in local state
      setMaterials(prev => prev.map(mat => 
        mat._id === material._id ? material : mat
      ));

      return material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restock material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiRequest<MaterialStats>(`/stats?days=${days}`);
      setStats(data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk actions
  const bulkAction = useCallback(async (materialIds: string[], action: string, data?: any) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiRequest('/bulk', {
        method: 'POST',
        body: JSON.stringify({ materialIds, action, data }),
      }, 'Failed to perform bulk action');

      // Refresh materials if needed
      if (['delete', 'update'].includes(action)) {
        await fetchMaterials({ page: pagination.page, limit: pagination.limit });
      }
      
      // Clear selection
      setSelectedMaterials([]);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform bulk action';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, fetchMaterials]);

  // Selection management
  const toggleMaterialSelection = useCallback((materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  }, []);

  const selectAllMaterials = useCallback(() => {
    if (selectedMaterials.length === materials.length) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(materials.map(mat => mat._id));
    }
  }, [materials, selectedMaterials]);

  const clearSelection = useCallback(() => {
    setSelectedMaterials([]);
  }, []);

  // Pagination
  const changePage = useCallback(async (newPage: number) => {
    await fetchMaterials({ ...defaultMaterialFilters, page: newPage, limit: pagination.limit });
  }, [pagination.limit, fetchMaterials]);

  const changeLimit = useCallback(async (newLimit: number) => {
    await fetchMaterials({ ...defaultMaterialFilters, page: 1, limit: newLimit });
  }, [fetchMaterials]);

  // Error handling
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setMaterials([]);
    setSelectedMaterials([]);
    setCurrentMaterial(null);
    setStats(null);
    setError(null);
  }, []);

  return {
    // State
    materials,
    selectedMaterials,
    loading,
    error,
    stats,
    currentMaterial,
    pagination,
    
    // Actions
    fetchMaterials,
    fetchMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    useMaterial,
    restockMaterial,
    fetchStats,
    bulkAction,
    toggleMaterialSelection,
    selectAllMaterials,
    clearSelection,
    changePage,
    changeLimit,
    clearError,
    resetState,
    
    // Setters
    setError,
    setCurrentMaterial,
  };
};