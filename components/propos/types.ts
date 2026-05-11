// components/propos/types.ts
export interface BillItem {
  productId: string; variationId?: string; name: string; variationName?: string;
  hsnCode: string; price: number; quantity: number; discount: number;
  taxableAmount: number; cgstAmount: number; sgstAmount: number; igstAmount: number; total: number;
}

export interface Customer {
  _id: string; name: string; phone: string; email?: string; company?: string;
  address?: string; city?: string; state?: string; pincode?: string; gstin?: string;
}

export interface Business {
  businessName: string; gstNumber: string; address: string; city: string; state: string; pincode: string;
}

export interface SearchProduct {
  _id: string; name: string; type: string; displayName: string; price: number;
  variationId?: string; hsnCode: string; gstDetails: any; stock: number; category: string; brand?: string; sku?: string;
}

export const proColors = { primary: '#1a73e8', bgDark: '#202124', bgLight: '#f8f9fa' };