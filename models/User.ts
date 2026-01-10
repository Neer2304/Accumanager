// models/User.ts - UPDATED WITH SUBSCRIPTION
import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  shopName?: string;
  isActive: boolean;
  
  // Subscription fields
  subscription: {
    plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
    status: 'active' | 'inactive' | 'expired' | 'trial' | 'cancelled';
    trialEndsAt: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    upiTransactionId?: string;
    lastPaymentDate?: Date;
    autoRenew: boolean;
    features: string[];
  };
  
  // Usage tracking
  usage: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  shopName: { type: String },
  isActive: { type: Boolean, default: true },
  
  subscription: {
    plan: { type: String, default: 'trial' },
    status: { type: String, default: 'trial' },
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }, // 14 days
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    upiTransactionId: { type: String },
    lastPaymentDate: { type: Date },
    autoRenew: { type: Boolean, default: true },
    features: { type: [String], default: [] }
  },
  
  usage: {
    products: { type: Number, default: 0 },
    customers: { type: Number, default: 0 },
    invoices: { type: Number, default: 0 },
    storageMB: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default models.User || model<IUser>('User', UserSchema);