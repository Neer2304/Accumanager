// components/googleexpenses/constants.ts
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { value: 'all', label: 'All Categories', color: 'bg-slate-500' },
  { value: 'food', label: 'Food', color: 'bg-orange-500' },
  { value: 'transport', label: 'Transport', color: 'bg-blue-500' },
  { value: 'shopping', label: 'Shopping', color: 'bg-purple-500' },
  { value: 'entertainment', label: 'Entertainment', color: 'bg-pink-500' },
  { value: 'bills', label: 'Bills', color: 'bg-red-500' },
  { value: 'other', label: 'Other', color: 'bg-emerald-500' }
];

export const getCategoryColor = (categoryValue: string): string => {
  const category = CATEGORIES.find(c => c.value === categoryValue);
  return category?.color || 'bg-slate-400';
};