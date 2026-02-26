// models/StatusIncident.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IStatusIncident extends Document {
  title: string
  description?: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  services: string[]
  updates: Array<{
    message: string
    timestamp: Date
    status: string
  }>
  resolvedAt?: Date
  createdBy?: mongoose.Types.ObjectId
  autoCreated: boolean
  notifiedUsers: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const StatusIncidentSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Incident title is required'] 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['investigating', 'identified', 'monitoring', 'resolved'],
    default: 'investigating'
  },
  severity: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'],
    required: [true, 'Severity is required'] 
  },
  services: [{ 
    type: String,
    required: true 
  }],
  updates: [{
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String }
  }],
  resolvedAt: { 
    type: Date 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  autoCreated: { 
    type: Boolean, 
    default: false 
  },
  notifiedUsers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: true 
})

export default mongoose.models.StatusIncident || 
  mongoose.model<IStatusIncident>('StatusIncident', StatusIncidentSchema)