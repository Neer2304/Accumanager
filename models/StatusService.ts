// models/StatusService.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IStatusService extends Document {
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: number
  latency: number
  group: 'api' | 'database' | 'storage' | 'auth' | 'payment' | 'email'
  order: number
  lastIncident?: Date
  createdAt: Date
  updatedAt: Date
}

const StatusServiceSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Service name is required'] 
  },
  description: { 
    type: String, 
    required: [true, 'Service description is required'] 
  },
  status: { 
    type: String, 
    enum: {
      values: ['operational', 'degraded', 'outage', 'maintenance'],
      message: '{VALUE} is not a valid status'
    },
    default: 'operational'
  },
  uptime: { 
    type: Number, 
    default: 99.99,
    min: [0, 'Uptime cannot be negative'],
    max: [100, 'Uptime cannot exceed 100']
  },
  latency: { 
    type: Number, 
    default: 0,
    min: [0, 'Latency cannot be negative']
  },
  group: { 
    type: String, 
    enum: {
      values: ['api', 'database', 'storage', 'auth', 'payment', 'email'],
      message: '{VALUE} is not a valid group'
    },
    required: [true, 'Service group is required'] 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  lastIncident: { 
    type: Date 
  }
}, { 
  timestamps: true 
})

export default mongoose.models.StatusService || mongoose.model<IStatusService>('StatusService', StatusServiceSchema)