// hooks/useAnalytics.ts - COMPLETE ANALYTICS HOOK
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { offlineStorage } from "@/utils/offlineStorage";

interface AnalyticsData {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalSales: number;
    monthlyRevenue: number;
    lowStockProducts: number;
    pendingBills: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  recentInvoices: Array<{
    _id: string;
    id: string;
    invoiceNumber: string;
    invoiceDate: Date;
    customer: { name: string; phone: string };
    items: Array<{ name: string; quantity: number; price: number; total: number }>;
    subtotal: number;
    totalDiscount: number;
    grandTotal: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    notes: string;
    createdAt: Date;
  }>;
  recentCustomers: Array<{
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
    createdAt: Date;
  }>;
  lowStockProducts: Array<any>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    sales: number;
    profit: number;
    invoices: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  timeRange: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

// Analytics Service
class AnalyticsService {
  private baseUrl = "/api/analytics";

  private getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      const localStorageToken = localStorage.getItem("auth_token");
      if (localStorageToken) return localStorageToken;

      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      if (cookieToken) return cookieToken;

      const sessionToken = sessionStorage.getItem("auth_token");
      if (sessionToken) return sessionToken;
    }
    return null;
  }

  getAnalytics = async (timeRange: string = 'monthly'): Promise<AnalyticsData> => {
    try {
      console.log("📊 Fetching analytics data...");

      // Check if online
      const isOnline = navigator.onLine;
      if (!isOnline) {
        console.log("📱 Offline mode: Loading analytics from local storage");
        const offlineAnalytics = await offlineStorage.getItem<AnalyticsData>("analytics_data");
        if (offlineAnalytics) {
          return offlineAnalytics;
        }
        throw new Error("No offline analytics data available");
      }

      const token = this.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}?timeRange=${timeRange}`, {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to load analytics");
      }

      // Save to offline storage
      await offlineStorage.setItem("analytics_data", data.data);
      console.log("💾 Analytics saved to offline storage");

      return data.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch analytics:", error);

      // Fallback to offline data
      if (error.message.includes("Network") || error.message.includes("fetch") || !navigator.onLine) {
        console.log("📱 Network error or offline, using offline data");
        const offlineAnalytics = await offlineStorage.getItem<AnalyticsData>("analytics_data");
        if (offlineAnalytics) {
          return offlineAnalytics;
        }
      }

      // Return empty data structure if nothing works
      return {
        stats: {
          totalProducts: 0,
          totalCustomers: 0,
          totalSales: 0,
          monthlyRevenue: 0,
          lowStockProducts: 0,
          pendingBills: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        },
        recentInvoices: [],
        recentCustomers: [],
        lowStockProducts: [],
        monthlyData: [],
        categoryData: [],
        topProducts: [],
        timeRange: timeRange,
        period: {
          startDate: new Date(),
          endDate: new Date()
        }
      };
    }
  }

  // Generate report for download
  generateReport = async (timeRange: string = 'monthly'): Promise<string> => {
    try {
      const analytics = await this.getAnalytics(timeRange);
      
      const report = `
ANALYTICS REPORT
================
Period: ${timeRange}
Generated: ${new Date().toLocaleString()}

KEY METRICS:
• Total Products: ${analytics.stats.totalProducts}
• Total Customers: ${analytics.stats.totalCustomers}
• Total Sales: ${analytics.stats.totalSales} units
• Monthly Revenue: ₹${analytics.stats.monthlyRevenue.toLocaleString()}
• Low Stock Products: ${analytics.stats.lowStockProducts}
• Pending Bills: ${analytics.stats.pendingBills}
• Total Revenue: ₹${analytics.stats.totalRevenue.toLocaleString()}
• Average Order Value: ₹${analytics.stats.avgOrderValue.toLocaleString()}

TOP PRODUCTS:
${analytics.topProducts.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.sales} units - ₹${product.revenue.toLocaleString()}`
).join('\n')}

RECENT INVOICES (Last 10):
${analytics.recentInvoices.map(invoice => 
  `• ${invoice.invoiceNumber} - ${invoice.customer.name} - ₹${invoice.grandTotal.toLocaleString()} - ${invoice.paymentStatus}`
).join('\n')}

REVENUE BY CATEGORY:
${analytics.categoryData.map(category => 
  `• ${category.name}: ₹${category.value.toLocaleString()}`
).join('\n')}

MONTHLY PERFORMANCE:
${analytics.monthlyData.map(month => 
  `• ${month.month}: Revenue ₹${month.revenue.toLocaleString()}, Sales ${month.sales} units`
).join('\n')}

LOW STOCK PRODUCTS:
${analytics.lowStockProducts.length > 0 
  ? analytics.lowStockProducts.slice(0, 5).map(product => `• ${product.name}`).join('\n')
  : 'No low stock products'
}

RECENT CUSTOMERS:
${analytics.recentCustomers.length > 0
  ? analytics.recentCustomers.map(customer => `• ${customer.name} - ${customer.email} - ${customer.phone}`).join('\n')
  : 'No recent customers'
}

REPORT END
==========
      `;
      
      return report;
    } catch (error) {
      console.error("❌ Failed to generate report:", error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();

// Main analytics hook
export const useAnalytics = (initialTimeRange: string = 'monthly') => {
  const [timeRange, setTimeRange] = useState<string>(initialTimeRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  // Network status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("✅ Back online - refreshing analytics...");
      refetch();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("📱 Went offline - using cached data");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch analytics with offline support
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getAnalytics(timeRange);
      return data;
    } catch (error: any) {
      setError(error.message);
      console.error("❌ Error fetching analytics:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // React Query for data fetching
  const {
    data: analyticsData,
    refetch,
    isRefetching,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Update time range
  const updateTimeRange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    setError(null);
  };

  // Download report
  const downloadReport = async () => {
    try {
      const report = await analyticsService.generateReport(timeRange);
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (error: any) {
      console.error("❌ Failed to download report:", error);
      setError(error.message);
      return false;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    // State
    data: analyticsData,
    isLoading: loading || queryLoading || isRefetching,
    error,
    isOnline,
    timeRange,

    // Actions
    updateTimeRange,
    refetch,
    downloadReport,
    clearError,

    // Loading states
    isRefetching,

    // Helpers
    hasData: !!analyticsData && Object.keys(analyticsData).length > 0,
    isEmpty: analyticsData?.stats?.totalRevenue === 0 && analyticsData?.recentInvoices?.length === 0
  };
};

// Hook for analytics statistics only
export const useAnalyticsStats = () => {
  const { data, isLoading, error } = useAnalytics();
  
  return {
    stats: data?.stats || null,
    isLoading,
    error
  };
};

// Hook for analytics charts only
export const useAnalyticsCharts = () => {
  const { data, isLoading, error } = useAnalytics();
  
  return {
    monthlyData: data?.monthlyData || [],
    categoryData: data?.categoryData || [],
    topProducts: data?.topProducts || [],
    isLoading,
    error
  };
};

// Hook for recent activity only
export const useAnalyticsRecent = () => {
  const { data, isLoading, error } = useAnalytics();
  
  return {
    recentInvoices: data?.recentInvoices || [],
    recentCustomers: data?.recentCustomers || [],
    lowStockProducts: data?.lowStockProducts || [],
    isLoading,
    error
  };
};