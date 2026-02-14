// models/PipelineStage.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPipelineStage extends Document {
  // 🔐 Company association
  companyId: mongoose.Types.ObjectId;
  companyName?: string;
  
  // Stage details
  name: string;
  order: number;
  probability: number; // Default probability for deals in this stage
  color?: string;
  
  // Stage category
  category: 'open' | 'won' | 'lost';
  
  // Settings
  isActive: boolean;
  isDefault: boolean;
  
  // Deal tracking
  dealCount?: number;
  totalValue?: number;
  
  // Stage rules
  requiredFields?: string[]; // Fields required to move to this stage
  allowedStages?: string[]; // Stages that can move to this stage
  autoAdvance?: boolean; // Automatically advance deals after X days
  autoAdvanceDays?: number;
  
  // Notifications
  notifyOnEnter?: boolean;
  notifyOnExit?: boolean;
  notifyUsers?: mongoose.Types.ObjectId[]; // Users to notify
  
  // Custom fields for this stage
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }>;
  
  // Who created/updated
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const PipelineStageSchema = new Schema<IPipelineStage>({
  // 🔐 Company association
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  companyName: {
    type: String,
    trim: true
  },
  
  // Stage details
  name: {
    type: String,
    required: [true, 'Stage name is required'],
    trim: true
  },
  order: {
    type: Number,
    required: [true, 'Stage order is required'],
    min: 0
  },
  probability: {
    type: Number,
    required: [true, 'Probability is required'],
    min: 0,
    max: 100,
    default: 0
  },
  color: {
    type: String,
    default: '#4285f4', // Google Blue default
    match: [/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color format']
  },
  
  // Stage category
  category: {
    type: String,
    enum: ['open', 'won', 'lost'],
    default: 'open',
    index: true
  },
  
  // Settings
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Deal tracking (updated via aggregation)
  dealCount: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0
  },
  
  // Stage rules
  requiredFields: [{
    type: String,
    trim: true
  }],
  allowedStages: [{
    type: String,
    trim: true
  }],
  autoAdvance: {
    type: Boolean,
    default: false
  },
  autoAdvanceDays: {
    type: Number,
    min: 0
  },
  
  // Notifications
  notifyOnEnter: {
    type: Boolean,
    default: false
  },
  notifyOnExit: {
    type: Boolean,
    default: false
  },
  notifyUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Custom fields
  customFields: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean', 'select'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      type: String,
      trim: true
    }]
  }],
  
  // Who created/updated
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByName: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedByName: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// 🔐 CRITICAL INDEXES (matching company pattern)
PipelineStageSchema.index({ companyId: 1, order: 1 }, { unique: true });
PipelineStageSchema.index({ companyId: 1, name: 1 }, { unique: true });
PipelineStageSchema.index({ companyId: 1, isActive: 1 });
PipelineStageSchema.index({ companyId: 1, category: 1, isActive: 1 });
PipelineStageSchema.index({ createdBy: 1 });

// Pre-save middleware
PipelineStageSchema.pre('save', function(this: IPipelineStage, next) {
  // Ensure color has # prefix
  if (this.color && !this.color.startsWith('#')) {
    this.color = `#${this.color}`;
  }
  next();
});

export default mongoose.models.PipelineStage || mongoose.model<IPipelineStage>('PipelineStage', PipelineStageSchema);