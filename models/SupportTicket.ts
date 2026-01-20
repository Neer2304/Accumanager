// models/SupportTicket.js
import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SupportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },
  category: {
    type: String,
    enum: ['billing', 'technical', 'account', 'feature', 'general', 'other'],
    default: 'other',
  },
  replies: [ReplySchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastRepliedAt: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  metadata: {
    browser: String,
    os: String,
    ipAddress: String,
    userAgent: String,
  }
}, {
  timestamps: true,
});

// Generate ticket number before saving
SupportTicketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await mongoose.models.SupportTicket?.countDocuments() || 0;
    this.ticketNumber = `TKT-${year}${month}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Update lastRepliedAt when reply is added
  if (this.isModified('replies') && this.replies.length > 0) {
    this.lastRepliedAt = new Date();
  }
  
  // Update resolvedAt when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved') {
    this.resolvedAt = new Date();
  }
  
  next();
});

// Indexes for better query performance
SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ status: 1, priority: -1, createdAt: -1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);