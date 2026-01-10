// models/Notification.ts
import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
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
    type: String, // URL to navigate when notification is clicked
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { 
  timestamps: true 
})

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)