// models/LegalDocument.ts
import mongoose from 'mongoose';

const legalDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacy_policy', 'terms_of_service', 'cookie_policy'],
    required: true,  // Make sure this is required
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.LegalDocument || mongoose.model('LegalDocument', legalDocumentSchema);