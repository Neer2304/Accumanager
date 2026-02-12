// models/Employee.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Link to User account if exists
  
  // Personal Info
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Employment Details
  department: string;
  designation: string;
  role: string;
  reportingTo?: mongoose.Types.ObjectId;
  reportingToName?: string;
  
  // Dates
  joiningDate: Date;
  confirmationDate?: Date;
  exitDate?: Date;
  
  // Compensation
  salary: number;
  payFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    panCard: string;
    upiId?: string;
  };
  
  // Address
  currentAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  sameAsCurrent: boolean;
  
  // Documents
  documents: Array<{
    type: 'resume' | 'degree' | 'certificate' | 'id_proof' | 'address_proof' | 'other';
    filename: string;
    url: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // Status
  status: 'active' | 'inactive' | 'on_leave' | 'terminated' | 'resigned';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern' | 'consultant';
  workLocation: 'onsite' | 'remote' | 'hybrid';
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
  };
  
  // Skills & Qualifications
  skills: string[];
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    grade?: string;
  }>;
  
  // Work History
  workHistory: Array<{
    company: string;
    designation: string;
    fromDate: Date;
    toDate?: Date;
    isCurrent: boolean;
    responsibilities?: string;
  }>;
  
  // Leave Balance
  leaveBalance: {
    annual: number;
    sick: number;
    casual: number;
    unpaid: number;
    other: number;
  };
  
  // Metadata
  tags: string[];
  customFields: Map<string, any>;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  // 🔐 SECURITY - References to your EXISTING User model
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    sparse: true,
    index: true
  },
  
  // Personal Info
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    index: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed']
  },
  
  // Employment Details
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    index: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  reportingTo: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    sparse: true
  },
  reportingToName: {
    type: String,
    trim: true
  },
  
  // Dates
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    index: true
  },
  confirmationDate: Date,
  exitDate: Date,
  
  // Compensation
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: 0
  },
  payFrequency: {
    type: String,
    enum: ['monthly', 'bi-weekly', 'weekly'],
    default: 'monthly'
  },
  bankDetails: {
    accountName: { 
      type: String, 
      required: true,
      trim: true 
    },
    accountNumber: { 
      type: String, 
      required: true,
      trim: true 
    },
    bankName: { 
      type: String, 
      required: true,
      trim: true 
    },
    ifscCode: { 
      type: String, 
      required: true,
      trim: true 
    },
    panCard: { 
      type: String, 
      required: true,
      trim: true 
    },
    upiId: { 
      type: String,
      trim: true 
    }
  },
  
  // Address
  currentAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'USA' },
    zipCode: { type: String, required: true, trim: true }
  },
  permanentAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'USA' },
    zipCode: { type: String, required: true, trim: true }
  },
  sameAsCurrent: {
    type: Boolean,
    default: false
  },
  
  // Documents
  documents: [{
    type: { 
      type: String, 
      enum: ['resume', 'degree', 'certificate', 'id_proof', 'address_proof', 'other'],
      required: true 
    },
    filename: { 
      type: String, 
      required: true,
      trim: true 
    },
    url: { 
      type: String, 
      required: true 
    },
    fileType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated', 'resigned'],
    default: 'active',
    index: true
  },
  employmentType: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'intern', 'consultant'],
    default: 'full_time'
  },
  workLocation: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true },
    email: { 
      type: String, 
      lowercase: true,
      trim: true 
    }
  },
  
  // Skills & Qualifications
  skills: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    grade: { type: String, trim: true }
  }],
  
  // Work History
  workHistory: [{
    company: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    fromDate: { type: Date, required: true },
    toDate: Date,
    isCurrent: { type: Boolean, default: false },
    responsibilities: String
  }],
  
  // Leave Balance
  leaveBalance: {
    annual: { type: Number, default: 20 },
    sick: { type: Number, default: 12 },
    casual: { type: Number, default: 10 },
    unpaid: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  
  // Audit
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References your EXISTING User model
    required: true
  },
  createdByName: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedByName: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'employees'
});

// 🔐 CRITICAL SECURITY INDEXES
EmployeeSchema.index({ companyId: 1, employeeId: 1 }, { unique: true });
EmployeeSchema.index({ companyId: 1, email: 1 }, { unique: true });
EmployeeSchema.index({ companyId: 1, department: 1, status: 1 });
EmployeeSchema.index({ companyId: 1, reportingTo: 1 });

// Pre-save middleware
EmployeeSchema.pre('save', function(this: IEmployee, next) {
  // Set full name
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  
  // Copy current to permanent if sameAsCurrent
  if (this.sameAsCurrent) {
    this.permanentAddress = { ...this.currentAddress };
  }
  
  next();
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);