// services/adminProductService.ts
import { Product, ProductsResponse, ProductFilters } from '@/types/product';

class AdminProductServiceClass {
  private baseUrl = '/api/admin/products';

  /**
   * Get all products with filters and pagination
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`${this.baseUrl}?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't cache admin data
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      return {
        products: data.products || [],
        pagination: data.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${this.baseUrl}/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        if (response.status === 400) {
          throw new Error('Invalid product ID format');
        }
        throw new Error(data.message || 'Failed to fetch product');
      }

      return data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      return data.product || data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      return data.product || data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      return {
        success: true,
        message: data.message || 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  /**
   * Bulk delete products
   */
  async bulkDeleteProducts(ids: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/bulk-delete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete products');
      }

      return {
        success: true,
        message: data.message || `${ids.length} products deleted successfully`
      };
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }

  /**
   * Export products to CSV
   */
  async exportProducts(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/export`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to export products');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
}

export const AdminProductService = new AdminProductServiceClass();