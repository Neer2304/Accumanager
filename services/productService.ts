// services/productService.ts - COMPLETE WITH OFFLINE SYNC
import { offlineStorage } from '@/utils/offlineStorage';

interface Product {
  _id: string;
  name: string;
  sku?: string;
  description: string;
  category: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: {
    type: string;
    hsnCode: string;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    utgstRate: number;
  };
  variations: Array<{
    _id?: string;
    name: string;
    sku?: string;
    price: number;
    costPrice: number;
    stock: number;
    weight?: number;
    size?: string;
    color?: string;
    material?: string;
  }>;
  batches: Array<{
    _id?: string;
    batchNumber: string;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    mfgDate: Date;
    expDate: Date;
    receivedDate: Date;
  }>;
  tags: string[];
  isReturnable: boolean;
  returnPeriod: number;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLocal?: boolean;
  isSynced?: boolean;
  syncAttempts?: number;
}

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      const isOnline = navigator.onLine;
      
      if (isOnline) {
        try {
          const response = await fetch('/api/products', {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            const products = data.products || [];
            
            // Save to offline storage
            await offlineStorage.setItem('products', products.map((p: any) => ({
              ...p,
              isSynced: true,
            })));
            
            return products;
          }
        } catch (error) {
          console.warn('⚠️ Online fetch failed, using offline data:', error);
        }
      }
      
      // Fallback to offline data
      const offlineProducts = await offlineStorage.getItem<Product[]>('products') || [];
      return offlineProducts;
      
    } catch (error) {
      console.error('❌ Failed to get products:', error);
      return [];
    }
  }
  
  static async addProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'isLocal' | 'isSynced'>): Promise<Product> {
    try {
      const isOnline = navigator.onLine;
      const newProduct: Product = {
        ...productData,
        _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocal: true,
        isSynced: !isOnline,
        syncAttempts: 0,
      };
      
      // Add to offline storage
      const result = await offlineStorage.addItem('products', newProduct, {
        syncImmediately: isOnline,
      });
      
      if (!result.success) {
        throw new Error('Failed to save product locally');
      }
      
      // Try to sync immediately if online
      if (isOnline) {
        this.syncProducts();
      }
      
      return result.data!;
      
    } catch (error) {
      console.error('❌ Failed to add product:', error);
      throw error;
    }
  }
  
  static async updateProduct(productId: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const isOnline = navigator.onLine;
      
      // Update in offline storage
      const result = await offlineStorage.updateItem('products', {
        id: productId,
        ...updateData,
        updatedAt: new Date(),
      });
      
      if (!result.success) {
        throw new Error('Failed to update product locally');
      }
      
      // Try to sync if online
      if (isOnline) {
        this.syncProducts();
      }
      
      return result.data!;
      
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      throw error;
    }
  }
  
  static async deleteProduct(productId: string): Promise<void> {
    try {
      const isOnline = navigator.onLine;
      
      // Delete from offline storage
      const result = await offlineStorage.deleteItem('products', productId);
      
      if (!result.success) {
        throw new Error('Failed to delete product locally');
      }
      
      // Try to sync if online
      if (isOnline) {
        this.syncProducts();
      }
      
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      throw error;
    }
  }
  
  static async syncProducts(): Promise<void> {
    if (!navigator.onLine) return;
    
    try {
      // Get all unsynced products
      const products = await offlineStorage.getItem<Product[]>('products') || [];
      const unsyncedProducts = products.filter(p => p.isLocal && !p.isSynced);
      
      if (unsyncedProducts.length === 0) return;
      
      console.log(`🔄 Syncing ${unsyncedProducts.length} products...`);
      
      for (const product of unsyncedProducts) {
        try {
          // Remove local-only properties
          const { isLocal, isSynced, syncAttempts, ...productData } = product;
          
          let response: Response;
          
          if (productData._id.startsWith('local_')) {
            // New product - POST
            response = await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
              },
              credentials: 'include',
              body: JSON.stringify(productData),
            });
          } else {
            // Existing product - PUT
            response = await fetch(`/api/products/${productData._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
              },
              credentials: 'include',
              body: JSON.stringify(productData),
            });
          }
          
          if (response.ok) {
            // Mark as synced
            await offlineStorage.markItemAsSynced('products', product._id);
            console.log(`✅ Synced product: ${product.name}`);
          } else {
            console.warn(`⚠️ Failed to sync product: ${product.name}`);
          }
          
        } catch (error) {
          console.error(`❌ Error syncing product ${product.name}:`, error);
        }
      }
      
      // Handle deleted products
      await this.syncDeletedProducts();
      
    } catch (error) {
      console.error('❌ Failed to sync products:', error);
    }
  }
  
  private static async syncDeletedProducts(): Promise<void> {
    try {
      const syncQueue = await offlineStorage.getItem<any[]>('sync_queue') || [];
      const deleteActions = syncQueue.filter(item => 
        item.collection === 'products' && item.action === 'delete'
      );
      
      for (const action of deleteActions) {
        try {
          const response = await fetch(`/api/products/${action.itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
            credentials: 'include',
          });
          
          if (response.ok) {
            // Remove from sync queue
            await offlineStorage.updateItem('sync_queue', {
              id: action.id,
              synced: true,
            });
          }
        } catch (error) {
          console.error(`❌ Error syncing delete for product ${action.itemId}:`, error);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to sync deleted products:', error);
    }
  }
  
  static async deductInventoryForBill(items: Array<{
    productId: string;
    variationId?: string;
    quantity: number;
  }>): Promise<void> {
    try {
      console.log('📦 Deducting inventory for bill items:', items);
      
      const products = await offlineStorage.getItem<Product[]>('products') || [];
      const updatedProducts = [...products];
      
      for (const item of items) {
        const productIndex = updatedProducts.findIndex(p => p._id === item.productId);
        if (productIndex === -1) {
          console.warn(`⚠️ Product not found: ${item.productId}`);
          continue;
        }
        
        const product = updatedProducts[productIndex];
        
        if (item.variationId) {
          // Deduct from specific variation
          const variationIndex = product.variations.findIndex(v => v._id === item.variationId);
          if (variationIndex !== -1) {
            if (product.variations[variationIndex].stock >= item.quantity) {
              product.variations[variationIndex].stock -= item.quantity;
              console.log(`✅ Deducted ${item.quantity} from ${product.name} variation`);
            } else {
              throw new Error(`Insufficient stock for ${product.name} variation`);
            }
          }
        } else {
          // Deduct from batches first (FIFO), then variations
          let remainingQty = item.quantity;
          
          // Try batches
          for (const batch of product.batches) {
            if (batch.quantity >= remainingQty) {
              batch.quantity -= remainingQty;
              remainingQty = 0;
              break;
            } else {
              remainingQty -= batch.quantity;
              batch.quantity = 0;
            }
          }
          
          // Try variations
          if (remainingQty > 0) {
            for (const variation of product.variations) {
              if (variation.stock >= remainingQty) {
                variation.stock -= remainingQty;
                remainingQty = 0;
                break;
              } else {
                remainingQty -= variation.stock;
                variation.stock = 0;
              }
            }
          }
          
          if (remainingQty > 0) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          
          console.log(`✅ Deducted ${item.quantity} from ${product.name}`);
        }
        
        // Mark product as updated for sync
        product.updatedAt = new Date();
        product.isSynced = false;
        updatedProducts[productIndex] = product;
      }
      
      // Save updated products
      await offlineStorage.setItem('products', updatedProducts);
      
      // Add sync task for inventory updates
      if (navigator.onLine) {
        this.syncInventoryUpdates(updatedProducts);
      }
      
    } catch (error) {
      console.error('❌ Failed to deduct inventory:', error);
      throw error;
    }
  }
  
  private static async syncInventoryUpdates(products: Product[]): Promise<void> {
    try {
      const unsyncedProducts = products.filter(p => !p.isSynced);
      
      for (const product of unsyncedProducts) {
        try {
          const response = await fetch(`/api/products/${product._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              variations: product.variations,
              batches: product.batches,
            }),
          });
          
          if (response.ok) {
            await offlineStorage.markItemAsSynced('products', product._id);
          }
        } catch (error) {
          console.error(`❌ Error syncing inventory for ${product.name}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to sync inventory updates:', error);
    }
  }
  
  static async getProductStats() {
    const products = await this.getProducts();
    
    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalVariations: products.reduce((sum, p) => sum + p.variations.length, 0),
      totalStock: products.reduce((sum, p) => 
        sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0) +
        p.batches.reduce((bSum, b) => bSum + b.quantity, 0), 0),
      lowStockProducts: products.filter(p => 
        p.variations.some(v => v.stock <= 10) ||
        p.batches.some(b => b.quantity <= 10)
      ).length,
      expiredBatches: products.filter(p => 
        p.batches.some(b => new Date(b.expDate) < new Date())
      ).length,
      totalValue: products.reduce((sum, p) => 
        sum + p.variations.reduce((vSum, v) => vSum + (v.price * v.stock), 0), 0),
    };
  }
}