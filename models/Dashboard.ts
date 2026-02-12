// models/Dashboard.ts
import mongoose from 'mongoose';

const DashboardSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  
  widgets: [{
    type: {
      type: String,
      enum: [
        'lead_conversion_chart',
        'revenue_forecast',
        'active_deals',
        'pipeline_funnel',
        'sales_performance',
        'activity_timeline',
        'top_performers',
        'recent_deals',
        'deal_velocity',
        'win_rate'
      ],
      required: true
    },
    title: String,
    position: {
      x: Number,
      y: Number,
      w: Number,
      h: Number
    },
    settings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    isVisible: { type: Boolean, default: true }
  }],
  
  isDefault: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export default mongoose.models.Dashboard || mongoose.model('Dashboard', DashboardSchema);