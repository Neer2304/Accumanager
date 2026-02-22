// types/material.ts
export interface Material {
  _id: string;
  userId: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: string;
  
  // Stock management
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  
  // Status
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  
  // Supplier info
  supplierName?: string;
  supplierCode?: string;
  supplierContact?: string;
  leadTime?: number; // in days
  
  // Location
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  
  // Batch tracking
  batchNumber?: string;
  expiryDate?: Date;
  
  // Usage tracking
  totalQuantityAdded: number;
  totalQuantityUsed: number;
  averageMonthlyUsage: number;
  
  // History
  usageHistory: UsageHistoryItem[];
  restockHistory: RestockHistoryItem[];
  
  // Timestamps
  lastRestocked?: Date;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Metadata
  images?: string[];
  documents?: string[];
  notes?: string;
}

export interface UsageHistoryItem {
  _id?: string;
  quantity: number;
  usedBy: string;
  project?: string;
  note?: string;
  usedAt: Date;
  cost: number;
}

export interface RestockHistoryItem {
  _id?: string;
  quantity: number;
  supplier?: string;
  purchaseOrder?: string;
  unitCost: number;
  totalCost: number;
  note?: string;
  restockedAt: Date;
}

export interface MaterialFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  supplier?: string;
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MaterialStats {
  totalMaterials: number;
  totalStockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  categoryDistribution: CategoryStat[];
  statusDistribution: StatusStat[];
  recentActivity: ActivityItem[];
  topUsed: TopMaterial[];
}

export interface CategoryStat {
  category: string;
  count: number;
  value: number;
}

export interface StatusStat {
  status: string;
  count: number;
}

export interface ActivityItem {
  type: 'usage' | 'restock';
  id: string;
  materialId: string;
  materialName: string;
  sku: string;
  quantity: number;
  unit: string;
  date: Date;
  user?: string;
  project?: string;
  supplier?: string;
  cost: number;
  color: string;
  icon: string;
}

export interface TopMaterial {
  id: string;
  name: string;
  sku: string;
  totalUsed: number;
  unit: string;
  value: number;
}

export interface Supplier {
  _id: string;
  name: string;
  code?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive';
  rating?: number;
  paymentTerms?: string;
  leadTime?: number;
  notes?: string;
  materialsSupplied: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  forceRefresh?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}