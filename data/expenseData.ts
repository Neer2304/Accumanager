// Only data, no icons or React imports

export const expenseCategories = [
  { value: 'food', label: 'Food & Dining', color: '#ff6b6b' },
  { value: 'transport', label: 'Transport', color: '#4ecdc4' },
  { value: 'entertainment', label: 'Entertainment', color: '#45b7d1' },
  { value: 'shopping', label: 'Shopping', color: '#96ceb4' },
  { value: 'bills', label: 'Bills & Utilities', color: '#feca57' },
  { value: 'healthcare', label: 'Healthcare', color: '#ff9ff3' },
  { value: 'education', label: 'Education', color: '#54a0ff' },
  { value: 'travel', label: 'Travel', color: '#5f27cd' },
  { value: 'business', label: 'Business', color: '#00d2d3' },
  { value: 'personal', label: 'Personal', color: '#ff9f43' },
  { value: 'other', label: 'Other', color: '#8395a7' },
] as const;

export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'digital-wallet', label: 'Digital Wallet' },
] as const;

export type ExpenseCategory = typeof expenseCategories[number]['value'];
export type PaymentMethod = typeof paymentMethods[number]['value'];