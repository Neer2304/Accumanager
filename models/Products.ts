// models/Product.ts
import mongoose from 'mongoose';

// ─── Variation Types ─────────────────────────────────────────────────────────
interface VariationOption {
  name: string;
  value: string;
  price?: number;
  sku?: string;
  quantity: number;
  image?: string;
}

interface Variation {
  name: string;
  options: VariationOption[];
}

interface InventoryItem {
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order' | 'discontinued';
  warehouseLocation?: string;
  shelfNumber?: string;
}

interface Pricing {
  mrp: number;
  sellingPrice: number;
  costPrice?: number;
  wholesalePrice?: number;
  gstRate: number;
  hsnCode?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: Date;
    endDate?: Date;
  };
}

interface Manufacturing {
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturedDate?: Date;
  expiryDate?: Date;
  batchNumber?: string;
  bestBefore?: Date;
  countryOfOrigin?: string;
}

interface Dimensions {
  weight?: number;
  weightUnit?: 'g' | 'kg' | 'lb';
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'cm' | 'in';
}

export interface IProduct extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: {
    url: string;
    publicId: string;
    alt: string;
    isPrimary: boolean;
  }[];
  
  // Variations
  hasVariations: boolean;
  variations: Variation[];
  
  // Inventory
  inventory: InventoryItem;
  
  // Pricing
  pricing: Pricing;
  
  // Manufacturing details
  manufacturing: Manufacturing;
  
  // Categorization
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  tags: string[];
  
  // Physical attributes
  dimensions?: Dimensions;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  visibility: 'visible' | 'hidden';
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  
  // Sales tracking
  sales?: {
    totalSold: number;
    revenue: number;
    views: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    
    // Variations
    hasVariations: { type: Boolean, default: false },
    variations: [
      {
        name: { type: String, required: true },
        options: [
          {
            name: { type: String, required: true },
            value: { type: String, required: true },
            price: { type: Number },
            sku: { type: String },
            quantity: { type: Number, default: 0 },
            image: { type: String },
          },
        ],
      },
    ],
    
    // Inventory
    inventory: {
      quantity: { type: Number, default: 0 },
      reservedQuantity: { type: Number, default: 0 },
      availableQuantity: { type: Number, default: 0 },
      lowStockThreshold: { type: Number, default: 5 },
      trackInventory: { type: Boolean, default: true },
      allowBackorder: { type: Boolean, default: false },
      stockStatus: {
        type: String,
        enum: ['in_stock', 'low_stock', 'out_of_stock', 'pre_order', 'discontinued'],
        default: 'in_stock',
      },
      warehouseLocation: { type: String },
      shelfNumber: { type: String },
    },
    
    // Pricing
    pricing: {
      mrp: { type: Number, required: true, default: 0 },
      sellingPrice: { type: Number, required: true, default: 0 },
      costPrice: { type: Number, default: 0 },
      wholesalePrice: { type: Number, default: 0 },
      gstRate: { type: Number, enum: [0, 5, 12, 18, 28], default: 18 },
      hsnCode: { type: String, default: '' },
      discount: {
        type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
        value: { type: Number, default: 0 },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    },
    
    // Manufacturing details
    manufacturing: {
      manufacturerName: { type: String },
      manufacturerAddress: { type: String },
      manufacturedDate: { type: Date },
      expiryDate: { type: Date },
      batchNumber: { type: String },
      bestBefore: { type: Date },
      countryOfOrigin: { type: String },
    },
    
    // Categorization
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    tags: [{ type: String, trim: true }],
    
    // Physical attributes
    dimensions: {
      weight: { type: Number },
      weightUnit: { type: String, enum: ['g', 'kg', 'lb'] },
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      dimensionUnit: { type: String, enum: ['cm', 'in'] },
    },
    
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
    },
    
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    
    sales: {
      totalSold: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'pricing.sellingPrice': 1 });
productSchema.index({ status: 1, visibility: 1 });
productSchema.index({ 'inventory.stockStatus': 1 });
productSchema.index({ userId: 1, createdAt: -1 });
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'manufacturing.expiryDate': 1 });
productSchema.index({ 'manufacturing.manufacturedDate': 1 });

// Pre-save middleware
productSchema.pre('save', function (this: IProduct, next) {
  // Generate slug from name
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  
  // Calculate available quantity
  const quantity = this.inventory?.quantity ?? 0;
  const reserved = this.inventory?.reservedQuantity ?? 0;
  this.inventory.availableQuantity = quantity - reserved;
  
  // Update stock status based on quantity
  const currentQty = this.inventory?.quantity ?? 0;
  if (currentQty <= 0) {
    this.inventory.stockStatus = 'out_of_stock';
  } else if (currentQty <= (this.inventory?.lowStockThreshold ?? 5)) {
    this.inventory.stockStatus = 'low_stock';
  } else if (this.inventory.stockStatus === 'out_of_stock' && currentQty > 0) {
    this.inventory.stockStatus = 'in_stock';
  }
  
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function (this: IProduct) {
  const mrp = this.pricing?.mrp ?? 0;
  const sellingPrice = this.pricing?.sellingPrice ?? 0;
  if (mrp > 0 && sellingPrice > 0 && sellingPrice < mrp) {
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  }
  return 0;
});

// Virtual for isExpired
productSchema.virtual('isExpired').get(function (this: IProduct) {
  const expiryDate = this.manufacturing?.expiryDate;
  if (expiryDate) {
    return new Date() > new Date(expiryDate);
  }
  return false;
});

// Virtual for daysUntilExpiry
productSchema.virtual('daysUntilExpiry').get(function (this: IProduct) {
  const expiryDate = this.manufacturing?.expiryDate;
  if (expiryDate) {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

const Product = (mongoose.models.Product as mongoose.Model<IProduct>) || 
  mongoose.model<IProduct>('Product', productSchema);

export default Product;