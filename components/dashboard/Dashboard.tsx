"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useSubscription } from "@/hooks/useSubscription";
import StatsCards from "./StatsChart";
import SalesChart from "./SalesChart";
import TopProductsChart from "./TopProductsChart";
import LowStockAlert from "./LowStockAlert";
import EmployeeStats from "./EmployeeStats";
import ProjectProgress from "./ProjectProgress";
import EventCalendar from "./EventCalendar";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import { DashboardStats, SalesChartData, ProductSalesData } from "@/types";

// Helper function to safely fetch and parse data
const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, { 
      credentials: "include",
      ...options 
    });
    
    if (!res.ok) {
      console.warn(`API call failed: ${url}`, res.status);
      return { success: false, data: null };
    }
    
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return { success: false, data: null, error };
  }
};

// Helper to extract array from response
const extractArrayFromResponse = (response: any): any[] => {
  if (!response) return [];
  
  if (Array.isArray(response)) {
    return response;
  }
  
  // Check common response structures
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  if (response.employees && Array.isArray(response.employees)) {
    return response.employees;
  }
  
  if (response.products && Array.isArray(response.products)) {
    return response.products;
  }
  
  if (response.customers && Array.isArray(response.customers)) {
    return response.customers;
  }
  
  if (response.orders && Array.isArray(response.orders)) {
    return response.orders;
  }
  
  if (response.projects && Array.isArray(response.projects)) {
    return response.projects;
  }
  
  if (response.events && Array.isArray(response.events)) {
    return response.events;
  }
  
  if (response.items && Array.isArray(response.items)) {
    return response.items;
  }
  
  // If response is an object with array-like structure
  if (typeof response === 'object' && !Array.isArray(response)) {
    const values = Object.values(response);
    if (values.length > 0 && Array.isArray(values[0])) {
      return values[0] as any[];
    }
  }
  
  return [];
};

