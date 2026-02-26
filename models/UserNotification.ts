// models/UserNotification.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUserNotification extends Document {
  userId: mongoose.Types.ObjectId
  incidentId: mongoose.Types.ObjectId
  read: boolean
  readAt?: Date
  emailSent: boolean
  emailSentAt?: Date
  createdAt: Date
}

const UserNotificationSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  incidentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'StatusIncident',
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: { 
    type: Date 
  },
  emailSent: { 
    type: Boolean, 
    default: false 
  },
  emailSentAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
})

// Ensure one notification per user per incident
UserNotificationSchema.index({ userId: 1, incidentId: 1 }, { unique: true })

export default mongoose.models.UserNotification || 
  mongoose.model<IUserNotification>('UserNotification', UserNotificationSchema)