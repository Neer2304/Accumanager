// components/googleadminproductid/components/types.ts
export interface Variation {
  name: string;
  sku?: string;
  price: number;
  costPrice?: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface Batch {
  batchNumber: string;
  quantity: number;
  costPrice?: number;
  sellingPrice?: number;
  mfgDate?: string;
  expDate?: string;
  receivedDate?: string;
}

export interface GSTDetails {
  type?: 'intra_state' | 'inter_state';
  hsnCode?: string;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  sku?: string;
  basePrice: number;
  baseCostPrice?: number;
  isActive: boolean;
  isReturnable?: boolean;
  variations?: Variation[];
  batches?: Batch[];
  gstDetails?: GSTDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockStatus {
  color: string;
  label: string;
}