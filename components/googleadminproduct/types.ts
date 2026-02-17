// components/googleadminproduct/types.ts
export interface Product {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  baseCostPrice: number;
  category: string;
  subCategory?: string;
  brand?: string;
  sku?: string;
  isActive: boolean;
  isReturnable: boolean;
  variations?: ProductVariation[];
  batches?: ProductBatch[];
  gstDetails?: GSTDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  name: string;
  sku?: string;
  price: number;
  costPrice: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface ProductBatch {
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  mfgDate?: string;
  expDate?: string;
  receivedDate?: string;
  supplier?: string;
}

export interface GSTDetails {
  type: 'cgst_sgst' | 'igst';
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  taxPreference?: 'inclusive' | 'exclusive';
}

export interface StockStatus {
  color: string;
  label: string;
}

export interface ProductHeaderProps {
  product: Product | null;
  onBack: () => void;
  onRefresh: () => void;
  onEdit: () => void;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export interface ProductStatsProps {
  product: Product | null;
  darkMode?: boolean;
  calculateTotalStock: (product: Product) => number;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => StockStatus;
}

export interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  product: Product | null;
  darkMode?: boolean;
}

export interface ProductOverviewProps {
  product: Product | null;
  darkMode?: boolean;
  isMobile?: boolean;
  calculateTotalStock: (product: Product) => number;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => StockStatus;
}

export interface ProductVariationsProps {
  variations?: ProductVariation[];
  darkMode?: boolean;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => StockStatus;
}

export interface ProductBatchesProps {
  batches?: ProductBatch[];
  darkMode?: boolean;
  formatCurrency: (amount: number) => string;
}

export interface ProductGSTProps {
  gstDetails?: GSTDetails;
  darkMode?: boolean;
  formatCurrency: (amount: number) => string;
}

export interface ProductActionsProps {
  onPrint: () => void;
  onExport: () => void;
  onShare: () => void;
  darkMode?: boolean;
  isMobile?: boolean;
}