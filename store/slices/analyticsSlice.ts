// store/slices/analyticsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ============ TYPES ============

export interface Stats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  monthlyRevenue: number;
  lowStockProducts: number;
  pendingBills: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface RecentInvoice {
  _id: string;
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: {
    name: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string;
  createdAt: string;
}

export interface RecentCustomer {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  [key: string]: any;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  sales: number;
  profit: number;
  invoices: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface Period {
  startDate: string;
  endDate: string;
}

export interface AnalyticsData {
  stats: Stats;
  recentInvoices: RecentInvoice[];
  recentCustomers: RecentCustomer[];
  lowStockProducts: LowStockProduct[];
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  topProducts: TopProduct[];
  timeRange: string;
  period: Period;
}

export interface AnalyticsState {
  // Analytics data
  analyticsData: AnalyticsData | null;
  
  // Individual components for easier access
  stats: Stats | null;
  recentInvoices: RecentInvoice[];
  recentCustomers: RecentCustomer[];
  lowStockProducts: LowStockProduct[];
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  topProducts: TopProduct[];
  
  // Time range
  timeRange: string;
  customDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  
  // UI States
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  lastFetched: string | null;
}

const initialState: AnalyticsState = {
  analyticsData: null,
  stats: null,
  recentInvoices: [],
  recentCustomers: [],
  lowStockProducts: [],
  monthlyData: [],
  categoryData: [],
  topProducts: [],
  timeRange: 'monthly',
  customDateRange: {
    startDate: null,
    endDate: null,
  },
  loading: false,
  error: null,
  successMessage: null,
  lastFetched: null,
};

// ============ ASYNC THUNKS ============

// Fetch analytics data
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (params: {
    timeRange?: string;
    startDate?: string;
    endDate?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.timeRange) queryParams.append('timeRange', params.timeRange);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await axios.get(`/api/analytics?${queryParams.toString()}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics data');
    }
  }
);

// Fetch analytics with weekly time range
export const fetchWeeklyAnalytics = createAsyncThunk(
  'analytics/fetchWeeklyAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analytics?timeRange=weekly');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch weekly analytics');
    }
  }
);

// Fetch analytics with monthly time range
export const fetchMonthlyAnalytics = createAsyncThunk(
  'analytics/fetchMonthlyAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analytics?timeRange=monthly');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch monthly analytics');
    }
  }
);

// Fetch analytics with quarterly time range
export const fetchQuarterlyAnalytics = createAsyncThunk(
  'analytics/fetchQuarterlyAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analytics?timeRange=quarterly');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch quarterly analytics');
    }
  }
);

// Fetch analytics with yearly time range
export const fetchYearlyAnalytics = createAsyncThunk(
  'analytics/fetchYearlyAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analytics?timeRange=yearly');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch yearly analytics');
    }
  }
);

// Fetch analytics with custom date range
export const fetchCustomAnalytics = createAsyncThunk(
  'analytics/fetchCustomAnalytics',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/analytics?timeRange=custom&startDate=${startDate}&endDate=${endDate}`);
      return { data: response.data, startDate, endDate };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch custom analytics');
    }
  }
);

// Export analytics data as CSV
export const exportAnalyticsCSV = createAsyncThunk(
  'analytics/exportAnalyticsCSV',
  async (type: 'invoices' | 'customers' | 'products' | 'full' = 'full', { rejectWithValue }) => {
    try {
      // This would typically trigger a file download
      // For now, we'll just return success
      return { type, message: `${type} report exported successfully` };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to export analytics');
    }
  }
);

