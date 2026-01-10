// models/Attendance.ts
import { Schema, model, models, Document } from 'mongoose'

export interface IAttendance extends Document {
  employeeId: Schema.Types.ObjectId;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm
  checkOut?: string; // HH:mm
  status: 'present' | 'absent' | 'half-day' | 'late' | 'holiday' | 'leave';
  workHours?: number; // in hours
  overtime?: number; // in hours
  breakTime?: number; // in minutes
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  shift?: string; // Reference to shift ID
  lateReason?: string;
  approvedBy?: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  employeeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  employeeName: { 
    type: String, 
    required: true,
    trim: true
  },
  date: { 
    type: String, 
    required: true 
  },
  checkIn: { 
    type: String, 
    required: true 
  },
  checkOut: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'half-day', 'late', 'holiday', 'leave'],
    required: true 
  },
  workHours: { 
    type: Number,
    min: 0
  },
  overtime: { 
    type: Number,
    min: 0
  },
  breakTime: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  notes: { 
    type: String,
    trim: true
  },
  shift: {
    type: String,
    ref: 'Shift'
  },
  lateReason: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: String,
    trim: true
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per employee per day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Index for better query performance
AttendanceSchema.index({ userId: 1, date: 1 });
AttendanceSchema.index({ employeeId: 1, userId: 1 });
AttendanceSchema.index({ status: 1, date: 1 });

// Virtual for calculating work hours
AttendanceSchema.virtual('calculatedWorkHours').get(function() {
  if (this.checkIn && this.checkOut) {
    const [inHours, inMinutes] = this.checkIn.split(':').map(Number);
    const [outHours, outMinutes] = this.checkOut.split(':').map(Number);
    
    const checkInTime = inHours + inMinutes / 60;
    const checkOutTime = outHours + outMinutes / 60;
    
    return Math.max(0, checkOutTime - checkInTime - (this.breakTime || 0) / 60);
  }
  return 0;
});

export default models.Attendance || model<IAttendance>('Attendance', AttendanceSchema);