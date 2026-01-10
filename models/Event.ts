// models/Event.ts - UPDATED WITH OPTIONAL SUBSCRIPTION FIELDS
import mongoose from "mongoose";

const SubEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    budget: {
      type: Number,
      default: 0,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
  },
  { timestamps: true }
);

const ExpenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    subEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
      default: null,
    },
    receipt: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["marriage", "business", "personal", "travel", "festival", "other"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalBudget: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning",
    },
    subEvents: [SubEventSchema],
    expenses: [ExpenseSchema],
    
    // Optional: Subscription-related metadata (not required, but can be useful)
    metadata: {
      planTier: {
        type: String,
        enum: ["free", "premium", "enterprise"],
        default: "free"
      },
      maxSubEvents: {
        type: Number,
        default: 3 // Free tier limit
      },
      maxExpenses: {
        type: Number,
        default: 50 // Free tier limit
      },
      features: {
        advancedAnalytics: { type: Boolean, default: false },
        exportCapability: { type: Boolean, default: false },
        customCategories: { type: Boolean, default: false }
      }
    }
  },
  { timestamps: true }
);

// Index for better query performance
EventSchema.index({ userId: 1, createdAt: -1 });
EventSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);