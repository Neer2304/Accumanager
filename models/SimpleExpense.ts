import mongoose from 'mongoose';

const SimpleExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'transport', 'shopping', 'entertainment', 'bills', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  }
}, {
  timestamps: true,
  collection: 'simpleexpenses'
});

// Optimized indexes for user-specific filtering
SimpleExpenseSchema.index({ userId: 1, date: -1 });

const SimpleExpense = mongoose.models.SimpleExpense || 
  mongoose.model('SimpleExpense', SimpleExpenseSchema);

export default SimpleExpense;