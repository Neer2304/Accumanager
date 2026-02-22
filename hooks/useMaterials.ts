// hooks/useMaterials.ts
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MaterialService } from '@/services/materialService'
import { Material, MaterialFilters } from '@/types/material'
import {
  setMaterials,
  setSelectedMaterial,
  addMaterial,
  updateMaterial,
  removeMaterial,
  setSearch,
  setCategoryFilter,
  setStatusFilter,
  clearFilters,
  setPage,
  setPagination,
  setLoading,
  setError,
  clearError,
} from '@/store/slices/materialsSlice'

export const useMaterials = (autoLoad = true) => {
  const dispatch = useDispatch()

  // Get state from Redux
  const materials = useSelector((state: any) => state.materials.items)
  const selectedMaterial = useSelector((state: any) => state.materials.selectedMaterial)
  const isLoading = useSelector((state: any) => state.materials.isLoading)
  const error = useSelector((state: any) => state.materials.error)
  const filters = useSelector((state: any) => state.materials.filters)
  const pagination = useSelector((state: any) => state.materials.pagination)

  // Load materials
  const loadMaterials = useCallback(async (page = pagination.page) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const data = await MaterialService.getMaterials({
        page,
        limit: pagination.limit,
        search: filters.search,
        category: filters.category,
        status: filters.status,
      })

      dispatch(setMaterials(data.materials || data))
      if (data.pagination) {
        dispatch(setPagination({
          total: data.pagination.total,
          pages: data.pagination.pages,
        }))
      }
    } catch (err: any) {
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, pagination.page, pagination.limit, filters])

  // Get single material
  const getMaterial = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const material = await MaterialService.getMaterial(id)
      dispatch(setSelectedMaterial(material))
      return material
    } catch (err: any) {
      dispatch(setError(err.message))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Create material
  const createMaterial = useCallback(async (data: Partial<Material>) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const newMaterial = await MaterialService.createMaterial(data)
      dispatch(addMaterial(newMaterial))
      return newMaterial
    } catch (err: any) {
      dispatch(setError(err.message))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Update material
  const updateMaterialById = useCallback(async (id: string, data: Partial<Material>) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const updated = await MaterialService.updateMaterial(id, data)
      dispatch(updateMaterial(updated))
      return updated
    } catch (err: any) {
      dispatch(setError(err.message))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Delete material
  const deleteMaterial = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await MaterialService.deleteMaterial(id)
      dispatch(removeMaterial(id))
      return true
    } catch (err: any) {
      dispatch(setError(err.message))
      return false
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Use material (record consumption)
  const useMaterial = useCallback(async (id: string, usageData: any) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const updated = await MaterialService.useMaterial(id, usageData)
      dispatch(updateMaterial(updated))
      return updated
    } catch (err: any) {
      dispatch(setError(err.message))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Restock material
  const restockMaterial = useCallback(async (id: string, restockData: any) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const updated = await MaterialService.restockMaterial(id, restockData)
      dispatch(updateMaterial(updated))
      return updated
    } catch (err: any) {
      dispatch(setError(err.message))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Filter actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch(setSearch(query))
  }, [dispatch])

  const setCategory = useCallback((category: string) => {
    dispatch(setCategoryFilter(category))
  }, [dispatch])

  const setStatus = useCallback((status: string) => {
    dispatch(setStatusFilter(status))
  }, [dispatch])

  const resetAllFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const changePage = useCallback((page: number) => {
    dispatch(setPage(page))
  }, [dispatch])

  // Load on mount and filter change
  useEffect(() => {
    if (autoLoad) {
      loadMaterials()
    }
  }, [loadMaterials, autoLoad, filters.search, filters.category, filters.status, pagination.page])

  // Helper functions
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return '#34a853'
      case 'low-stock': return '#fbbc04'
      case 'out-of-stock': return '#ea4335'
      default: return '#5f6368'
    }
  }

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock': return 'In Stock'
      case 'low-stock': return 'Low Stock'
      case 'out-of-stock': return 'Out of Stock'
      default: return status
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const isLowStock = (material: Material) => {
    return material.currentStock <= material.minimumStock
  }

  const getTotalValue = () => {
    return materials.reduce((sum, m) => sum + (m.totalValue || 0), 0)
  }

  return {
    // State
    materials,
    selectedMaterial,
    isLoading,
    error,
    filters,
    pagination,

    // CRUD
    loadMaterials,
    getMaterial,
    createMaterial,
    updateMaterial: updateMaterialById,
    deleteMaterial,
    useMaterial,
    restockMaterial,

    // Filter actions
    setSearchQuery,
    setCategory,
    setStatus,
    resetFilters: resetAllFilters,
    changePage,

    // Selection
    selectMaterial: (material: Material | null) => dispatch(setSelectedMaterial(material)),
    clearSelectedMaterial: () => dispatch(setSelectedMaterial(null)),

    // Helpers
    getStockStatusColor,
    getStockStatusLabel,
    formatCurrency,
    isLowStock,
    getTotalValue,
  }
}