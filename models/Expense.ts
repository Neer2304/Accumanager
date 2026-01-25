import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'food', 'transport', 'entertainment', 'shopping', 
      'bills', 'healthcare', 'education', 'travel', 
      'business', 'personal', 'other'
    ]
  },
  paymentMethod: {
    type: String,
    default: 'cash',
    enum: ['cash', 'card', 'upi', 'bank-transfer', 'digital-wallet']
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isBusinessExpense: {
    type: Boolean,
    default: false
  },
  gstAmount: {
    type: Number,
    default: 0,
    min: 0
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
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', null],
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'reimbursed'],
    default: 'pending'
  },
  
  // USER ID FIELD
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total amount including GST
ExpenseSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.gstAmount || 0);
});

// Compound indexes
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, paymentMethod: 1 });
ExpenseSchema.index({ userId: 1, isBusinessExpense: 1 });

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

export default Expense;