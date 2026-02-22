// services/materialService.ts
import { Material, MaterialFilters } from '@/types/material';

class MaterialServiceClass {
  private baseUrl = '/api/materials';

  // ==================== MAIN MATERIAL ENDPOINTS ====================

  /**
   * GET /api/materials - Get all materials with filters
   */
  async getMaterials(filters: MaterialFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const res = await fetch(`${this.baseUrl}?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * POST /api/materials - Create new material
   */
  async createMaterial(data: Partial<Material>) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response.message);
    return response.data;
  }

  // ==================== SINGLE MATERIAL ENDPOINTS ====================

  /**
   * GET /api/materials/[id] - Get single material
   */
  async getMaterial(id: string) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * PUT /api/materials/[id] - Update material
   */
  async updateMaterial(id: string, data: Partial<Material>) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response.message);
    return response.data;
  }

  /**
   * DELETE /api/materials/[id] - Delete material
   */
  async deleteMaterial(id: string) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  // ==================== MATERIAL HISTORY ENDPOINTS ====================

  /**
   * GET /api/materials/[id]/history - Get material history (usage + restock)
   */
  async getMaterialHistory(id: string, filters?: { type?: 'usage' | 'restock'; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${this.baseUrl}/${id}/history?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  // ==================== USAGE ENDPOINTS ====================

  /**
   * POST /api/materials/use - Record material usage
   */
  async useMaterial(data: { materialId: string; quantity: number; usedBy: string; project?: string; note?: string }) {
    const res = await fetch(`${this.baseUrl}/use`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response.message);
    return response.data;
  }

  // ==================== RESTOCK ENDPOINTS ====================

  /**
   * POST /api/materials/restock - Restock material
   */
  async restockMaterial(data: { 
    materialId: string; 
    quantity: number; 
    supplier?: string; 
    purchaseOrder?: string;
    unitCost?: number; 
    note?: string 
  }) {
    const res = await fetch(`${this.baseUrl}/restock`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response.message);
    return response.data;
  }

  // ==================== STATS ENDPOINTS ====================

  /**
   * GET /api/materials/stats - Get material statistics
   */
  async getStats(days: number = 30) {
    const res = await fetch(`${this.baseUrl}/stats?days=${days}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * GET /api/materials/stats/activity - Get recent activity
   */
  async getRecentActivity(limit: number = 20) {
    const res = await fetch(`${this.baseUrl}/stats/activity?limit=${limit}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * GET /api/materials/stats/top - Get top used materials
   */
  async getTopUsed(limit: number = 10) {
    const res = await fetch(`${this.baseUrl}/stats/top?limit=${limit}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * GET /api/materials/stats/low-stock - Get low stock count
   */
  async getLowStockCount() {
    const res = await fetch(`${this.baseUrl}/stats/low-stock`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.count;
  }

  // ==================== SUPPLIER ENDPOINTS ====================

  /**
   * GET /api/materials/suppliers - Get all suppliers
   */
  async getSuppliers(filters?: { search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${this.baseUrl}/suppliers?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * GET /api/materials/suppliers/[name] - Get single supplier
   */
  async getSupplier(name: string) {
    const encodedName = encodeURIComponent(name);
    const res = await fetch(`${this.baseUrl}/suppliers/${encodedName}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * DELETE /api/materials/suppliers/[name] - Delete supplier
   */
  async deleteSupplier(name: string) {
    const encodedName = encodeURIComponent(name);
    const res = await fetch(`${this.baseUrl}/suppliers/${encodedName}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  /**
   * GET /api/materials/suppliers/[name]/materials - Get materials from supplier
   */
  async getSupplierMaterials(name: string, filters?: { page?: number; limit?: number }) {
    const encodedName = encodeURIComponent(name);
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${this.baseUrl}/suppliers/${encodedName}/materials?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * GET /api/materials/suppliers/history - Get suppliers activity history
   */
  async getSuppliersHistory(filters?: { supplier?: string; limit?: number; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.supplier) params.append('supplier', filters.supplier);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const res = await fetch(`${this.baseUrl}/suppliers/history?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * POST /api/materials/batch - Batch update materials
   */
  async batchUpdate(updates: Array<{ id: string; data: Partial<Material> }>) {
    const res = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  // ==================== EXPORT/IMPORT ====================

  /**
   * GET /api/materials/export - Export materials to CSV/Excel
   */
  async exportMaterials(format: 'csv' | 'excel' = 'csv') {
    const res = await fetch(`${this.baseUrl}/export?format=${format}`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `materials_export_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  }

  /**
   * POST /api/materials/import - Import materials from CSV
   */
  async importMaterials(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  // ==================== CATEGORIES ====================

  /**
   * GET /api/materials/categories - Get all categories
   */
  async getCategories() {
    const res = await fetch(`${this.baseUrl}/categories`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  // ==================== LOW STOCK ALERTS ====================

  /**
   * GET /api/materials/alerts - Get low stock alerts
   */
  async getLowStockAlerts(threshold?: number) {
    const params = new URLSearchParams();
    if (threshold) params.append('threshold', threshold.toString());

    const res = await fetch(`${this.baseUrl}/alerts?${params}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data;
  }

  /**
   * POST /api/materials/alerts/[id]/resolve - Resolve alert
   */
  async resolveAlert(alertId: string) {
    const res = await fetch(`${this.baseUrl}/alerts/${alertId}/resolve`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
}

export const MaterialService = new MaterialServiceClass();