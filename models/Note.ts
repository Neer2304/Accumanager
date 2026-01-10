// models/Note.ts
import { Schema, model, models, Document } from 'mongoose'

export interface INote extends Document {
  title: string;
  content: string;
  category: 'meeting' | 'project' | 'personal' | 'ideas' | 'todo';
  tags: string[];
  isPinned: boolean;
  meetingId?: Schema.Types.ObjectId; // Link to specific meeting
  attachments?: string[];
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { 
    type: String, 
    required: [true, 'Note title is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'Note content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['meeting', 'project', 'personal', 'ideas', 'todo'],
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  meetingId: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting'
  },
  attachments: [{
    type: String
  }],
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Index for better query performance
NoteSchema.index({ userId: 1, category: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ isPinned: 1 });

export default models.Note || model<INote>('Note', NoteSchema);