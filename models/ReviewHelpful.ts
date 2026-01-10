// models/ReviewHelpful.js
import mongoose from 'mongoose';

const reviewHelpfulSchema = new mongoose.Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure user can only mark helpful once per review
reviewHelpfulSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default mongoose.models.ReviewHelpful || mongoose.model('ReviewHelpful', reviewHelpfulSchema);