// models/Employee.ts
import { Schema, model, models, Document } from 'mongoose'

export interface IEmployee extends Document {
  name: string;
  phone: string;
  email?: string;
  role: string;
  department?: string;
  salary: number;
  salaryType: 'monthly' | 'hourly' | 'daily';
  joiningDate: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolder: string;
  };
  documents?: {
    aadhaar?: string;
    pan?: string;
    license?: string;
  };
  shifts: string[]; // Reference to shift IDs
  leaveBalance: number;
  isActive: boolean;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { 
    type: String, 
    required: [true, 'Employee name is required'],
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: { 
    type: String, 
    trim: true,
    lowercase: true
  },
  role: { 
    type: String, 
    required: [true, 'Role is required'],
    trim: true
  },
  department: { 
    type: String, 
    trim: true
  },
  salary: { 
    type: Number, 
    required: [true, 'Salary is required'],
    min: 0
  },
  salaryType: {
    type: String,
    enum: ['monthly', 'hourly', 'daily'],
    default: 'monthly'
  },
  joiningDate: { 
    type: Date, 
    required: [true, 'Joining date is required'],
    default: Date.now
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolder: String
  },
  documents: {
    aadhaar: String,
    pan: String,
    license: String
  },
  shifts: [{
    type: String,
    ref: 'Shift'
  }],
  leaveBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: { 
    type: Boolean, 
    default: true 
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
EmployeeSchema.index({ userId: 1, isActive: 1 });
EmployeeSchema.index({ phone: 1, userId: 1 }, { unique: true });
EmployeeSchema.index({ email: 1, userId: 1 }, { sparse: true });

export default models.Employee || model<IEmployee>('Employee', EmployeeSchema);