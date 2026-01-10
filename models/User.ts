// models/User.ts - ENHANCED WITH SCREEN TIME
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
  
  // Screen Time Tracking
  screenTime: {
    totalHours: number;
    lastActive: Date;
    dailyStats: {
      date: string;
      hours: number;
      sessions: number;
    }[];
    hourlyDistribution: {
      hour: number;
      hours: number;
    }[];
    weeklyAverage: number;
    last7Days: number[];
    // Additional metrics
    peakHour: number;
    avgSessionLength: number;
    lastSessionDuration: number;
  };
  
  // Activity Logs (optional)
  activityLogs: {
    timestamp: Date;
    page: string;
    duration: number;
    action?: string;
  }[];
  
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
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
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
  },
  
  // Enhanced Screen Time Tracking
  screenTime: {
    totalHours: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    dailyStats: [
      {
        date: String,
        hours: { type: Number, default: 0 },
        sessions: { type: Number, default: 0 }
      }
    ],
    hourlyDistribution: [
      {
        hour: Number,
        hours: { type: Number, default: 0 }
      }
    ],
    weeklyAverage: { type: Number, default: 0 },
    last7Days: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    peakHour: { type: Number, default: 0 },
    avgSessionLength: { type: Number, default: 0 },
    lastSessionDuration: { type: Number, default: 0 }
  },
  
  // Activity Logs for detailed tracking
  activityLogs: [
    {
      timestamp: { type: Date, default: Date.now },
      page: String,
      duration: Number, // in minutes
      action: String
    }
  ]
}, {
  timestamps: true
});

// Index for faster queries on screen time
UserSchema.index({ 'screenTime.lastActive': -1 });
UserSchema.index({ 'screenTime.dailyStats.date': 1 });

export default models.User || model<IUser>('User', UserSchema);