// models/Order.ts
import { Schema, model, models, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  variationId?: string;
  batchId?: string;
  name: string;
  variationName?: string;
  hsnCode: string;
  price: number;
  quantity: number;
  discount: number;
  taxableAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
  stockDeducted: boolean;
}

export interface ICustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  state?: string;
  isInterState: boolean;
}

export interface IOrder extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  customer: ICustomer;
  items: IOrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  grandTotal: number;
  paymentMethod: "cash" | "card" | "upi" | "credit" | "multiple";
  paymentStatus: "pending" | "paid" | "cancelled" | "refunded";
  status: "draft" | "confirmed" | "cancelled";
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variationId: { type: Schema.Types.ObjectId },
  batchId: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  variationName: String,
  hsnCode: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  cgstRate: { type: Number, required: true },
  sgstRate: { type: Number, required: true },
  igstRate: { type: Number, required: true },
  cgstAmount: { type: Number, required: true },
  sgstAmount: { type: Number, required: true },
  igstAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  stockDeducted: { type: Boolean, default: false },
});

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: String,
  gstin: String,
  state: String,
  isInterState: { type: Boolean, default: false },
});

const OrderSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    customer: CustomerSchema,
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    totalTaxableAmount: { type: Number, required: true },
    totalCgst: { type: Number, required: true },
    totalSgst: { type: Number, required: true },
    totalIgst: { type: Number, required: true },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "credit", "multiple"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    metadata: {
      recurringInvoiceId: {
        type: Schema.Types.ObjectId,
        ref: "RecurringInvoice",
      },
      isRecurring: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["draft", "confirmed", "cancelled"],
      default: "draft",
    },
    notes: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export default models.Order || model<IOrder>("Order", OrderSchema);
