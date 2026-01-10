// models/Terms.ts
import mongoose from 'mongoose';

const TermsSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
});

const TermsConditionsSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    default: 'Terms & Conditions'
  },
  description: {
    type: String,
    default: ''
  },
  sections: [TermsSectionSchema],
  importantPoints: [{
    text: String,
    order: Number
  }],
  isActive: {
    type: Boolean,
    default: false
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Only one active terms document at a time
TermsConditionsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.TermsConditions || mongoose.model('TermsConditions', TermsConditionsSchema);