// components/googleexpenses/types.ts
export interface Expense {
  id: string;
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Summary {
  totalAmount: number;
  totalExpenses: number;
}

export interface Category {
  value: string;
  label: string;
  color: string;
  icon?: React.ReactNode;
}

export interface Pagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FormData {
  title: string;
  amount: string;
  category: string;
  date: string;
  description: string;
}

export interface ExpensesPageProps {
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}