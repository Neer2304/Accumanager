// models/AdvanceScreenTime.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IAdvanceScreenTime extends Document {
  userId: Schema.Types.ObjectId;
  
  // Real-time session tracking
  currentSession: {
    startTime: Date;
    lastActivity: Date;
    currentPage: string;
    idleTimeout?: number;
    deviceInfo: {
      userAgent: string;
      screenResolution: string;
      platform: string;
    };
  };
  
  // Engagement metrics
  engagement: {
    pageViews: number;
    clicks: number;
    formsSubmitted: number;
    exportsGenerated: number;
    reportsViewed: number;
  };
  
  // Focus metrics
  focus: {
    mostUsedFeature: string;
    timeOnDashboard: number;
    timeOnReports: number;
    timeOnSettings: number;
    productivityScore: number;
  };
  
  // Session history
  sessionHistory: {
    sessionId: string;
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    pagesVisited: string[];
    actionsPerformed: string[];
    deviceInfo: {
      userAgent: string;
      screenResolution: string;
      platform: string;
    };
  }[];
  
  // Goals and achievements
  achievements: {
    dailyGoal: number; // hours
    streakDays: number;
    longestSession: number;
    badges: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const AdvanceScreenTimeSchema = new Schema<IAdvanceScreenTime>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  currentSession: {
    startTime: { type: Date },
    lastActivity: { type: Date },
    currentPage: { type: String },
    idleTimeout: { type: Number, default: 900000 }, // 15 minutes in milliseconds
    deviceInfo: {
      userAgent: { type: String },
      screenResolution: { type: String },
      platform: { type: String }
    }
  },
  
  engagement: {
    pageViews: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    formsSubmitted: { type: Number, default: 0 },
    exportsGenerated: { type: Number, default: 0 },
    reportsViewed: { type: Number, default: 0 }
  },
  
  focus: {
    mostUsedFeature: { type: String, default: 'dashboard' },
    timeOnDashboard: { type: Number, default: 0 },
    timeOnReports: { type: Number, default: 0 },
    timeOnSettings: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 }
  },
  
  sessionHistory: [
    {
      sessionId: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      duration: { type: Number, required: true },
      pagesVisited: { type: [String], default: [] },
      actionsPerformed: { type: [String], default: [] },
      deviceInfo: {
        userAgent: String,
        screenResolution: String,
        platform: String
      }
    }
  ],
  
  achievements: {
    dailyGoal: { type: Number, default: 2 }, // 2 hours default goal
    streakDays: { type: Number, default: 0 },
    longestSession: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
  }
}, {
  timestamps: true
});

// Indexes for fast queries
AdvanceScreenTimeSchema.index({ userId: 1 });
AdvanceScreenTimeSchema.index({ 'currentSession.lastActivity': 1 });
AdvanceScreenTimeSchema.index({ 'sessionHistory.startTime': -1 });

export default models.AdvanceScreenTime || model<IAdvanceScreenTime>('AdvanceScreenTime', AdvanceScreenTimeSchema);