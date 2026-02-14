// models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  
  // Basic Info
  name: string;
  description?: string;
  sku: string;
  
  // Category
  category?: string;
  subcategory?: string;
  
  // Pricing
  unitPrice: number;
  costPrice?: number;
  currency: string;
  taxRate: number;
  taxInclusive: boolean;
  
  // Inventory
  quantityOnHand: number;
  quantityAvailable: number;
  quantityOnOrder: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  
  // Stock Keeping
  location?: string;
  bin?: string;
  
  // Product Type
  type: 'service' | 'product' | 'digital';
  isActive: boolean;
  
  // Dimensions & Weight
  weight?: number;
  weightUnit?: 'kg' | 'lb' | 'g';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  
  // Images
  images: Array<{
    url: string;
    isPrimary: boolean;
    alt?: string;
  }>;
  
  // Vendor/Supplier
  vendorId?: mongoose.Types.ObjectId;
  vendorName?: string;
  vendorSku?: string;
  
  // Sales Information
  commissionRate?: number;
  isCommissionable: boolean;
  taxable: boolean;
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  
  // Category
  category: {
    type: String,
    trim: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Pricing
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  taxRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  taxInclusive: {
    type: Boolean,
    default: true
  },
  
  // Inventory
  quantityOnHand: {
    type: Number,
    default: 0,
    min: 0
  },
  quantityAvailable: {
    type: Number,
    default: 0,
    min: 0
  },
  quantityOnOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderLevel: {
    type: Number,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    min: 0
  },
  
  // Stock Keeping
  location: {
    type: String,
    trim: true
  },
  bin: {
    type: String,
    trim: true
  },
  
  // Product Type
  type: {
    type: String,
    enum: ['service', 'product', 'digital'],
    default: 'product',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Dimensions & Weight
  weight: Number,
  weightUnit: {
    type: String,
    enum: ['kg', 'lb', 'g']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in']
    }
  },
  
  // Images
  images: [{
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    alt: String
  }],
  
  // Vendor/Supplier
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    sparse: true
  },
  vendorName: String,
  vendorSku: String,
  
  // Sales Information
  commissionRate: {
    type: Number,
    min: 0,
    max: 100
  },
  isCommissionable: {
    type: Boolean,
    default: false
  },
  taxable: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByName: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedByName: {
    type: String,
    trim: true
  },
  
  // Soft delete
  deletedAt: Date
}, {
  timestamps: true,
  collection: 'products'
});

// 🔐 CRITICAL SECURITY INDEXES
ProductSchema.index({ companyId: 1, sku: 1 }, { unique: true });
ProductSchema.index({ companyId: 1, category: 1, isActive: 1 });
ProductSchema.index({ companyId: 1, type: 1 });
ProductSchema.index({ name: 'text', description: 'text', sku: 'text' });

// Pre-save middleware
ProductSchema.pre('save', function(this: IProduct, next) {
  // Calculate available quantity
  this.quantityAvailable = this.quantityOnHand - (this.quantityOnOrder || 0);
  
  // Ensure primary image exists
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);