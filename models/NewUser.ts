// models/NewUser.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface INewUser extends Document {
  // Basic Information
  fullName: string
  email: string
  password: string
  phoneNumber: string
  dateOfBirth: Date
  
  // Personal Information
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  relationshipStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated'
  
  // Address
  streetAddress: string
  city: string
  state: string
  country: string
  zipCode: string
  
  // Professional Information
  occupation: string
  companyName: string
  jobTitle: string
  incomeRange: '<20k' | '20k-40k' | '40k-60k' | '60k-80k' | '80k-100k' | '100k+'
  
  // Interests & Preferences
  interests: string[]
  newsletterSubscription: boolean
  termsAccepted: boolean
  privacyAccepted: boolean
  
  // Account Details
  username: string
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const NewUserSchema: Schema = new Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value: Date) {
        const today = new Date()
        const age = today.getFullYear() - value.getFullYear()
        const monthDiff = today.getMonth() - value.getMonth()
        const dayDiff = today.getDate() - value.getDate()
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1 >= 13
        }
        return age >= 13
      },
      message: 'You must be at least 13 years old to register'
    }
  },
  
  // Personal Information
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: true,
    default: 'prefer-not-to-say'
  },
  relationshipStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', 'separated'],
    required: true
  },
  
  // Address
  streetAddress: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
    maxlength: [200, 'Street address cannot exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
  },
  
  // Professional Information
  occupation: {
    type: String,
    trim: true,
    maxlength: [50, 'Occupation cannot exceed 50 characters']
  },
  companyName: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [50, 'Job title cannot exceed 50 characters']
  },
  incomeRange: {
    type: String,
    enum: ['<20k', '20k-40k', '40k-60k', '60k-80k', '80k-100k', '100k+'],
    required: true
  },
  
  // Interests & Preferences
  interests: {
    type: [String],
    default: [],
    validate: {
      validator: function(value: string[]) {
        return value.length <= 10
      },
      message: 'Cannot select more than 10 interests'
    }
  },
  newsletterSubscription: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept the terms and conditions'],
    validate: {
      validator: function(value: boolean) {
        return value === true
      },
      message: 'You must accept the terms and conditions'
    }
  },
  privacyAccepted: {
    type: Boolean,
    required: [true, 'You must accept the privacy policy'],
    validate: {
      validator: function(value: boolean) {
        return value === true
      },
      message: 'You must accept the privacy policy'
    }
  },
  
  // Account Details
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots and underscores']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.__v
      return ret
    }
  }
})

// Encrypt sensitive data middleware
NewUserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    // Password will be hashed separately in the route
    next()
  }
  
  if (this.isModified('streetAddress') && this.streetAddress) {
    // For demonstration - in production, use proper encryption
    this.streetAddress = `ENCRYPTED:${Buffer.from(this.streetAddress).toString('base64')}`
  }
  
  if (this.isModified('phoneNumber') && this.phoneNumber) {
    this.phoneNumber = `ENCRYPTED:${Buffer.from(this.phoneNumber).toString('base64')}`
  }
  
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.NewUser || mongoose.model<INewUser>('NewUser', NewUserSchema)