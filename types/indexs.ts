// types/index.ts
export interface Product {
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
    mfgDate: Date | string;
    expDate: Date | string;
    receivedDate: Date | string;
  }>;
  tags: string[];
  isReturnable: boolean;
  returnPeriod: number;
  userId: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}