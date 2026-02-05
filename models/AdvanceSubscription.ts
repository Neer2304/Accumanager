// models/AdvanceSubscription.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IAdvanceSubscription extends Document {
  userId: Schema.Types.ObjectId;
  
  // Subscription details
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

  // Payment history
  paymentHistory: {
    date: Date;
    amount: number;
    transactionId: string;
    method: string;
    status: 'success' | 'failed' | 'pending';
    notes?: string;
  }[];

  // Usage metrics tied to subscription
  usageMetrics: {
    productsCreated: number;
    customersAdded: number;
    invoicesGenerated: number;
    reportsExported: number;
    apiCalls: number;
  };

  // Value metrics
  valueMetrics: {
    estimatedMonthlyValue: number;
    costPerFeature: number;
    roiPercentage: number;
    breakEvenDate?: Date;
  };

  // Analytics data
  analytics: {
    monthlyRevenue: number[];
    customerGrowth: number[];
    usageGrowth: number[];
    churnProbability: number;
    predictedLifetimeValue: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const AdvanceSubscriptionSchema = new Schema<IAdvanceSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  subscription: {
    plan: { type: String, default: 'trial' },
    status: { type: String, default: 'trial' },
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    upiTransactionId: { type: String },
    lastPaymentDate: { type: Date },
    autoRenew: { type: Boolean, default: true },
    features: { type: [String], default: [] }
  },

  paymentHistory: [
    {
      date: { type: Date, default: Date.now },
      amount: { type: Number, required: true },
      transactionId: { type: String, required: true },
      method: { type: String, default: 'upi' },
      status: { type: String, default: 'success' },
      notes: { type: String }
    }
  ],

  usageMetrics: {
    productsCreated: { type: Number, default: 0 },
    customersAdded: { type: Number, default: 0 },
    invoicesGenerated: { type: Number, default: 0 },
    reportsExported: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 }
  },

  valueMetrics: {
    estimatedMonthlyValue: { type: Number, default: 0 },
    costPerFeature: { type: Number, default: 0 },
    roiPercentage: { type: Number, default: 0 },
    breakEvenDate: { type: Date }
  },

  analytics: {
    monthlyRevenue: { type: [Number], default: [] },
    customerGrowth: { type: [Number], default: [] },
    usageGrowth: { type: [Number], default: [] },
    churnProbability: { type: Number, default: 0 },
    predictedLifetimeValue: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
AdvanceSubscriptionSchema.index({ userId: 1 });
AdvanceSubscriptionSchema.index({ 'subscription.status': 1 });
AdvanceSubscriptionSchema.index({ 'subscription.currentPeriodEnd': 1 });

export default models.AdvanceSubscription || model<IAdvanceSubscription>('AdvanceSubscription', AdvanceSubscriptionSchema);