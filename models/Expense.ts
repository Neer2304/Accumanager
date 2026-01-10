import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'healthcare', 'education', 'travel', 'business', 'personal', 'other']
  },
  
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'digital-wallet']
  },
  
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Business Expense Details
  isBusinessExpense: {
    type: Boolean,
    default: false
  },
  
  gstAmount: {
    type: Number,
    default: 0,
    min: [0, 'GST amount cannot be negative']
  },
  
  vendor: {
    name: String,
    gstin: String,
    contact: String
  },
  
  receipt: String,
  
  tags: [{
    type: String,
    trim: true
  }],
  
  // Recurring Expenses
  isRecurring: {
    type: Boolean,
    default: false
  },
  
  recurrence: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', null],
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Sync Information (for offline support)
  isLocal: {
    type: Boolean,
    default: false
  },
  
  isSynced: {
    type: Boolean,
    default: true
  },
  
  syncAttempts: {
    type: Number,
    default: 0
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
  timestamps: true
});

// Update the updatedAt timestamp on save
ExpenseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);