// models/StatusService.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IStatusService extends Document {
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  statusMessage?: string
  group: 'api' | 'database' | 'auth' | 'storage' | 'payment' | 'email' | 'other'
  order: number
  endpoint?: string
  lastIncident?: Date
  lastChecked?: Date
  createdBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const StatusServiceSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Service description is required'] 
  },
  status: { 
    type: String, 
    enum: ['operational', 'degraded', 'outage', 'maintenance'],
    default: 'operational'
  },
  statusMessage: { 
    type: String 
  },
  group: { 
    type: String, 
    enum: ['api', 'database', 'auth', 'storage', 'payment', 'email', 'other'],
    default: 'other'
  },
  order: { 
    type: Number, 
    default: 0 
  },
  endpoint: { 
    type: String 
  },
  lastIncident: { 
    type: Date 
  },
  lastChecked: { 
    type: Date 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
})

export default mongoose.models.StatusService || 
  mongoose.model<IStatusService>('StatusService', StatusServiceSchema)