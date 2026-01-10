import { Schema, model, models, Document } from 'mongoose';

export interface IMessageUser extends Document {
  meetingId: string;
  senderId: string; // User who sent the invitation
  receiverId: string; // User invited to meeting
  senderName: string;
  receiverName: string;
  meetingTitle: string;
  meetingLink: string;
  meetingTime: Date;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageUserSchema = new Schema<IMessageUser>({
  meetingId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  meetingTitle: { type: String, required: true },
  meetingLink: { type: String, required: true },
  meetingTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  },
  message: { type: String },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for faster queries
MessageUserSchema.index({ receiverId: 1, status: 1 });
MessageUserSchema.index({ senderId: 1 });
MessageUserSchema.index({ meetingId: 1 });

export default models.MessageUser || model<IMessageUser>('MessageUser', MessageUserSchema);