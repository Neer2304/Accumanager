// models/Deal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner
  assignedTo?: mongoose.Types.ObjectId; // Assignee
  
  // Basic Info
  name: string;
  description?: string;
  
  // Links
  accountId?: mongoose.Types.ObjectId;
  accountName?: string;
  contactId?: mongoose.Types.ObjectId;
  contactName?: string;
  leadId?: mongoose.Types.ObjectId;
  
  // Pipeline
  pipelineStage: string;
  pipelineStageId?: mongoose.Types.ObjectId;
  stageChangedAt: Date;
  
  // Value & Probability
  dealValue: number;
  currency: string;
  probability: number;
  expectedRevenue: number;
  
  // Dates
  expectedClosingDate: Date;
  actualClosingDate?: Date;
  wonAt?: Date;
  lostAt?: Date;
  
  // Products
  products: Array<{
    productId?: mongoose.Types.ObjectId;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    tax: number;
    taxRate: number;
    totalPrice: number;
  }>;
  
  // Financial Summary
  financials: {
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    margin?: number;
    marginPercentage?: number;
  };
  
  // Team
  assignedToName?: string;
  teamMembers: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    role: string;
    addedAt: Date;
  }>;
  
  // Loss Reason
  lossReason?: string;
  lostToCompetitor?: string;
  lossDetails?: string;
  
  // Status
  status: 'open' | 'won' | 'lost' | 'abandoned';
  
  // Activity
  lastActivityAt?: Date;
  nextActivityDate?: Date;
  activityCount: number;
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  // Sharing
  sharedWith: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    permissions: {
      read: boolean;
      write: boolean;
    };
    sharedAt: Date;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>({
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: [true, 'User ID is required'],
    index: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    index: true,
    sparse: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: [true, 'Deal name is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Links
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    sparse: true
  },
  accountName: {
    type: String,
    trim: true
  },
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  contactName: {
    type: String,
    trim: true
  },
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    sparse: true
  },
  
  // Pipeline
  pipelineStage: {
    type: String,
    required: [true, 'Pipeline stage is required'],
    index: true
  },
  pipelineStageId: {
    type: Schema.Types.ObjectId,
    ref: 'PipelineStage',
    index: true
  },
  stageChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // Value & Probability
  dealValue: {
    type: Number,
    required: [true, 'Deal value is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  expectedRevenue: {
    type: Number,
    default: 0
  },
  
  // Dates
  expectedClosingDate: {
    type: Date,
    required: [true, 'Expected closing date is required'],
    index: true
  },
  actualClosingDate: Date,
  wonAt: Date,
  lostAt: Date,
  
  // Products
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    discountType: { 
      type: String, 
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    },
    tax: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true }
  }],
  
  // Financial Summary
  financials: {
    subtotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    margin: { type: Number, default: 0 },
    marginPercentage: { type: Number, default: 0 }
  },
  
  // Team
  assignedToName: {
    type: String,
    trim: true
  },
  teamMembers: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    userName: { 
      type: String, 
      required: true,
      trim: true 
    },
    role: { 
      type: String, 
      required: true,
      trim: true 
    },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Loss Reason
  lossReason: {
    type: String,
    trim: true
  },
  lostToCompetitor: {
    type: String,
    trim: true
  },
  lossDetails: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['open', 'won', 'lost', 'abandoned'],
    default: 'open',
    index: true
  },
  
  // Activity
  lastActivityAt: Date,
  nextActivityDate: Date,
  activityCount: {
    type: Number,
    default: 0
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
    ref: 'User', // References your EXISTING User model
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
  
  // Sharing
  sharedWith: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    userName: { 
      type: String, 
      required: true,
      trim: true 
    },
    permissions: {
      read: { type: Boolean, default: true },
      write: { type: Boolean, default: false }
    },
    sharedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  collection: 'deals'
});

// 🔐 CRITICAL SECURITY INDEXES
DealSchema.index({ companyId: 1, userId: 1 });
DealSchema.index({ companyId: 1, assignedTo: 1 });
DealSchema.index({ companyId: 1, pipelineStage: 1, status: 1 });
DealSchema.index({ companyId: 1, expectedClosingDate: 1 });
DealSchema.index({ companyId: 1, accountId: 1 });

// Pre-save middleware
DealSchema.pre('save', function(this: IDeal, next) {
  // Calculate expected revenue
  this.expectedRevenue = (this.dealValue * this.probability) / 100;
  
  // Calculate financial totals
  if (this.products && this.products.length > 0) {
    this.financials.subtotal = this.products.reduce(
      (sum, p) => sum + (p.unitPrice * p.quantity), 
      0
    );
    this.financials.discountTotal = this.products.reduce(
      (sum, p) => sum + p.discount, 
      0
    );
    this.financials.taxTotal = this.products.reduce(
      (sum, p) => sum + p.tax, 
      0
    );
    this.financials.grandTotal = this.products.reduce(
      (sum, p) => sum + p.totalPrice, 
      0
    );
    
    // Calculate margin
    const cost = this.products.reduce((sum, p) => {
      // You would need cost price from product
      return sum + (p.unitPrice * p.quantity * 0.7); // Example: 30% margin
    }, 0);
    
    this.financials.margin = this.financials.grandTotal - cost;
    this.financials.marginPercentage = (this.financials.margin / this.financials.grandTotal) * 100;
  }
  
  // Set stage changed at
  if (this.isModified('pipelineStage')) {
    this.stageChangedAt = new Date();
  }
  
  // Set status based on pipeline stage
  if (this.pipelineStage.toLowerCase().includes('won')) {
    this.status = 'won';
    this.wonAt = this.wonAt || new Date();
    this.actualClosingDate = this.actualClosingDate || new Date();
    this.probability = 100;
  } else if (this.pipelineStage.toLowerCase().includes('lost')) {
    this.status = 'lost';
    this.lostAt = this.lostAt || new Date();
    this.actualClosingDate = this.actualClosingDate || new Date();
    this.probability = 0;
  }
  
  next();
});

export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);