// models/LegalDocument.ts
import mongoose from 'mongoose';

const legalDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacy_policy', 'terms_of_service', 'cookie_policy'],
    required: [true, 'Document type is required'],
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    default: '1.0.0',
    match: [/^\d+\.\d+\.\d+$/, 'Version must be in format X.X.X']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Last updated by is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'legaldocuments'
});

legalDocumentSchema.index({ type: 1, isActive: 1 });

export default mongoose.models.LegalDocument || mongoose.model('LegalDocument', legalDocumentSchema);