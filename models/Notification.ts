import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl: string;
  userId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  actionUrl: {
    type: String,
    default: '',
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  readAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

// Create indexes for better performance
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

// Export the model
export default mongoose.models.Notification as mongoose.Model<INotification> || 
       mongoose.model<INotification>('Notification', NotificationSchema);