// types/dasboard.ts - Add this if not exists
export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  monthlyRevenue: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingBills: number;
  subscription?: {
    plan: string;
    isActive: boolean;
    limits: any;
  };
}