import mongoose, { Schema, Document } from 'mongoose';

export interface IFieldVisit extends Document {
  // Basic Information
  title: string;
  description?: string;
  type: 'service' | 'installation' | 'maintenance' | 'inspection' | 'delivery' | 'meeting' | 'followup';
  
  // Customer Reference (from your existing Customer model)
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerType?: 'individual' | 'business' | 'retail';
  
  // Employee Assignment (from your existing Employee model)
  employeeId?: mongoose.Types.ObjectId;
  employeeName?: string;
  employeePhone?: string;
  
  // Order Reference (from your existing Order model - optional)
  orderId?: mongoose.Types.ObjectId;
  invoiceId?: string;
  
  // Scheduling
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  estimatedDuration?: number; // in hours
  
  // Status
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Location
  location: {
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Work Details
  workPerformed?: string;
  issuesFound?: string;
  recommendations?: string;
  materialsUsed?: string;
  notes?: string;
  
  // Time Tracking
  checkInTime?: Date;
  checkOutTime?: Date;
  actualDuration?: number; // in hours
  travelTime?: number; // in minutes
  
  // Customer Feedback
  customerFeedback?: {
    rating: number; // 1-5
    comments?: string;
    receivedAt?: Date;
  };
  
  // Payment
  isChargeable: boolean;
  chargeAmount?: number;
  paymentStatus: 'pending' | 'partially-paid' | 'paid' | 'free' | 'invoiced';
  
  // Attachments
  photos?: string[];
  documents?: string[];
  
  // Metadata
  userId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId; // User who created this
  createdAt: Date;
  updatedAt: Date;
}

const FieldVisitSchema = new Schema<IFieldVisit>({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['service', 'installation', 'maintenance', 'inspection', 'delivery', 'meeting', 'followup'],
    default: 'service'
  },
  
  // Customer Reference
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerPhone: String,
  customerEmail: String,
  customerAddress: String,
  customerType: {
    type: String,
    enum: ['individual', 'business', 'retail', null],
    default: null
  },
  
  // Employee Assignment
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  employeeName: String,
  employeePhone: String,
  
  // Order Reference
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  invoiceId: String,
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  startTime: Date,
  endTime: Date,
  estimatedDuration: Number,
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled', 'pending'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Location
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Work Details
  workPerformed: String,
  issuesFound: String,
  recommendations: String,
  materialsUsed: String,
  notes: String,
  
  // Time Tracking
  checkInTime: Date,
  checkOutTime: Date,
  actualDuration: Number,
  travelTime: Number,
  
  // Customer Feedback
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    receivedAt: Date
  },
  
  // Payment
  isChargeable: {
    type: Boolean,
    default: true
  },
  chargeAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partially-paid', 'paid', 'free', 'invoiced'],
    default: 'pending'
  },
  
  // Attachments
  photos: [String],
  documents: [String],
  
  // Metadata
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
FieldVisitSchema.index({ userId: 1, status: 1 });
FieldVisitSchema.index({ userId: 1, customerId: 1 });
FieldVisitSchema.index({ userId: 1, employeeId: 1 });
FieldVisitSchema.index({ userId: 1, scheduledDate: 1 });
FieldVisitSchema.index({ userId: 1, 'location.city': 1 });
FieldVisitSchema.index({ status: 1, scheduledDate: 1 });

// Virtual for whether visit is overdue
FieldVisitSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return this.scheduledDate < new Date();
});

// Virtual for duration
FieldVisitSchema.virtual('duration').get(function() {
  if (this.startTime && this.endTime) {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * 60); // in hours
  }
  return null;
});

const FieldVisit = mongoose.models.FieldVisit || mongoose.model<IFieldVisit>('FieldVisit', FieldVisitSchema);

export default FieldVisit;