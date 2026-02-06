// Base Types
export interface User {
  _id: string;
  email: string;
  name: string;
  company?: string;
}

export interface Material {
  _id: string;
  userId: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  unitCost: number;
  totalValue: number;
  minimumStock: number;
  reorderPoint: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pending';
  totalQuantityAdded: number;
  totalQuantityUsed: number;
  averageMonthlyUsage: number;
  lastUsed?: Date;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // History
  usageHistory: UsageRecord[];
  restockHistory: RestockRecord[];
  
  // Relationships
  supplier?: string;
  warehouse?: string;
  location?: string;
  
  // Media
  images?: string[];
  documents?: Document[];
}

export interface UsageRecord {
  _id: string;
  quantity: number;
  usedBy: string;
  project?: string;
  note?: string;
  usedAt: Date;
  cost: number;
}

// Add this to your existing types file

// History Types
export interface HistoryRecord {
  _id: string;
  type: 'usage' | 'restock' | 'transfer' | 'adjustment';
  materialName: string;
  sku: string;
  quantity: number;
  unit: string;
  user?: string;
  supplier?: string;
  project?: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  date: string;
  color: 'error' | 'success' | 'warning' | 'info';
  note?: string;
  cost?: number;
  totalCost?: number;
}

export interface RestockRecord {
  _id: string;
  quantity: number;
  supplier: string;
  unitCost: number;
  totalCost: number;
  note?: string;
  restockedAt: Date;
  purchaseOrder?: string;
}

export interface Document {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Supplier Types
export interface Supplier {
  _id: string;
  userId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms?: string;
  leadTime?: number; // in days
  materialsSupplied: string[]; // Material IDs
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Warehouse Types
export interface Warehouse {
  _id: string;
  userId: string;
  name: string;
  code: string;
  address: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  capacity: number; // total capacity in units
  currentOccupancy: number; // current occupancy in units
  status: 'active' | 'inactive' | 'maintenance';
  temperatureControl?: boolean;
  securityLevel?: 'low' | 'medium' | 'high';
  materials: string[]; // Material IDs stored here
  sections?: WarehouseSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WarehouseSection {
  _id: string;
  name: string;
  code: string;
  capacity: number;
  currentOccupancy: number;
  aisle?: string;
  row?: string;
  shelf?: string;
  bin?: string;
}

// Stats Types
export interface MaterialStats {
  overview: {
    totalMaterials: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    inStockCount: number;
    totalCategories: number;
    totalSuppliers: number;
    totalWarehouses: number;
  };
  categories: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  status: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  mostUsed: Array<{
    id: string;
    name: string;
    sku: string;
    totalUsed: number;
    unit: string;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'usage' | 'restock' | 'transfer' | 'adjustment';
    materialName: string;
    sku: string;
    quantity: number;
    unit: string;
    user?: string;
    supplier?: string;
    project?: string;
    fromWarehouse?: string;
    toWarehouse?: string;
    date: string;
    color: 'error' | 'success' | 'warning' | 'info';
  }>;
  monthlyTrends: {
    labels: string[];
    usage: number[];
    restock: number[];
    value: number[];
  };
  supplierPerformance: Array<{
    id: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    avgLeadTime: number;
    rating: number;
  }>;
  warehouseUtilization: Array<{
    id: string;
    name: string;
    capacity: number;
    occupancy: number;
    utilization: number;
  }>;
}

// Filter Types
export interface MaterialFilters {
  search: string;
  category: string;
  status: string;
  supplier: string;
  warehouse: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  lowStockOnly: boolean;
  outOfStockOnly: boolean;
}

export interface HistoryFilters {
  type: 'all' | 'usage' | 'restock' | 'transfer' | 'adjustment';
  materialId: string;
  userId: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
}

export interface SupplierFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface WarehouseFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Request Types
export interface UseMaterialRequest {
  materialId: string;
  quantity: number;
  usedBy: string;
  project?: string;
  note?: string;
}

export interface RestockMaterialRequest {
  materialId: string;
  quantity: number;
  supplier: string;
  unitCost: number;
  note?: string;
  purchaseOrder?: string;
}

export interface TransferMaterialRequest {
  materialId: string;
  quantity: number;
  fromWarehouse: string;
  toWarehouse: string;
  note?: string;
}

export interface AdjustStockRequest {
  materialId: string;
  adjustmentType: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  note?: string;
}

// Setting Types
export interface UserSettings {
  _id: string;
  userId: string;
  notifications: {
    lowStock: boolean;
    outOfStock: boolean;
    orderConfirmation: boolean;
    deliveryUpdates: boolean;
    weeklyReport: boolean;
    email: string;
    push: boolean;
  };
  units: {
    defaultUnit: string;
    currency: string;
    dateFormat: string;
    timeZone: string;
  };
  inventory: {
    defaultCategory: string;
    autoReorder: boolean;
    reorderMultiplier: number;
    lowStockThreshold: number;
    expiryTracking: boolean;
  };
  integration: {
    enableAPI: boolean;
    apiKey?: string;
    webhookURL?: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackup?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Defaults
export const defaultMaterialFilters: MaterialFilters = {
  search: '',
  category: '',
  status: '',
  supplier: '',
  warehouse: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
  lowStockOnly: false,
  outOfStockOnly: false,
};

export const defaultHistoryFilters: HistoryFilters = {
  type: 'all',
  materialId: '',
  userId: '',
  startDate: '',
  endDate: '',
  page: 1,
  limit: 20,
};

export const defaultSupplierFilters: SupplierFilters = {
  search: '',
  status: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 20,
};

export const defaultWarehouseFilters: WarehouseFilters = {
  search: '',
  status: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 20,
};