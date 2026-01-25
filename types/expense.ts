export interface Expense {
  _id?: string;
  id?: string;
  title: string;
  expense?: any;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string;
  date: string;
  description: string;
  isBusinessExpense: boolean;
  gstAmount: number;
  vendor?: {
    name: string;
    gstin: string;
    contact: string;
  };
  tags: string[];
  isRecurring: boolean;
  recurrence?: string | null;
  status: string;
  userId?: string;
}

export interface ExpenseStats {
  categoryStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
    averageAmount: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    totalAmount: number;
    businessExpenses: number;
    personalExpenses: number;
    count: number;
  }>;
  paymentStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  period: { year: number; month: number };
}

// Optional: Add helper types
export type ExpenseCategory = 
  | 'food' | 'transport' | 'entertainment' | 'shopping' 
  | 'bills' | 'healthcare' | 'education' | 'travel' 
  | 'business' | 'personal' | 'other';

export type PaymentMethod = 
  | 'cash' | 'card' | 'upi' | 'bank-transfer' | 'digital-wallet';