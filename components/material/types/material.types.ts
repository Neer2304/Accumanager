export type MaterialStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
export type MaterialCategory = 'raw' | 'packaging' | 'tool' | 'consumable' | 'electronic' | 'mechanical' | 'chemical' | 'other';
export type UnitType = 'pcs' | 'kg' | 'g' | 'lb' | 'oz' | 'l' | 'ml' | 'm' | 'cm' | 'mm' | 'box' | 'pack' | 'roll';

export interface Material {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  category: MaterialCategory;
  unit: UnitType;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost: number;
  totalValue: number;
  
  // Supplier information
  supplierName?: string;
  supplierCode?: string;
  supplierContact?: string;
  leadTime?: number;
  
  // Location tracking
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  
  // Status tracking
  status: MaterialStatus;
  lastRestocked?: Date | string;
  lastUsed?: Date | string;
  
  // History tracking
  usageHistory: Array<{
    quantity: number;
    usedBy: string;
    project?: string;
    note?: string;
    usedAt: Date | string;
    cost: number;
  }>;
  
  restockHistory: Array<{
    quantity: number;
    supplier?: string;
    purchaseOrder?: string;
    unitCost: number;
    totalCost: number;
    note?: string;
    restockedAt: Date | string;
  }>;
  
  // Analytics
  totalQuantityAdded: number;
  totalQuantityUsed: number;
  averageMonthlyUsage: number;
  reorderPoint: number;
  
  // Alerts
  lowStockAlert: boolean;
  expirationDate?: Date | string;
  batchNumber?: string;
  
  // Attachments
  images?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  
  // Metadata
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: number;
}

export interface MaterialFilters {
  search: string;
  category: string;
  status: string;
  sortBy: 'name' | 'sku' | 'currentStock' | 'unitCost' | 'updatedAt' | 'category';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  lowStockOnly?: boolean;
  outOfStockOnly?: boolean;
}

export interface MaterialFormData {
  name: string;
  sku: string;
  description: string;
  category: MaterialCategory;
  unit: UnitType;
  currentStock?: number; // Changed from initialStock
  minimumStock: number;
  maximumStock?: number;
  unitCost: number;
  supplierName?: string;
  supplierCode?: string;
  supplierContact?: string;
  leadTime?: number;
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  lowStockAlert: boolean;
  expirationDate?: string;
  batchNumber?: string;
  // Add these fields to match your MongoDB schema
  totalValue?: number;
  totalQuantityAdded?: number;
  totalQuantityUsed?: number;
  averageMonthlyUsage?: number;
  reorderPoint?: number;
}

export interface UseMaterialRequest {
  materialId: string;
  quantity: number;
  usedBy: string; // Add this
  project?: string;
  note?: string;
}

export interface RestockMaterialRequest {
  materialId: string;
  quantity: number;
  supplier?: string;
  purchaseOrder?: string;
  unitCost?: number;
  note?: string;
}

export interface MaterialStats {
  overview: {
    totalMaterials: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    inStockCount: number;
  };
  categories: Array<{ category: string; count: number }>;
  status: Array<{ status: string; count: number }>;
  mostUsed: Array<{
    id: string;
    name: string;
    sku: string;
    totalUsed: number;
    unit: string;
  }>;
  recentActivity: Array<{
    type: 'usage' | 'restock';
    materialName: string;
    sku: string;
    quantity: number;
    unit: string;
    user?: string;
    project?: string;
    supplier?: string;
    cost?: number;
    date: string;
    color: 'error' | 'success' | 'warning' | 'info';
  }>;
}

export interface PaginatedMaterials {
  materials: Material[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    lowStockCount: number;
    outOfStockCount: number;
    totalCount: number;
  };
}

