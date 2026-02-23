// models/StatusIncident.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IStatusIncident extends Document {
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'critical' | 'high' | 'medium' | 'low'
  services: string[] // Service names
  updates: Array<{
    message: string
    timestamp: Date
    status: string
  }>
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const StatusIncidentSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Incident title is required'] 
  },
  status: { 
    type: String, 
    enum: {
      values: ['investigating', 'identified', 'monitoring', 'resolved'],
      message: '{VALUE} is not a valid status'
    },
    default: 'investigating'
  },
  severity: { 
    type: String, 
    enum: {
      values: ['critical', 'high', 'medium', 'low'],
      message: '{VALUE} is not a valid severity'
    },
    required: [true, 'Severity is required'] 
  },
  services: [{ 
    type: String 
  }],
  updates: [{
    message: { 
      type: String, 
      required: true 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String 
    }
  }],
  resolvedAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
})

export default mongoose.models.StatusIncident || mongoose.model<IStatusIncident>('StatusIncident', StatusIncidentSchema)