// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Creator
  
  // Order Identification
  orderNumber: string;
  orderDate: Date;
  
  // Customer
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Related CRM Entities
  accountId?: mongoose.Types.ObjectId;
  dealId?: mongoose.Types.ObjectId;
  contactId?: mongoose.Types.ObjectId;
  
  // Addresses
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  sameAsBilling: boolean;
  
  // Order Items
  items: Array<{
    productId?: mongoose.Types.ObjectId;
    productName: string;
    sku?: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    tax: number;
    taxRate: number;
    total: number;
  }>;
  
  // Financials
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  shippingMethod?: string;
  handlingFee: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  currency: string;
  exchangeRate: number;
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed' | 'cancelled';
  paymentMethod?: string;
  paymentDetails: Array<{
    transactionId: string;
    gateway: string;
    amount: number;
    paidAt: Date;
    refundAmount?: number;
    refundReason?: string;
    status: string;
  }>;
  
  // Order Status
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  statusHistory: Array<{
    status: string;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    changedByName: string;
    note?: string;
  }>;
  
  // Shipping & Delivery
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  shippingNotes?: string;
  
  // Returns
  isReturned: boolean;
  returnDate?: Date;
  returnReason?: string;
  returnStatus?: 'requested' | 'approved' | 'rejected' | 'completed';
  
  // Discounts & Promotions
  coupons: Array<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  }>;
  
  // Metadata
  notes?: string;
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

const OrderSchema = new Schema<IOrder>({
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
  
  // Order Identification
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    trim: true,
    index: true
  },
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Customer
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Customer ID is required'],
    index: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  
  // Related CRM Entities
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    sparse: true
  },
  dealId: {
    type: Schema.Types.ObjectId,
    ref: 'Deal',
    sparse: true
  },
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    sparse: true
  },
  
  // Addresses
  billingAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'USA' },
    zipCode: { type: String, required: true, trim: true }
  },
  shippingAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'USA' },
    zipCode: { type: String, required: true, trim: true }
  },
  sameAsBilling: {
    type: Boolean,
    default: false
  },
  
  // Order Items
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { 
      type: String, 
      required: true,
      trim: true 
    },
    sku: { 
      type: String,
      trim: true 
    },
    description: { 
      type: String,
      trim: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    unitPrice: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    discount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    discountType: { 
      type: String, 
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    },
    tax: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    taxRate: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    total: { 
      type: Number, 
      required: true 
    }
  }],
  
  // Financials
  subtotal: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  discountTotal: { 
    type: Number, 
    default: 0 
  },
  taxTotal: { 
    type: Number, 
    default: 0 
  },
  shippingCost: { 
    type: Number, 
    default: 0 
  },
  shippingMethod: String,
  handlingFee: { 
    type: Number, 
    default: 0 
  },
  grandTotal: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  paidAmount: { 
    type: Number, 
    default: 0 
  },
  dueAmount: { 
    type: Number, 
    default: 0 
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  exchangeRate: { 
    type: Number, 
    default: 1 
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: String,
  paymentDetails: [{
    transactionId: { type: String, required: true },
    gateway: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    refundAmount: Number,
    refundReason: String,
    status: { type: String, required: true }
  }],
  
  // Order Status
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'draft',
    index: true
  },
  statusHistory: [{
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    changedByName: { 
      type: String, 
      required: true,
      trim: true 
    },
    note: String
  }],
  
  // Shipping & Delivery
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  shippingNotes: String,
  
  // Returns
  isReturned: { 
    type: Boolean, 
    default: false 
  },
  returnDate: Date,
  returnReason: String,
  returnStatus: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'completed']
  },
  
  // Discounts & Promotions
  coupons: [{
    code: { 
      type: String, 
      required: true,
      trim: true 
    },
    discount: { 
      type: Number, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['percentage', 'fixed'],
      required: true 
    }
  }],
  
  // Metadata
  notes: String,
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
  collection: 'orders'
});

// 🔐 CRITICAL SECURITY INDEXES
OrderSchema.index({ companyId: 1, userId: 1 });
OrderSchema.index({ companyId: 1, orderNumber: 1 }, { unique: true });
OrderSchema.index({ companyId: 1, customerId: 1 });
OrderSchema.index({ companyId: 1, status: 1, paymentStatus: 1 });
OrderSchema.index({ companyId: 1, orderDate: -1 });

// Pre-save middleware
OrderSchema.pre('save', async function(this: IOrder, next) {
  // Generate order number if not provided
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments({ companyId: this.companyId });
    this.orderNumber = `ORD-${(count + 1).toString().padStart(6, '0')}`;
  }
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  this.discountTotal = this.items.reduce((sum, item) => sum + item.discount, 0);
  this.taxTotal = this.items.reduce((sum, item) => sum + item.tax, 0);
  this.grandTotal = this.subtotal - this.discountTotal + this.taxTotal + this.shippingCost + this.handlingFee;
  this.dueAmount = this.grandTotal - this.paidAmount;
  
  // Copy billing to shipping if sameAsBilling
  if (this.sameAsBilling) {
    this.shippingAddress = { ...this.billingAddress };
  }
  
  // Add to status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: this.updatedBy || this.createdBy,
      changedByName: this.updatedByName || this.createdByName
    });
  }
  
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);