// ============ SLICE ============

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearAnalyticsSuccess: (state) => {
      state.successMessage = null;
    },
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload;
    },
    setCustomDateRange: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.customDateRange = action.payload;
    },
    clearCustomDateRange: (state) => {
      state.customDateRange = {
        startDate: null,
        endDate: null,
      };
    },
    resetAnalyticsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH ANALYTICS ============
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data;
        state.stats = action.payload.data.stats;
        state.recentInvoices = action.payload.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.monthlyData || [];
        state.categoryData = action.payload.data.categoryData || [];
        state.topProducts = action.payload.data.topProducts || [];
        state.timeRange = action.payload.data.timeRange || state.timeRange;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH WEEKLY ANALYTICS ============
      .addCase(fetchWeeklyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data;
        state.stats = action.payload.data.stats;
        state.recentInvoices = action.payload.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.monthlyData || [];
        state.categoryData = action.payload.data.categoryData || [];
        state.topProducts = action.payload.data.topProducts || [];
        state.timeRange = 'weekly';
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH MONTHLY ANALYTICS ============
      .addCase(fetchMonthlyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data;
        state.stats = action.payload.data.stats;
        state.recentInvoices = action.payload.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.monthlyData || [];
        state.categoryData = action.payload.data.categoryData || [];
        state.topProducts = action.payload.data.topProducts || [];
        state.timeRange = 'monthly';
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH QUARTERLY ANALYTICS ============
      .addCase(fetchQuarterlyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuarterlyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data;
        state.stats = action.payload.data.stats;
        state.recentInvoices = action.payload.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.monthlyData || [];
        state.categoryData = action.payload.data.categoryData || [];
        state.topProducts = action.payload.data.topProducts || [];
        state.timeRange = 'quarterly';
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchQuarterlyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH YEARLY ANALYTICS ============
      .addCase(fetchYearlyAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearlyAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data;
        state.stats = action.payload.data.stats;
        state.recentInvoices = action.payload.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.monthlyData || [];
        state.categoryData = action.payload.data.categoryData || [];
        state.topProducts = action.payload.data.topProducts || [];
        state.timeRange = 'yearly';
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchYearlyAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ FETCH CUSTOM ANALYTICS ============
      .addCase(fetchCustomAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload.data.data;
        state.stats = action.payload.data.data.stats;
        state.recentInvoices = action.payload.data.data.recentInvoices || [];
        state.recentCustomers = action.payload.data.data.recentCustomers || [];
        state.lowStockProducts = action.payload.data.data.lowStockProducts || [];
        state.monthlyData = action.payload.data.data.monthlyData || [];
        state.categoryData = action.payload.data.data.categoryData || [];
        state.topProducts = action.payload.data.data.topProducts || [];
        state.timeRange = 'custom';
        state.customDateRange = {
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
        };
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchCustomAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============ EXPORT ANALYTICS CSV ============
      .addCase(exportAnalyticsCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportAnalyticsCSV.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || `${action.payload.type} report exported successfully`;
      })
      .addCase(exportAnalyticsCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============ SELECTORS ============

export const selectAnalyticsStats = (state: { analytics: AnalyticsState }) => state.analytics.stats;
export const selectRecentInvoices = (state: { analytics: AnalyticsState }) => state.analytics.recentInvoices;
export const selectRecentCustomers = (state: { analytics: AnalyticsState }) => state.analytics.recentCustomers;
export const selectLowStockProducts = (state: { analytics: AnalyticsState }) => state.analytics.lowStockProducts;
export const selectMonthlyData = (state: { analytics: AnalyticsState }) => state.analytics.monthlyData;
export const selectCategoryData = (state: { analytics: AnalyticsState }) => state.analytics.categoryData;
export const selectTopProducts = (state: { analytics: AnalyticsState }) => state.analytics.topProducts;
export const selectTimeRange = (state: { analytics: AnalyticsState }) => state.analytics.timeRange;
export const selectAnalyticsLoading = (state: { analytics: AnalyticsState }) => state.analytics.loading;
export const selectAnalyticsError = (state: { analytics: AnalyticsState }) => state.analytics.error;
export const selectLastFetched = (state: { analytics: AnalyticsState }) => state.analytics.lastFetched;

export const {
  clearAnalyticsError,
  clearAnalyticsSuccess,
  setTimeRange,
  setCustomDateRange,
  clearCustomDateRange,
  resetAnalyticsState,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;