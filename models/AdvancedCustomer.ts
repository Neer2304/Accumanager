// models/AdvancedCustomer.ts
import mongoose from "mongoose";

const FamilyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    relation: {
      type: String,
      required: true,
      enum: ["spouse", "child", "parent", "sibling", "other"],
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    birthday: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true },
);

const CommunicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["call", "email", "meeting", "whatsapp", "sms"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    subject: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    outcome: {
      type: String,
      enum: ["positive", "neutral", "negative", "follow_up"],
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const PreferenceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["product", "service", "communication", "payment", "other"],
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    default: "#3B82F6",
  },
});

const AdvancedCustomerSchema = new mongoose.Schema(
  {
    // Reference to base customer
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },

    // Extended personal information
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    birthday: {
      type: Date,
    },
    anniversary: {
      type: Date,
    },
    occupation: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },

    // Family members
    familyMembers: [FamilyMemberSchema],

    // Preferences and interests
    preferences: [PreferenceSchema],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    // Tags for categorization
    tags: [TagSchema],

    // Communication history
    communications: [CommunicationSchema],

    // Documents and files
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],

    // Notes (rich text support)
    notes: [
      {
        content: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: Date,
        attachments: [
          {
            name: String,
            url: String,
          },
        ],
      },
    ],

    // Social media links
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
      whatsapp: String,
    },

    // Customer value scoring
    customerScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    loyaltyLevel: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },

    // Lifecycle stage
    lifecycleStage: {
      type: String,
      enum: ["lead", "prospect", "customer", "vip", "churned"],
      default: "customer",
    },

    // Next follow-up
    nextFollowUp: {
      date: Date,
      type: String,
      notes: String,
    },

    // Privacy preferences
    privacyPreferences: {
      allowMarketingEmails: {
        type: Boolean,
        default: true,
      },
      allowSMS: {
        type: Boolean,
        default: true,
      },
      allowWhatsApp: {
        type: Boolean,
        default: true,
      },
      allowCalls: {
        type: Boolean,
        default: true,
      },
    },

    // Relationships to other customers
    relationships: [
      {
        relatedCustomerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        relation: {
          type: String,
          enum: [
            "business_partner",
            "colleague",
            "friend",
            "family",
            "referral",
          ],
        },
        notes: String,
      },
    ],

    // Custom fields
    customFields: [
      {
        fieldName: String,
        fieldType: {
          type: String,
          enum: ["text", "number", "date", "boolean", "select"],
        },
        value: mongoose.Schema.Types.Mixed,
        options: [String], // For select fields
      },
    ],

    // Audit trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
AdvancedCustomerSchema.index({ customerId: 1, userId: 1 }, { unique: true });
AdvancedCustomerSchema.index({ userId: 1, lifecycleStage: 1 });
AdvancedCustomerSchema.index({ userId: 1, loyaltyLevel: 1 });
AdvancedCustomerSchema.index({ userId: 1, "tags.name": 1 });
AdvancedCustomerSchema.index({ userId: 1, customerScore: -1 });

// Pre-save middleware
AdvancedCustomerSchema.pre("save", function (next) {
  // Auto-calculate customer score based on various factors
  if (this.isModified("communications") || this.isModified("preferences")) {
    // Simple scoring logic - can be enhanced
    const commScore = Math.min(this.communications.length * 2, 30);
    const prefScore = Math.min(this.preferences.length * 5, 30);
    const tagScore = Math.min(this.tags.length * 3, 20);
    const relationScore = Math.min(this.relationships.length * 4, 20);

    this.customerScore = commScore + prefScore + tagScore + relationScore;

    // Update loyalty level based on score
    if (this.customerScore >= 90) this.loyaltyLevel = "diamond";
    else if (this.customerScore >= 75) this.loyaltyLevel = "platinum";
    else if (this.customerScore >= 60) this.loyaltyLevel = "gold";
    else if (this.customerScore >= 40) this.loyaltyLevel = "silver";
    else this.loyaltyLevel = "bronze";
  }
  next();
});

export default mongoose.models.AdvancedCustomer ||
  mongoose.model("AdvancedCustomer", AdvancedCustomerSchema);
