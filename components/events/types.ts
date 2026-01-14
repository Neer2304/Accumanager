export interface SubEvent {
  _id: string;
  name: string;
  description: string;
  budget: number;
  spentAmount: number;
  status: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  subEventId?: string;
  receipt: string;
  notes: string;
  createdAt: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  status: string;
  subEvents: SubEvent[];
  expenses: Expense[];
}

export const eventTypes = [
  { value: "marriage", label: "Marriage" },
  { value: "business", label: "Business Event" },
  { value: "personal", label: "Personal" },
  { value: "travel", label: "Travel" },
  { value: "festival", label: "Festival" },
  { value: "other", label: "Other" },
] as const;

export const expenseCategories = [
  "Food & Catering",
  "Venue & Decorations",
  "Clothing & Jewelry",
  "Photography & Videography",
  "Transportation",
  "Accommodation",
  "Entertainment",
  "Gifts & Favors",
  "Miscellaneous",
] as const;