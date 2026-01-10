// models/Payment.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: Schema.Types.ObjectId;
  plan: 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  upiTransactionId?: string;
  upiReferenceId?: string;
  paymentGateway: 'upi';
  paymentDetails: {
    upiId: string;
    merchantId: string;
    transactionNote: string;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'pending' },
  upiTransactionId: { type: String },
  upiReferenceId: { type: String },
  paymentGateway: { type: String, default: 'upi' },
  paymentDetails: {
    upiId: { type: String, required: true },
    merchantId: { type: String, required: true },
    transactionNote: { type: String, required: true }
  },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) } // 30 minutes
}, {
  timestamps: true
});

PaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Payment || model<IPayment>('Payment', PaymentSchema);