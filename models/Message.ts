import { Schema, model, models, Document } from 'mongoose';

export interface IMessage extends Document {
  type: 'meeting_invite' | 'direct_message' | 'system_notification';
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  subject: string;
  content: string;
  meetingId?: string;
  meetingTitle?: string;
  meetingLink?: string;
  meetingTime?: Date;
  meetingType?: 'internal' | 'client' | 'partner' | 'team';
  status: 'pending' | 'accepted' | 'declined' | 'read' | 'unread' | 'archived' | 'deleted';
  isStarred: boolean;
  isImportant: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    type: {
      type: String,
      enum: ['meeting_invite', 'direct_message', 'system_notification'],
      required: true,
    },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderAvatar: { type: String },
    receiverId: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    meetingId: { type: String },
    meetingTitle: { type: String },
    meetingLink: { type: String },
    meetingTime: { type: Date },
    meetingType: {
      type: String,
      enum: ['internal', 'client', 'partner', 'team'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'read', 'unread', 'archived', 'deleted'],
      default: 'unread',
    },
    isStarred: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
MessageSchema.index({ receiverId: 1, status: 1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ meetingId: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ 
  subject: 'text', 
  content: 'text', 
  senderName: 'text', 
  senderEmail: 'text' 
});

export default models.Message || model<IMessage>('Message', MessageSchema);