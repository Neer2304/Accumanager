import mongoose from 'mongoose'

const MarketingCampaignSchema = new mongoose.Schema({
  // Reference to user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Campaign details
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  type: {
    type: String,
    enum: ['email', 'sms', 'push'],
    default: 'email',
    required: true
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft',
    required: true
  },
  
  // Target segment
  segment: {
    type: String,
    required: true,
    default: 'all_customers'
  },
  
  // Content
  template: {
    type: String,
    default: 'default'
  },
  
  subject: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  content: {
    type: String,
    trim: true
  },
  
  // Performance metrics
  recipients: {
    type: Number,
    default: 0,
    min: 0
  },
  
  sent: {
    type: Number,
    default: 0,
    min: 0
  },
  
  delivered: {
    type: Number,
    default: 0,
    min: 0
  },
  
  opened: {
    type: Number,
    default: 0,
    min: 0
  },
  
  clicked: {
    type: Number,
    default: 0,
    min: 0
  },
  
  converted: {
    type: Number,
    default: 0,
    min: 0
  },
  
  revenue: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: null
  },
  
  sentAt: {
    type: Date,
    default: null
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better query performance
MarketingCampaignSchema.index({ userId: 1, status: 1 })
MarketingCampaignSchema.index({ userId: 1, createdAt: -1 })
MarketingCampaignSchema.index({ userId: 1, type: 1 })
MarketingCampaignSchema.index({ scheduledFor: 1, status: 1 })
MarketingCampaignSchema.index({ status: 1, sentAt: 1 })

// Virtual for calculated metrics
MarketingCampaignSchema.virtual('openRate').get(function() {
  return this.sent > 0 ? (this.opened / this.sent * 100) : 0
})

MarketingCampaignSchema.virtual('clickRate').get(function() {
  return this.sent > 0 ? (this.clicked / this.sent * 100) : 0
})

MarketingCampaignSchema.virtual('conversionRate').get(function() {
  return this.sent > 0 ? (this.converted / this.sent * 100) : 0
})

// Pre-save middleware
MarketingCampaignSchema.pre('save', function(next) {
  // Auto-calculate some metrics if not set
  if (this.isNew) {
    // Set default recipients based on segment type
    if (!this.recipients && this.segment) {
      // This should be calculated from actual segment data
      // For now, set a reasonable default
      this.recipients = 100
    }
  }
  
  // Auto-set sentAt when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.sentAt) {
    this.sentAt = new Date()
  }
  
  // Auto-set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date()
  }
  
  next()
})

const MarketingCampaign = mongoose.models.MarketingCampaign || 
  mongoose.model('MarketingCampaign', MarketingCampaignSchema)

export default MarketingCampaign