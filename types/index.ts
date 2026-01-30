// types/index.ts

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  shopName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  gstRate: number;
  images: string[];
  category: string;
  sku: string;
  barcode?: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  gstRate: number;
  images: string[];
  category: string;
  sku: string;
  barcode?: string;
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  totalPurchases: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstNumber?: string;
}

export interface CustomersState {
  items: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

// Billing Types
export interface BillItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  gstRate: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId?: string;
  customerName: string;
  items: BillItem[];
  subtotal: number;
  totalGst: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "cash" | "card" | "upi" | "credit";
  status: "pending" | "paid" | "cancelled";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillFormData {
  customerId?: string;
  customerName: string;
  items: BillItem[];
  discount: number;
  paymentMethod: "cash" | "card" | "upi" | "credit";
}

export interface BillingState {
  currentBill: BillFormData;
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
}

// Attendance & Employee Types
export interface Employee {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  salary: number;
  joiningDate: Date;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFormData {
  name: string;
  phone: string;
  email?: string;
  role: string;
  salary: number;
  joiningDate: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "half-day";
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "half-day";
  notes?: string;
}

export interface AttendanceState {
  employees: Employee[];
  attendance: Attendance[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  shopName?: string;
}

// Redux Store Type
export interface RootState {
  auth: AuthState;
  products: ProductsState;
  customers: CustomersState;
  billing: BillingState;
  attendance: AttendanceState;
}

// Offline Storage Types
export interface OfflineStorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: unknown;
}

export interface BaseItem {
  id: string;
  isLocal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Stats Types
// types/index.ts - Add these types
export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  monthlyRevenue: number;
  lowStockProducts: number;
  pendingBills: number;
  totalEmployees: number;
  presentEmployees: number;
  activeProjects: number;
  upcomingEvents: number;
}

export interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
  totalItems?: number;
  orders?: number;
  avgOrderValue?: number;
}

export interface ProductSalesData {
  productName: string;
  sales: number;
  revenue: number;
  id?: string; // Add this
  productId?: string;
}

export interface RecentActivity {
  id: number;
  type: string;
  message: string;
  details: string;
  time: string;
  icon: React.ReactNode;
}

// Chart Data Types
export interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
}

export interface ProductSalesData {
  productName: string;
  sales: number;
  revenue: number;
}

// Search and Filter Types
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  search?: string;
}

export interface BillFilter {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  paymentMethod?: string;
  status?: string;
}

// Export all types
export type {
  User as UserType,
  Product as ProductType,
  Customer as CustomerType,
  Bill as BillType,
  Employee as EmployeeType,
  Attendance as AttendanceType,
};

// Add to existing types
// types/index.ts - UPDATED
export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  monthlyRevenue: number;
  totalRevenue?: number;
  lowStockProducts: number;
  pendingBills: number;
  totalEmployees: number;
  presentEmployees: number;
  activeProjects: number;
  upcomingEvents: number;
  subscription?: {
    plan: string;
    isActive: boolean;
    limits: any;
  };
}

export interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
}

// types/index.ts - ADD THESE TYPES
export interface ProductStats {
  _id: string;
  name: string;
  totalSales: number;
  totalRevenue: number;
  stock: number;
  category: string;
}

export interface ProductSalesData {
  productName: string;
  sales: number;
  revenue: number;
}

// types/index.ts - Add these new types

// Product Variation Types
// types/index.ts - Add missing types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: GSTDetails;
  variations: ProductVariation[];
  batches: ProductBatch[];
  tags: string[];
  isReturnable: boolean;
  returnPeriod: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: GSTDetails;
  variations: ProductVariation[];
  batches: ProductBatch[];
  tags: string[];
  isReturnable: boolean;
  returnPeriod: number;
}

export interface GSTDetails {
  type: "cgst_sgst" | "igst" | "utgst";
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  utgstRate: number;
}

export interface ProductVariation {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  weight?: number;
  unit?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  barcode?: string;
  images?: string[];
  isActive: boolean;
}

export interface ProductBatch {
  id: string;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  mfgDate: Date;
  expDate: Date;
  receivedDate: Date;
  location?: string;
  supplier?: string;
  isActive: boolean;
}

// Billing Types
export interface BillItem {
  productId: string;
  variationId?: string;
  batchId?: string;
  productName: string;
  variationName?: string;
  hsnCode: string;
  price: number;
  quantity: number;
  discount: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  stockDeducted: boolean;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerGST?: string;
  items: BillItem[];
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  roundOff: number;
  totalAmount: number;
  paymentMethod: "cash" | "card" | "upi" | "credit" | "multiple";
  paymentDetails?: {
    cash?: number;
    card?: number;
    upi?: number;
    credit?: number;
  };
  status: "draft" | "pending" | "paid" | "cancelled" | "refunded";
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
