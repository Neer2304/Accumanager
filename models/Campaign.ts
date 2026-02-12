// models/Campaign.ts
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  name: { type: String, required: true },
  description: String,
  
  type: {
    type: String,
    enum: ['email', 'sms', 'whatsapp', 'newsletter', 'drip'],
    default: 'email'
  },
  
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Content
  subject: String,
  previewText: String,
  content: String,
  template: String,
  
  // Schedule
  scheduledAt: Date,
  sentAt: Date,
  
  // Target Audience
  targetType: {
    type: String,
    enum: ['leads', 'contacts', 'customers', 'all'],
    required: true
  },
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Segmentation
  segments: [{
    type: String,
    criteria: Map
  }],
  
  // A/B Testing
  abTest: {
    isEnabled: Boolean,
    variants: [{
      name: String,
      subject: String,
      content: String,
      percentage: Number
    }],
    winner: String
  },
  
  // Analytics
  analytics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
    complaints: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByName: String
}, { timestamps: true });

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);