// Default values
export const defaultMaterialFilters: MaterialFilters = {
  search: '',
  category: '',
  status: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

export const defaultMaterialFormData: MaterialFormData = {
  name: '',
  sku: '',
  description: '',
  category: 'raw',
  unit: 'pcs',
  minimumStock: 10,
  unitCost: 0,
  lowStockAlert: true,
  // Initialize calculated fields
  totalValue: 0,
  totalQuantityAdded: 0,
  totalQuantityUsed: 0,
  averageMonthlyUsage: 0,
  reorderPoint: 20,
};

// Categories with labels and colors
export const MATERIAL_CATEGORIES = [
  { value: 'raw', label: 'Raw Material', color: '#3b82f6' },
  { value: 'packaging', label: 'Packaging', color: '#8b5cf6' },
  { value: 'tool', label: 'Tool', color: '#10b981' },
  { value: 'consumable', label: 'Consumable', color: '#f59e0b' },
  { value: 'electronic', label: 'Electronic', color: '#6366f1' },
  { value: 'mechanical', label: 'Mechanical', color: '#ef4444' },
  { value: 'chemical', label: 'Chemical', color: '#ec4899' },
  { value: 'other', label: 'Other', color: '#6b7280' },
];

// Units with labels
export const MATERIAL_UNITS = [
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'g', label: 'Grams' },
  { value: 'lb', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' },
  { value: 'l', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'm', label: 'Meters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'mm', label: 'Millimeters' },
  { value: 'box', label: 'Boxes' },
  { value: 'pack', label: 'Packs' },
  { value: 'roll', label: 'Rolls' },
];

// Utility functions
export const getStatusColor = (status: MaterialStatus): string => {
  const colors = {
    'in-stock': '#10b981',
    'low-stock': '#f59e0b',
    'out-of-stock': '#ef4444',
    'discontinued': '#6b7280',
  };
  return colors[status];
};

export const getStatusLabel = (status: MaterialStatus): string => {
  const labels = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
    'discontinued': 'Discontinued',
  };
  return labels[status];
};

export const getCategoryColor = (category: MaterialCategory): string => {
  const categoryObj = MATERIAL_CATEGORIES.find(c => c.value === category);
  return categoryObj?.color || '#6b7280';
};

export const getCategoryLabel = (category: MaterialCategory): string => {
  const categoryObj = MATERIAL_CATEGORIES.find(c => c.value === category);
  return categoryObj?.label || 'Other';
};

export const getUnitLabel = (unit: UnitType): string => {
  const unitObj = MATERIAL_UNITS.find(u => u.value === unit);
  return unitObj?.label || unit;
};

// Calculate status based on stock levels
export const calculateMaterialStatus = (
  currentStock: number,
  minimumStock: number,
  maximumStock?: number
): MaterialStatus => {
  if (currentStock === 0) return 'out-of-stock';
  if (currentStock <= minimumStock) return 'low-stock';
  if (maximumStock && currentStock >= maximumStock * 0.9) return 'in-stock'; // Consider 90% as full
  return 'in-stock';
};

// Calculate total value
export const calculateTotalValue = (currentStock: number, unitCost: number): number => {
  return currentStock * unitCost;
};

// Validation
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateMaterial = (material: Partial<MaterialFormData>): ValidationResult => {
  const errors: string[] = [];

  if (!material.name?.trim()) {
    errors.push('Material name is required');
  }

  if (!material.sku?.trim()) {
    errors.push('SKU is required');
  } else if (material.sku.length > 50) {
    errors.push('SKU must be less than 50 characters');
  }

  if (material.currentStock !== undefined && material.currentStock < 0) {
    errors.push('Current stock cannot be negative');
  }

  if (material.minimumStock !== undefined && material.minimumStock < 0) {
    errors.push('Minimum stock cannot be negative');
  }

  if (material.unitCost !== undefined && material.unitCost < 0) {
    errors.push('Unit cost cannot be negative');
  }

  if (material.maximumStock !== undefined && material.maximumStock < 0) {
    errors.push('Maximum stock cannot be negative');
  }

  if (material.maximumStock !== undefined && 
      material.minimumStock !== undefined && 
      material.maximumStock <= material.minimumStock) {
    errors.push('Maximum stock must be greater than minimum stock');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Transform form data to match MongoDB schema
export const transformMaterialFormData = (formData: MaterialFormData): any => {
  const currentStock = formData.currentStock || 0;
  const unitCost = formData.unitCost || 0;
  
  return {
    ...formData,
    currentStock,
    totalValue: calculateTotalValue(currentStock, unitCost),
    totalQuantityAdded: currentStock, // Initial stock counts as added
    totalQuantityUsed: 0,
    averageMonthlyUsage: 0,
    reorderPoint: formData.reorderPoint || formData.minimumStock * 2, // Default reorder point
    status: calculateMaterialStatus(currentStock, formData.minimumStock, formData.maximumStock),
    usageHistory: [],
    restockHistory: [],
    images: [],
    documents: [],
    __v: 0,
  };
};