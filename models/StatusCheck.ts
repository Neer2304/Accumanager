// models/StatusCheck.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IStatusCheck extends Document {
  serviceId: mongoose.Types.ObjectId
  timestamp: Date
  responseTime: number
  success: boolean
  statusCode?: number
  error?: string
  region?: string
  checkedBy?: mongoose.Types.ObjectId // User who triggered the check (if manual)
  createdAt: Date
}

const StatusCheckSchema = new Schema({
  serviceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'StatusService',
    required: true,
    index: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  responseTime: { 
    type: Number, 
    required: true,
    min: 0
  },
  success: { 
    type: Boolean, 
    required: true 
  },
  statusCode: { 
    type: Number 
  },
  error: { 
    type: String 
  },
  region: { 
    type: String, 
    default: 'default' 
  },
  checkedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
})

// Indexes for fast queries
StatusCheckSchema.index({ serviceId: 1, timestamp: -1 })
StatusCheckSchema.index({ serviceId: 1, success: 1, timestamp: -1 })

export default mongoose.models.StatusCheck || 
  mongoose.model<IStatusCheck>('StatusCheck', StatusCheckSchema)