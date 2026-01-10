// models/Meeting.ts
import { Schema, model, models, Document } from 'mongoose'

export interface IMeeting extends Document {
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[]; // Array of user IDs or emails
  meetingType: 'internal' | 'client' | 'partner' | 'team';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string; // For virtual meetings
  location?: string; // For physical meetings
  agenda?: string[];
  organizer: Schema.Types.ObjectId;
  notes?: string;
  attachments?: string[]; // File URLs or paths
  reminders: {
    sent: boolean;
    scheduledTime: Date;
  };
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>({
  title: { 
    type: String, 
    required: [true, 'Meeting title is required'],
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  date: { 
    type: Date, 
    required: [true, 'Meeting date is required'] 
  },
  startTime: { 
    type: String, 
    required: [true, 'Start time is required'] 
  },
  endTime: { 
    type: String, 
    required: [true, 'End time is required'] 
  },
  participants: [{
    type: String, // Can be email or user ID
    trim: true
  }],
  meetingType: {
    type: String,
    enum: ['internal', 'client', 'partner', 'team'],
    default: 'internal'
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  agenda: [{
    type: String,
    trim: true
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String
  }],
  reminders: {
    sent: { type: Boolean, default: false },
    scheduledTime: Date
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Index for better query performance
MeetingSchema.index({ userId: 1, date: 1 });
MeetingSchema.index({ participants: 1 });
MeetingSchema.index({ status: 1 });

export default models.Meeting || model<IMeeting>('Meeting', MeetingSchema);