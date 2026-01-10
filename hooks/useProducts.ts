// hooks/useProducts.ts - COMPLETE FIXED VERSION
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { offlineStorage } from "@/utils/offlineStorage";

interface Product {
  _id: string;
  name: string;
  sku?: string;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: {
    type: "cgst_sgst" | "igst" | "utgst";
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
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
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
}

interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice?: number;
  gstDetails: {
    type: "cgst_sgst" | "igst" | "utgst";
    hsnCode: string;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    utgstRate: number;
  };
  variations?: any[];
  batches?: any[];
  tags?: string[];
  isReturnable?: boolean;
  returnPeriod?: number;
}

// Product Service with Offline Support - FIXED WITH ARROW FUNCTIONS
class ProductService {
  private baseUrl = "/api/products";

  // Use arrow function to bind 'this' context
  private getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      // Check localStorage
      const localStorageToken = localStorage.getItem("auth_token");
      if (localStorageToken) return localStorageToken;

      // Check cookies
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      if (cookieToken) return cookieToken;

      // Check sessionStorage
      const sessionToken = sessionStorage.getItem("auth_token");
      if (sessionToken) return sessionToken;
    }
    return null;
  }

  getProducts = async (): Promise<{ products: Product[]; usage?: any }> => {
    try {
      console.log("🔄 Fetching products...");

      // Check if online
      const isOnline = navigator.onLine;
      if (!isOnline) {
        console.log("📱 Offline mode: Loading from local storage");
        const offlineProducts = await offlineStorage.getItem<Product[]>("products") || [];
        return {
          products: offlineProducts,
          usage: {
            current: offlineProducts.length,
            limit: 1000,
            remaining: 1000 - offlineProducts.length,
          },
        };
      }

      const token = this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(this.baseUrl, {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        if (response.status === 403) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Subscription required");
        }
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      // Save to offline storage
      await offlineStorage.setItem("products", data.products || []);
      console.log("💾 Products saved to offline storage");

      return data;
    } catch (error: any) {
      console.error("❌ Failed to fetch products:", error);

      // Fallback to offline data
      if (error.message.includes("Network") || error.message.includes("fetch")) {
        console.log("📱 Network error, using offline data");
        const offlineProducts = await offlineStorage.getItem<Product[]>("products") || [];
        return {
          products: offlineProducts,
          usage: {
            current: offlineProducts.length,
            limit: 1000,
            remaining: 1000 - offlineProducts.length,
          },
        };
      }

      throw error;
    }
  }

  addProduct = async (productData: ProductFormData): Promise<Product> => {
    try {
      console.log("🔄 Adding product...");

      // Check if online
      if (!navigator.onLine) {
        console.log("📱 Offline mode: Saving product locally");
        const result = await offlineStorage.addItem("products", productData);
        if (!result.success) throw new Error("Failed to save product locally");
        return result.data!;
      }

      const token = this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        if (response.status === 403) {
          throw new Error(errorData.message || "Plan limit reached");
        }
        if (response.status === 400) {
          throw new Error(errorData.message || "Invalid product data");
        }

        throw new Error(errorData.message || `Failed to add product: ${response.status}`);
      }

      const newProduct = await response.json();
      console.log("✅ Product added successfully");

      // Also save to offline storage
      await offlineStorage.addItem("products", newProduct);

      return newProduct;
    } catch (error: any) {
      console.error("❌ Failed to add product:", error);

      // If online but failed, try to save locally
      if (error.message.includes("Network") || error.message.includes("fetch")) {
        console.log("📱 Network error, saving locally");
        const result = await offlineStorage.addItem("products", productData, { syncImmediately: false });
        if (!result.success) throw new Error("Failed to save product locally");
        return result.data!;
      }

      throw error;
    }
  }

  updateProduct = async (productId: string, productData: Partial<ProductFormData>): Promise<Product> => {
    try {
      console.log("🔄 Updating product:", productId);

      // Check if online
      if (!navigator.onLine) {
        console.log("📱 Offline mode: Updating product locally");
        const result = await offlineStorage.updateItem("products", {
          id: productId,
          ...productData,
        });
        if (!result.success) throw new Error("Failed to update product locally");
        return result.data!;
      }

      const token = this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/${productId}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        if (response.status === 403) {
          throw new Error(errorData.message || "Subscription required");
        }

        throw new Error(errorData.message || `Failed to update product: ${response.status}`);
      }

      const updatedProduct = await response.json();
      console.log("✅ Product updated successfully");

      // Update offline storage
      await offlineStorage.updateItem("products", updatedProduct);

      return updatedProduct;
    } catch (error: any) {
      console.error("❌ Failed to update product:", error);

      // If online but failed, try to update locally
      if (error.message.includes("Network") || error.message.includes("fetch")) {
        console.log("📱 Network error, updating locally");
        const result = await offlineStorage.updateItem("products", {
          id: productId,
          ...productData,
        });
        if (!result.success) throw new Error("Failed to update product locally");
        return result.data!;
      }

      throw error;
    }
  }

  deleteProduct = async (productId: string): Promise<void> => {
    try {
      console.log("🔄 Deleting product:", productId);

      // Check if online
      if (!navigator.onLine) {
        console.log("📱 Offline mode: Deleting product locally");
        const result = await offlineStorage.deleteItem("products", productId);
        if (!result.success) throw new Error("Failed to delete product locally");
        return;
      }

      const token = this.getAuthToken();
      const headers: HeadersInit = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/${productId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        if (response.status === 403) {
          throw new Error(errorData.message || "Subscription required");
        }

        throw new Error(errorData.message || `Failed to delete product: ${response.status}`);
      }

      console.log("✅ Product deleted successfully");

      // Delete from offline storage
      await offlineStorage.deleteItem("products", productId);
    } catch (error: any) {
      console.error("❌ Failed to delete product:", error);

      // If online but failed, try to delete locally
      if (error.message.includes("Network") || error.message.includes("fetch")) {
        console.log("📱 Network error, deleting locally");
        const result = await offlineStorage.deleteItem("products", productId);
        if (!result.success) throw new Error("Failed to delete product locally");
        return;
      }

      throw error;
    }
  }

  // Deduct inventory after bill creation
  deductInventory = async (items: Array<{ productId: string; variationId?: string; quantity: number }>): Promise<void> => {
    try {
      console.log("📦 Deducting inventory for items:", items);

      // Get current products
      const { products } = await this.getProducts();

      // Update each product's inventory
      for (const item of items) {
        const product = products.find((p) => p._id === item.productId);
        if (!product) {
          console.warn(`⚠️ Product not found: ${item.productId}`);
          continue;
        }

        if (item.variationId) {
          // Deduct from variation
          const variationIndex = product.variations.findIndex(
            (v) => v._id === item.variationId
          );
          if (variationIndex !== -1) {
            const variation = product.variations[variationIndex];
            if (variation.stock < item.quantity) {
              throw new Error(`Insufficient stock for ${product.name}: ${variation.name}`);
            }
            variation.stock -= item.quantity;

            // Update the product
            await this.updateProduct(product._id, {
              variations: product.variations,
            });

            console.log(`✅ Deducted ${item.quantity} from ${product.name} - ${variation.name}`);
          }
        } else {
          // Deduct from base product (use batches or variations)
          const totalStock =
            product.variations.reduce((sum, v) => sum + v.stock, 0) +
            product.batches.reduce((sum, b) => sum + b.quantity, 0);

          if (totalStock < item.quantity) {
            throw new Error(`Insufficient total stock for ${product.name}`);
          }

          // First try to deduct from batches (FIFO)
          let remainingQty = item.quantity;
          const updatedBatches = [...product.batches];

          for (const batch of updatedBatches) {
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
            const updatedVariations = [...product.variations];
            for (const variation of updatedVariations) {
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

          // Update the product with new stock levels
          await this.updateProduct(product._id, {
            variations: product.variations,
            batches: product.batches,
          });

          console.log(`✅ Deducted ${item.quantity} from ${product.name}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to deduct inventory:", error);
      throw error;
    }
  }

  // Restock inventory (for returns or adjustments)
  restockInventory = async (items: Array<{ productId: string; variationId?: string; quantity: number }>): Promise<void> => {
    try {
      console.log("📦 Restocking inventory for items:", items);

      const { products } = await this.getProducts();

      for (const item of items) {
        const product = products.find((p) => p._id === item.productId);
        if (!product) continue;

        if (item.variationId) {
          const variationIndex = product.variations.findIndex(
            (v) => v._id === item.variationId
          );
          if (variationIndex !== -1) {
            product.variations[variationIndex].stock += item.quantity;
          }
        } else {
          // Add to first variation or create new batch
          if (product.variations.length > 0) {
            product.variations[0].stock += item.quantity;
          } else {
            // Create a new batch for restocking
            const newBatch = {
              batchNumber: `RET-${Date.now()}`,
              quantity: item.quantity,
              costPrice: product.baseCostPrice,
              sellingPrice: product.basePrice,
              mfgDate: new Date(),
              expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
              receivedDate: new Date(),
            };
            product.batches.push(newBatch);
          }
        }

        await this.updateProduct(product._id, {
          variations: product.variations,
          batches: product.batches,
        });

        console.log(`✅ Restocked ${item.quantity} to ${product.name}`);
      }
    } catch (error) {
      console.error("❌ Failed to restock inventory:", error);
      throw error;
    }
  }
}

export const productService = new ProductService();

// Main products hook
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  // Network status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("✅ Back online - syncing data...");
      offlineStorage.processSyncQueue();
      refetch();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("📱 Went offline - using local data");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch products with offline support
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts();
      setProducts(data.products);
      return data;
    } catch (error: any) {
      setError(error.message);
      console.error("❌ Error fetching products:", error);
      return { products: [], usage: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // React Query for data fetching
  const {
    data: queryData,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (queryData?.products) {
      setProducts(queryData.products);
    }
  }, [queryData]);

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: productService.addProduct,
    onSuccess: (newProduct) => {
      // Update local state
      setProducts((prev) => [newProduct, ...prev]);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });

      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      console.error("❌ Failed to add product:", error);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: Partial<ProductFormData> }) =>
      productService.updateProduct(productId, productData),
    onSuccess: (updatedProduct) => {
      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });

      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      console.error("❌ Failed to update product:", error);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, productId) => {
      // Update local state
      setProducts((prev) => prev.filter((p) => p._id !== productId));

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });

      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      console.error("❌ Failed to delete product:", error);
    },
  });

  // Deduct inventory mutation
  const deductInventoryMutation = useMutation({
    mutationFn: productService.deductInventory,
    onSuccess: () => {
      // Refresh products to show updated stock
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("✅ Inventory deducted successfully");
    },
    onError: (error: Error) => {
      console.error("❌ Failed to deduct inventory:", error);
    },
  });

  // Restock inventory mutation
  const restockInventoryMutation = useMutation({
    mutationFn: productService.restockInventory,
    onSuccess: () => {
      // Refresh products to show updated stock
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("✅ Inventory restocked successfully");
    },
    onError: (error: Error) => {
      console.error("❌ Failed to restock inventory:", error);
    },
  });

  // Get low stock products
  const lowStockProducts = products.filter((product) =>
    product.variations.some((v) => v.stock <= 10) ||
    product.batches.some((b) => {
      const expDate = new Date(b.expDate);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return expDate < thirtyDaysFromNow;
    })
  );

  // Get expired products
  const expiredProducts = products.filter((product) =>
    product.batches.some((b) => new Date(b.expDate) < new Date())
  );

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalVariations: products.reduce((sum, p) => sum + p.variations.length, 0),
    totalStock: products.reduce((sum, p) =>
      sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0) +
      p.batches.reduce((bSum, b) => bSum + b.quantity, 0), 0),
    totalValue: products.reduce((sum, p) =>
      sum + p.variations.reduce((vSum, v) => vSum + (v.price * v.stock), 0), 0),
    lowStockCount: lowStockProducts.length,
    expiredCount: expiredProducts.length,
    categories: [...new Set(products.map((p) => p.category))],
  };

  return {
    // State
    products,
    isLoading: isLoading || isRefetching,
    error,
    isOnline,

    // Stats
    lowStockProducts,
    expiredProducts,
    stats,

    // Actions
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    deductInventory: deductInventoryMutation.mutate,
    restockInventory: restockInventoryMutation.mutate,
    refetch,

    // Mutation states
    isAdding: addProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isDeducting: deductInventoryMutation.isPending,
    isRestocking: restockInventoryMutation.isPending,

    // Clear error
    clearError: () => setError(null),

    // Additional data
    usage: queryData?.usage,
    pagination: queryData?.pagination,
  };
};

// Hook for product operations only
export const useProductOperations = () => {
  const queryClient = useQueryClient();

  const addProduct = useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: Partial<ProductFormData> }) =>
      productService.updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    addProduct: addProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isAdding: addProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
};

// Hook for product statistics
export const useProductStats = () => {
  const { products } = useProducts();

  const stats = {
    totalProducts: products.length,
    totalVariations: products.reduce((sum, p) => sum + p.variations.length, 0),
    totalStock: products.reduce((sum, p) =>
      sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0) +
      p.batches.reduce((bSum, b) => bSum + b.quantity, 0), 0),
    totalValue: products.reduce((sum, p) =>
      sum + p.variations.reduce((vSum, v) => vSum + (v.price * v.stock), 0), 0),
    lowStockCount: products.filter((p) =>
      p.variations.some((v) => v.stock <= 10)).length,
    expiredCount: products.filter((p) =>
      p.batches.some((b) => new Date(b.expDate) < new Date())).length,
    categories: [...new Set(products.map((p) => p.category))],
  };

  return stats;
}