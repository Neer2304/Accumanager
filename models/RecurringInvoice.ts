// models/RecurringInvoice.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRecurringInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  customerId: mongoose.Types.ObjectId;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  startDate: Date;
  endDate?: Date;
  nextInvoiceDate: Date;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    discount?: number;
    taxRate?: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  notes?: string;
  status: "active" | "paused" | "completed" | "cancelled";
  totalGenerated: number;
  lastGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringInvoiceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    nextInvoiceDate: {
      type: Date,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        discount: {
          type: Number,
          default: 0,
        },
        taxRate: {
          type: Number,
          default: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: String,
    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },
    totalGenerated: {
      type: Number,
      default: 0,
    },
    lastGeneratedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
RecurringInvoiceSchema.index({ userId: 1, status: 1 });
RecurringInvoiceSchema.index({ nextInvoiceDate: 1 });
RecurringInvoiceSchema.index({ userId: 1, customerId: 1 });

export default mongoose.models.RecurringInvoice ||
  mongoose.model<IRecurringInvoice>("RecurringInvoice", RecurringInvoiceSchema);