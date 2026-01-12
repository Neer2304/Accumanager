// models/Subscription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: string;
  status: 'active' | 'inactive' | 'trial' | 'expired' | 'canceled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date;
  features: string[];
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise', 'trial'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'trial', 'expired', 'canceled'],
    default: 'inactive'
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  trialEndsAt: Date,
  features: [String],
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'quarterly'],
    default: 'monthly'
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });
SubscriptionSchema.index({ plan: 1, status: 1 });

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);