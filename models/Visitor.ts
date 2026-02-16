// models/Visitor.ts
import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String, default: '' },
  duration: { type: Number },
});

const deviceSchema = new mongoose.Schema({
  type: { type: String, enum: ['desktop', 'mobile', 'tablet', 'bot', 'other'], default: 'other' },
  brand: { type: String, default: 'Unknown' },
  model: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  osVersion: { type: String, default: '' },
  browser: { type: String, default: 'Unknown' },
  browserVersion: { type: String, default: '' },
  engine: { type: String, default: 'Unknown' },
  engineVersion: { type: String, default: '' },
  isMobile: { type: Boolean, default: false },
  isTablet: { type: Boolean, default: false },
  isDesktop: { type: Boolean, default: false },
  isBot: { type: Boolean, default: false },
  screenResolution: { type: String },
  language: { type: String },
  timezone: { type: String },
});

const locationSchema = new mongoose.Schema({
  country: { type: String },
  countryCode: { type: String },
  region: { type: String },
  regionCode: { type: String },
  city: { type: String },
  zipCode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  timezone: { type: String },
  isp: { type: String },
  organization: { type: String },
  as: { type: String },
  isMobile: { type: Boolean },
  isProxy: { type: Boolean },
  isHosting: { type: Boolean },
});

const visitorSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, index: true },
  userAgent: { type: String, default: '' },
  pageUrl: { type: String, default: '/' },
  referrer: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now, index: true },
  lastVisit: { type: Date, default: Date.now, index: true },
  visitCount: { type: Number, default: 1 },
  pageViews: [pageViewSchema],
  device: deviceSchema,
  location: locationSchema,
  sessionId: { type: String, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  converted: { type: Boolean, default: false },
  conversionData: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true
});

// Create indexes
visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ 'device.type': 1 });
visitorSchema.index({ 'location.country': 1 });

export default mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);