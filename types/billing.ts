// Product types
export interface ProductGstDetails {
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  utgstRate: number;
  type: "cgst_sgst" | "igst" | "utgst";
}

export interface ProductVariation {
  _id?: string;
  id?: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  costPrice: number;
  stock: number;
  sku?: string;
}

export interface ProductBatch {
  _id?: string;
  id?: string;
  batchNumber: string;
  quantity: number;
  expiryDate?: string;
  manufacturingDate?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  basePrice: number;
  costPrice: number;
  gstDetails: ProductGstDetails;
  variations?: ProductVariation[];
  batches?: ProductBatch[];
  tags?: string[];
  isActive?: boolean;
  stock?: number;
}

// Customer types
export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Billing types
export interface BillItem {
  productId: string;
  variationId?: string;
  name: string;
  variationName?: string;
  hsnCode: string;
  price: number;
  quantity: number;
  discount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
  stockAvailable?: number;
}

export interface BillCustomer {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state: string;
  pincode?: string;
  gstin?: string;
  isInterState: boolean;
}

export interface Business {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface OfflineBill {
  _id: string;
  localId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: BillCustomer;
  items: BillItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string;
  userId?: string;
  isLocal?: boolean;
  isSynced?: boolean;
  syncAttempts?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchProduct {
  _id: string;
  name: string;
  type: string;
  displayName: string;
  price: number;
  variationId?: string;
  hsnCode: string;
  gstDetails: ProductGstDetails;
  stock: number;
  category: string;
  brand?: string;
  sku?: string;
  size?: string;
  color?: string;
  material?: string;
  costPrice?: number;
}

// Make size, color, material optional in SearchProduct
export type SearchProductOptional = Omit<SearchProduct, 'size' | 'color' | 'material'> & {
  size?: string;
  color?: string;
  material?: string;
};

// Subscription types
export interface Subscription {
  _id?: string;
  id?: string;
  userId: string;
  plan: string;
  isActive: boolean;
  status: string;
  startDate: string;
  endDate: string;
  limits?: {
    invoices?: number;
    products?: number;
    customers?: number;
    users?: number;
  };
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Usage {
  invoices?: number;
  products?: number;
  customers?: number;
  users?: number;
  period?: {
    start: string;
    end: string;
  };
}