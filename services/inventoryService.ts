// services/inventoryService.ts
import { offlineStorage } from '@/utils/offlineStorage';

interface Product {
  _id: string;
  name: string;
  variations: Array<{
    _id?: string;
    name: string;
    stock: number;
    price: number;
  }>;
  batches: Array<{
    _id?: string;
    batchNumber: string;
    quantity: number;
  }>;
  isActive: boolean;
}

interface InventoryItem {
  productId: string;
  variationId?: string;
  quantity: number;
}

export class InventoryService {
  // Deduct inventory for bill items
  static async deductInventory(items: InventoryItem[]): Promise<void> {
    try {
      console.log('📦 Deducting inventory for items:', items);

      // Get products from offline storage first
      let products = await offlineStorage.getItem<Product[]>('products') || [];
      
      // Update each product
      for (const item of items) {
        const productIndex = products.findIndex(p => p._id === item.productId);
        
        if (productIndex === -1) {
          console.warn(`⚠️ Product not found in local storage: ${item.productId}`);
          continue;
        }

        const product = products[productIndex];
        
        if (!product.isActive) {
          throw new Error(`Product ${product.name} is not active`);
        }

        if (item.variationId) {
          // Deduct from specific variation
          const variationIndex = product.variations.findIndex(
            v => v._id === item.variationId
          );
          
          if (variationIndex === -1) {
            throw new Error(`Variation not found for product ${product.name}`);
          }

          if (product.variations[variationIndex].stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name} - ${product.variations[variationIndex].name}. ` +
              `Available: ${product.variations[variationIndex].stock}, Requested: ${item.quantity}`
            );
          }

          product.variations[variationIndex].stock -= item.quantity;
          console.log(`✅ Deducted ${item.quantity} from ${product.name} - ${product.variations[variationIndex].name}`);
        } else {
          // Deduct from batches (FIFO) first, then variations
          let remainingQty = item.quantity;
          
          // Try batches first
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

          // If still remaining, deduct from variations
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
            throw new Error(`Insufficient total stock for ${product.name}`);
          }

          console.log(`✅ Deducted ${item.quantity} from ${product.name}`);
        }

        // Update product in array
        products[productIndex] = product;
      }

      // Save updated products back to offline storage
      await offlineStorage.setItem('products', products);
      console.log('💾 Inventory updated in local storage');

      // Try to sync with server if online
      if (navigator.onLine) {
        await this.syncInventoryWithServer(products);
      } else {
        // Queue for sync
        await offlineStorage.addToSyncQueue('inventory', 'products', 'bulk_update', { products });
      }

    } catch (error) {
      console.error('❌ Failed to deduct inventory:', error);
      throw error;
    }
  }

  // Restock inventory (for returns/cancellations)
  static async restockInventory(items: InventoryItem[]): Promise<void> {
    try {
      console.log('📦 Restocking inventory for items:', items);

      const products = await offlineStorage.getItem<Product[]>('products') || [];

      for (const item of items) {
        const productIndex = products.findIndex(p => p._id === item.productId);
        
        if (productIndex === -1) {
          console.warn(`⚠️ Product not found: ${item.productId}`);
          continue;
        }

        const product = products[productIndex];

        if (item.variationId) {
          // Restock specific variation
          const variationIndex = product.variations.findIndex(
            v => v._id === item.variationId
          );
          
          if (variationIndex !== -1) {
            product.variations[variationIndex].stock += item.quantity;
          }
        } else {
          // Add to first variation
          if (product.variations.length > 0) {
            product.variations[0].stock += item.quantity;
          } else {
            // Create a return batch
            product.batches.push({
              batchNumber: `RET-${Date.now()}`,
              quantity: item.quantity,
            });
          }
        }

        products[productIndex] = product;
        console.log(`✅ Restocked ${item.quantity} to ${product.name}`);
      }

      await offlineStorage.setItem('products', products);
      console.log('💾 Inventory restocked in local storage');

    } catch (error) {
      console.error('❌ Failed to restock inventory:', error);
      throw error;
    }
  }

  // Sync inventory with server
  private static async syncInventoryWithServer(products: Product[]): Promise<void> {
    try {
      console.log('🔄 Syncing inventory with server...');

      const response = await fetch('/api/inventory/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ products }),
      });

      if (response.ok) {
        console.log('✅ Inventory synced with server');
      } else {
        console.warn('⚠️ Failed to sync inventory with server');
      }
    } catch (error) {
      console.error('❌ Inventory sync error:', error);
    }
  }

  // Get low stock products
  static async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const products = await offlineStorage.getItem<Product[]>('products') || [];
    
    return products.filter(product => 
      product.isActive && (
        product.variations.some(v => v.stock <= threshold) ||
        product.batches.some(b => b.quantity <= threshold)
      )
    );
  }

  // Get expired batches
  static async getExpiredBatches(): Promise<Array<{product: Product, batch: any}>> {
    const products = await offlineStorage.getItem<Product[]>('products') || [];
    const expired: Array<{product: Product, batch: any}> = [];

    products.forEach(product => {
      product.batches.forEach(batch => {
        if (batch.expDate && new Date(batch.expDate) < new Date()) {
          expired.push({ product, batch });
        }
      });
    });

    return expired;
  }

  // Get stock summary
  static async getStockSummary() {
    const products = await offlineStorage.getItem<Product[]>('products') || [];
    
    const summary = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalStock: products.reduce((sum, product) => {
        const variationsStock = product.variations.reduce((vSum, v) => vSum + v.stock, 0);
        const batchesStock = product.batches.reduce((bSum, b) => bSum + b.quantity, 0);
        return sum + variationsStock + batchesStock;
      }, 0),
      totalValue: products.reduce((sum, product) => {
        return sum + product.variations.reduce((vSum, v) => vSum + (v.price * v.stock), 0);
      }, 0),
      lowStockCount: products.filter(product => 
        product.variations.some(v => v.stock <= 10)
      ).length,
      outOfStockCount: products.filter(product => 
        product.variations.every(v => v.stock === 0) && 
        product.batches.every(b => b.quantity === 0)
      ).length,
    };

    return summary;
  }
}