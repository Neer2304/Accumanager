// models/PipelineStage.ts
import mongoose from 'mongoose';

const PipelineStageSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  name: { type: String, required: true },
  order: { type: Number, required: true },
  probability: { type: Number, default: 0 }, // Default probability for deals in this stage
  color: String,
  isActive: { type: Boolean, default: true },
  
  // Stage type
  category: {
    type: String,
    enum: ['open', 'won', 'lost'],
    default: 'open'
  },
  
  isDefault: { type: Boolean, default: false },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

PipelineStageSchema.index({ companyId: 1, order: 1 });

export default mongoose.models.PipelineStage || mongoose.model('PipelineStage', PipelineStageSchema);