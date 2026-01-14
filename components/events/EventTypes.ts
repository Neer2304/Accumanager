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
}