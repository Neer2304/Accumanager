import mongoose, { Schema, Document } from 'mongoose';

// Interface for Material document
export interface IMaterial extends Document {
  // Basic Information
  name: string;
  sku: string;
  description?: string;
  category: 'raw' | 'packaging' | 'tool' | 'consumable' | 'electronic' | 'mechanical' | 'chemical' | 'other';
  unit: 'pcs' | 'kg' | 'g' | 'lb' | 'oz' | 'l' | 'ml' | 'm' | 'cm' | 'mm' | 'box' | 'pack' | 'roll';
  
  // Stock Information
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost: number;
  totalValue: number;
  
  // Supplier Information
  supplierName?: string;
  supplierCode?: string;
  supplierContact?: string;
  leadTime?: number;
  
  // Location Information
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  
  // Status Information
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  lastRestocked?: Date;
  lastUsed?: Date;
  
  // History
  usageHistory: Array<{
    quantity: number;
    usedBy: string;
    project?: string;
    note?: string;
    usedAt: Date;
    cost: number;
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
  
  // Alerts & Additional Info
  lowStockAlert: boolean;
  expirationDate?: Date;
  batchNumber?: string;
  
  // Attachments
  images: string[];
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;
  
  // Metadata
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['raw', 'packaging', 'tool', 'consumable', 'electronic', 'mechanical', 'chemical', 'other'],
    default: 'other',
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'g', 'lb', 'oz', 'l', 'ml', 'm', 'cm', 'mm', 'box', 'pack', 'roll'],
    default: 'pcs',
  },
  
  // Stock Information
  currentStock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  minimumStock: {
    type: Number,
    required: true,
    min: [0, 'Minimum stock cannot be negative'],
    default: 10,
  },
  maximumStock: {
    type: Number,
    min: [0, 'Maximum stock cannot be negative'],
  },
  unitCost: {
    type: Number,
    required: true,
    min: [0, 'Unit cost cannot be negative'],
    default: 0,
  },
  totalValue: {
    type: Number,
    required: true,
    min: [0, 'Total value cannot be negative'],
    default: 0,
  },
  
  // Supplier Information
  supplierName: String,
  supplierCode: String,
  supplierContact: String,
  leadTime: {
    type: Number,
    min: [0, 'Lead time cannot be negative'],
  },
  
  // Location Information
  storageLocation: String,
  shelf: String,
  bin: String,
  
  // Status Information
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock',
  },
  lastRestocked: Date,
  lastUsed: Date,
  
  // History
  usageHistory: [{
    quantity: {
      type: Number,
      required: true,
      min: [0.01, 'Usage quantity must be positive'],
    },
    usedBy: {
      type: String,
      required: true,
    },
    project: String,
    note: String,
    usedAt: {
      type: Date,
      default: Date.now,
    },
    cost: {
      type: Number,
      required: true,
      min: [0, 'Cost cannot be negative'],
    },
  }],
  
  restockHistory: [{
    quantity: {
      type: Number,
      required: true,
      min: [0.01, 'Restock quantity must be positive'],
    },
    supplier: String,
    purchaseOrder: String,
    unitCost: {
      type: Number,
      required: true,
      min: [0.01, 'Unit cost must be positive'],
    },
    totalCost: {
      type: Number,
      required: true,
      min: [0, 'Total cost cannot be negative'],
    },
    note: String,
    restockedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Analytics
  totalQuantityAdded: {
    type: Number,
    required: true,
    min: [0, 'Total added cannot be negative'],
    default: 0,
  },
  totalQuantityUsed: {
    type: Number,
    required: true,
    min: [0, 'Total used cannot be negative'],
    default: 0,
  },
  averageMonthlyUsage: {
    type: Number,
    required: true,
    min: [0, 'Average usage cannot be negative'],
    default: 0,
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: [0, 'Reorder point cannot be negative'],
    default: 20,
  },
  
  // Alerts & Additional Info
  lowStockAlert: {
    type: Boolean,
    default: true,
  },
  expirationDate: Date,
  batchNumber: String,
  
  // Attachments
  images: [{
    type: String,
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Metadata
  userId: {
    type: String,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
  // Transform ObjectId to string when converting to JSON
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

// Indexes for better query performance
MaterialSchema.index({ userId: 1, sku: 1 }, { unique: true });
MaterialSchema.index({ userId: 1, status: 1 });
MaterialSchema.index({ userId: 1, category: 1 });
MaterialSchema.index({ userId: 1, currentStock: 1 });
MaterialSchema.index({ userId: 1, 'restockHistory.restockedAt': -1 });
MaterialSchema.index({ userId: 1, 'usageHistory.usedAt': -1 });

// Pre-save middleware to calculate totalValue and update status
MaterialSchema.pre('save', function(next) {
  this.totalValue = this.currentStock * this.unitCost;
  
  // Update status based on stock
  if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock <= this.minimumStock) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  
  next();
});

const Material = mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);

export default Material;