// Helper to safely filter arrays
const safeFilter = (array: any[] | null | undefined, condition: (item: any) => boolean): any[] => {
  if (!array || !Array.isArray(array)) return [];
  try {
    return array.filter(condition);
  } catch (error) {
    console.error("Error filtering array:", error);
    return [];
  }
};

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { user: contextUser, isLoading: userLoading } = useUser();
  const { products, isLoading: productsLoading } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();
  const {
    subscription,
    usage,
    isLoading: subscriptionLoading,
  } = useSubscription();

  const user = contextUser || authUser;

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    lowStockProducts: 0,
    pendingBills: 0,
    totalEmployees: 0,
    presentEmployees: 0,
    activeProjects: 0,
    upcomingEvents: 0,
  });

  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductSalesData[]>([]);
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "year" | "quarter"
  >("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDisplayName = () => {
    if (!user) return "User";

    if (user.name) {
      return user.name;
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        statsResult,
        salesResult,
        ordersResult,
        employeesResult,
        projectsResult,
        eventsResult,
      ] = await Promise.all([
        safeFetch("/api/dashboard/stats"),
        safeFetch(`/api/dashboard/sales?range=${timeRange}&includeDrafts=true`),
        safeFetch("/api/orders?limit=100"),
        safeFetch("/api/employees"),
        safeFetch("/api/projects"),
        safeFetch("/api/events"),
      ]);

      // Initialize stats with fallback values
      let statsData: DashboardStats = {
        totalProducts: products.length || 0,
        totalCustomers: customers.length || 0,
        totalSales: 0,
        monthlyRevenue: 0,
        lowStockProducts: 0,
        pendingBills: 0,
        totalEmployees: 0,
        presentEmployees: 0,
        activeProjects: 0,
        upcomingEvents: 0,
      };

      // Merge stats from API if available
      if (statsResult.success && statsResult.data) {
        const apiStats = statsResult.data;
        statsData = {
          ...statsData,
          ...(typeof apiStats.totalProducts === 'number' && { totalProducts: apiStats.totalProducts }),
          ...(typeof apiStats.totalCustomers === 'number' && { totalCustomers: apiStats.totalCustomers }),
          ...(typeof apiStats.totalSales === 'number' && { totalSales: apiStats.totalSales }),
          ...(typeof apiStats.monthlyRevenue === 'number' && { monthlyRevenue: apiStats.monthlyRevenue }),
          ...(typeof apiStats.lowStockProducts === 'number' && { lowStockProducts: apiStats.lowStockProducts }),
          ...(typeof apiStats.pendingBills === 'number' && { pendingBills: apiStats.pendingBills }),
          ...(typeof apiStats.totalEmployees === 'number' && { totalEmployees: apiStats.totalEmployees }),
          ...(typeof apiStats.presentEmployees === 'number' && { presentEmployees: apiStats.presentEmployees }),
          ...(typeof apiStats.activeProjects === 'number' && { activeProjects: apiStats.activeProjects }),
          ...(typeof apiStats.upcomingEvents === 'number' && { upcomingEvents: apiStats.upcomingEvents }),
        };
      }

      // Process sales data
      let salesChartData: SalesChartData[] = [];
      if (salesResult.success && salesResult.data) {
        salesChartData = extractArrayFromResponse(salesResult.data);
      }

      // Process employees data safely
      let employeesData: any[] = [];
      if (employeesResult.success && employeesResult.data) {
        employeesData = extractArrayFromResponse(employeesResult.data);
        statsData.totalEmployees = employeesData.length;
        
        // Count active employees with multiple possible status indicators
        statsData.presentEmployees = safeFilter(employeesData, (emp: any) => 
          emp.status === "active" || 
          emp.status === "present" || 
          emp.isActive === true ||
          emp.attendance?.status === "present"
        ).length;
      }

      // Process events data safely
      let eventsData: any[] = [];
      if (eventsResult.success && eventsResult.data) {
        eventsData = extractArrayFromResponse(eventsResult.data);
        
        const today = new Date(); // CORRECTED: new Date() instead of newDate()
        statsData.upcomingEvents = safeFilter(eventsData, (event: any) => {
          try {
            const eventDate = new Date(event.startDate || event.date || event.createdAt);
            return eventDate > today;
          } catch {
            return false;
          }
        }).length;
      }

      // Process projects data safely
      let projectsData: any[] = [];
      if (projectsResult.success && projectsResult.data) {
        projectsData = extractArrayFromResponse(projectsResult.data);
        
        statsData.activeProjects = safeFilter(projectsData, (project: any) => 
          project.status === "active" || 
          project.status === "in-progress" ||
          project.isActive === true
        ).length;
      }

      // Calculate low stock products
      const lowStockCount = safeFilter(products, (product: any) => {
        try {
          const totalStock = product.variations?.reduce(
            (sum: number, variation: any) => sum + (Number(variation.stock) || 0),
            0,
          ) || (Number(product.stock) || 0);
          return totalStock < 10;
        } catch {
          return false;
        }
      }).length;

      statsData.lowStockProducts = lowStockCount;

      // Process orders for sales data
      let ordersData: any[] = [];
      if (ordersResult.success && ordersResult.data) {
        ordersData = extractArrayFromResponse(ordersResult.data);
      }

      // Calculate total sales and revenue
      let totalSales = 0;
      let totalRevenue = 0;
      const productSalesMap = new Map<
        string,
        { sales: number; revenue: number; productId?: string }
      >();

      safeFilter(ordersData, (order: any) => 
        order && typeof order === 'object'
      ).forEach((order: any) => {
        try {
          const orderItems = extractArrayFromResponse(order.items || order.orderItems);
          
          orderItems.forEach((item: any) => {
            if (!item) return;
            
            const productName = item.name || item.productName || "Unknown Product";
            const productId = item.productId || item.id;
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const revenue = quantity * price;

            if (quantity > 0 && price > 0) {
              totalSales += quantity;
              totalRevenue += revenue;

              const key = productId || productName;
              if (productSalesMap.has(key)) {
                const existing = productSalesMap.get(key)!;
                productSalesMap.set(key, {
                  ...existing,
                  sales: existing.sales + quantity,
                  revenue: existing.revenue + revenue,
                });
              } else {
                productSalesMap.set(key, {
                  sales: quantity,
                  revenue: revenue,
                  productId: productId,
                });
              }
            }
          });
        } catch (error) {
          console.error("Error processing order:", error);
        }
      });

      statsData.totalSales = totalSales;
      statsData.monthlyRevenue = totalRevenue;

      // Prepare top products data
      const topProductsData = Array.from(productSalesMap.entries())
        .map(([productName, data]) => ({
          productName: data.productId ? `${productName} (${data.productId})` : productName,
          sales: data.sales,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setDashboardStats(statsData);
      setSalesData(salesChartData);
      setTopProducts(topProductsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");

      // Set fallback values
      const lowStockCount = safeFilter(products, (product: any) => {
        try {
          const totalStock = product.variations?.reduce(
            (sum: number, variation: any) => sum + (Number(variation.stock) || 0),
            0,
          ) || (Number(product.stock) || 0);
          return totalStock < 10;
        } catch {
          return false;
        }
      }).length;

      setDashboardStats((prev) => ({
        ...prev,
        totalProducts: products.length || 0,
        totalCustomers: customers.length || 0,
        lowStockProducts: lowStockCount,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (
    range: "week" | "month" | "year" | "quarter",
  ) => {
    setTimeRange(range);
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      !authLoading &&
      !userLoading &&
      !productsLoading &&
      !customersLoading
    ) {
      fetchDashboardData();
    }
  }, [
    isAuthenticated,
    authLoading,
    userLoading,
    productsLoading,
    customersLoading,
    timeRange,
  ]);

  if (authLoading || userLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Please log in to view the dashboard.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        pt: { xs: 0, sm: 0, md: 0 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? "h5" : isTablet ? "h4" : "h4"}
          gutterBottom
          fontWeight="bold"
          sx={{
            mt: 0,
            mb: 0.5,
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Welcome, {getDisplayName()}! 👋
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Here's what's happening with your business today.
        </Typography>

        {/* Subscription Status */}
        {subscription && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight="medium"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {subscription.plan.toUpperCase()} PLAN
            </Typography>
            {subscription.status === "trial" && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                • Trial ends in {subscription.daysRemaining} days
              </Typography>
            )}
            {usage && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                • {usage.invoices || 0}/{subscription.limits?.invoices || 0}{" "}
                invoices used
              </Typography>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Low Stock Alert */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <LowStockAlert />
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <StatsCards
          stats={dashboardStats}
          salesData={salesData}
          topProducts={topProducts}
        />
      </Box>

      {/* Charts and Tables Grid */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 3 },
        }}
      >
        {/* Row 1: Charts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {/* Sales Chart */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              order: { xs: 1, md: 1 },
            }}
          >
            <SalesChart
              data={salesData}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </Box>

          {/* Top Products */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              order: { xs: 2, md: 2 },
            }}
          >
            <TopProductsChart data={topProducts} />
          </Box>
        </Box>

        {/* Row 2: Quick Info Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3 },
          }}
        >
          {/* Quick Actions */}
          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              minWidth: 0,
            }}
          >
            <QuickActions />
          </Box>

          {/* Employee Stats */}
          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              minWidth: 0,
            }}
          >
            <EmployeeStats
              totalEmployees={dashboardStats.totalEmployees}
              presentEmployees={dashboardStats.presentEmployees}
            />
          </Box>

          {/* Project Progress */}
          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              minWidth: 0,
            }}
          >
            <ProjectProgress activeProjects={dashboardStats.activeProjects} />
          </Box>

          {/* Upcoming Events */}
          <Box
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 12px)",
              },
              minWidth: 0,
            }}
          >
            <EventCalendar upcomingEvents={dashboardStats.upcomingEvents} />
          </Box>
        </Box>

        {/* Row 3: Recent Activity */}
        <Box
          sx={{
            flex: "1 1 100%",
            minWidth: 0,
          }}
        >
          <RecentActivity />
        </Box>
      </Box>
    </Box>
  );
}