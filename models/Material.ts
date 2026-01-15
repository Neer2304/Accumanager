import { Schema, model, models, Document } from 'mongoose';

export type MaterialStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
export type MaterialCategory = 'raw' | 'packaging' | 'tool' | 'consumable' | 'electronic' | 'mechanical' | 'chemical' | 'other';
export type UnitType = 'pcs' | 'kg' | 'g' | 'lb' | 'oz' | 'l' | 'ml' | 'm' | 'cm' | 'mm' | 'box' | 'pack' | 'roll';

export interface IMaterial extends Document {
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
  leadTime?: number; // in days
  
  // Location tracking
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  
  // Status tracking
  status: MaterialStatus;
  lastRestocked?: Date;
  lastUsed?: Date;
  
  // History tracking
  usageHistory: Array<{
    quantity: number;
    usedBy: string;
    project?: string;
    note?: string;
    usedAt: Date;
    cost: number; // quantity * unitCost
  }>;
  
  restockHistory: Array<{
    quantity: number;
    supplier?: string;
    purchaseOrder?: string;
    unitCost: number;
    totalCost: number;
    note?: string;
    restockedAt: Date;
  }>;
  
  // Analytics
  totalQuantityAdded: number;
  totalQuantityUsed: number;
  averageMonthlyUsage: number;
  reorderPoint: number;
  
  // Alerts
  lowStockAlert: boolean;
  expirationDate?: Date;
  batchNumber?: string;
  
  // Attachments
  images?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  
  // Metadata
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  name: { 
    type: String, 
    required: [true, 'Material name is required'],
    trim: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['raw', 'packaging', 'tool', 'consumable', 'electronic', 'mechanical', 'chemical', 'other'],
    default: 'raw',
    required: true
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'g', 'lb', 'oz', 'l', 'ml', 'm', 'cm', 'mm', 'box', 'pack', 'roll'],
    default: 'pcs',
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  maximumStock: {
    type: Number,
    min: 0
  },
  unitCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  totalValue: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Supplier
  supplierName: String,
  supplierCode: String,
  supplierContact: String,
  leadTime: Number,
  
  // Location
  storageLocation: String,
  shelf: String,
  bin: String,
  
  // Status
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock'
  },
  lastRestocked: Date,
  lastUsed: Date,
  
  // History
  usageHistory: [{
    quantity: { type: Number, required: true, min: 0.01 },
    usedBy: { type: String, required: true },
    project: String,
    note: String,
    usedAt: { type: Date, default: Date.now },
    cost: { type: Number, required: true, min: 0 }
  }],
  
  restockHistory: [{
    quantity: { type: Number, required: true, min: 0.01 },
    supplier: String,
    purchaseOrder: String,
    unitCost: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
    note: String,
    restockedAt: { type: Date, default: Date.now }
  }],
  
  // Analytics
  totalQuantityAdded: {
    type: Number,
    default: 0,
    min: 0
  },
  totalQuantityUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  averageMonthlyUsage: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderPoint: {
    type: Number,
    default: 20,
    min: 0
  },
  
  // Alerts
  lowStockAlert: {
    type: Boolean,
    default: true
  },
  expirationDate: Date,
  batchNumber: String,
  
  // Attachments
  images: [String],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Metadata
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Virtual for available stock
MaterialSchema.virtual('availableStock').get(function() {
  return this.currentStock;
});

// Virtual for stock status color
MaterialSchema.virtual('stockStatus').get(function() {
  if (this.currentStock === 0) return 'error';
  if (this.currentStock <= this.minimumStock) return 'warning';
  return 'success';
});

// Pre-save middleware to update total value and status
MaterialSchema.pre('save', function(next) {
  // Calculate total value
  this.totalValue = this.currentStock * this.unitCost;
  
  // Update status based on stock level
  if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock <= this.minimumStock) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  
  next();
});

// Indexes for better query performance
MaterialSchema.index({ userId: 1, category: 1 });
MaterialSchema.index({ userId: 1, status: 1 });
MaterialSchema.index({ userId: 1, currentStock: 1 });
MaterialSchema.index({ sku: 1 }, { unique: true });
MaterialSchema.index({ name: 'text', description: 'text', sku: 'text' });

export default models.Material || model<IMaterial>('Material', MaterialSchema);