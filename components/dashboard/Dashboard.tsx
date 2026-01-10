"use client";

import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  useTheme,
  useMediaQuery
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

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
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
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDisplayName = () => {
    if (!user) return 'User'
    
    if (user.name) {
      return user.name
    }
    
    if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'User'
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsRes,
        salesRes,
        ordersRes,
        employeesRes,
        projectsRes,
        eventsRes,
      ] = await Promise.all([
        fetch("/api/dashboard/stats", { credentials: "include" }),
        fetch(`/api/dashboard/sales?range=${timeRange}&includeDrafts=true`, {
          credentials: "include",
        }),
        fetch("/api/orders?limit=100", { credentials: "include" }),
        fetch("/api/employees", { credentials: "include" }),
        fetch("/api/projects", { credentials: "include" }),
        fetch("/api/events", { credentials: "include" }),
      ]);

      let statsData = {
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalSales: 0,
        monthlyRevenue: 0,
        lowStockProducts: 0,
        pendingBills: 0,
        totalEmployees: 0,
        presentEmployees: 0,
        activeProjects: 0,
        upcomingEvents: 0,
      };

      if (statsRes.ok) {
        const stats = await statsRes.json();
        statsData = { ...statsData, ...stats };
      }

      let salesChartData: SalesChartData[] = [];
      if (salesRes.ok) {
        salesChartData = await salesRes.json();
      }

      let ordersData = [];
      if (ordersRes.ok) {
        ordersData = await ordersRes.json();
      }

      let employeesData = [];
      if (employeesRes.ok) {
        employeesData = await employeesRes.json();
        statsData.totalEmployees = employeesData.length || 0;
        statsData.presentEmployees =
          employeesData?.filter((emp: any) => emp.status === "active").length || 0;
      }

      let eventsData = [];
      if (eventsRes.ok) {
        eventsData = await eventsRes.json();
        const today = new Date();
        statsData.upcomingEvents =
          eventsData?.filter((event: any) => new Date(event.startDate) > today)
            .length || 0;
      }

      const lowStockCount = products?.filter((product) => {
        const totalStock =
          product.variations?.reduce(
            (sum: number, variation: any) => sum + (variation.stock || 0),
            0
          ) || 0;
        return totalStock < 10;
      }).length;

      statsData.lowStockProducts = lowStockCount || 0;

      let totalSales = 0;
      let totalRevenue = 0;
      const productSalesMap = new Map<string, { sales: number; revenue: number }>();
      
      if (Array.isArray(ordersData)) {
        ordersData.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const productName = item.name || "Unknown Product";
              const quantity = item.quantity || 0;
              const price = item.price || 0;
              const revenue = quantity * price;
              
              totalSales += quantity;
              totalRevenue += revenue;

              if (productSalesMap.has(productName)) {
                const existing = productSalesMap.get(productName)!;
                productSalesMap.set(productName, {
                  sales: existing.sales + quantity,
                  revenue: existing.revenue + revenue,
                });
              } else {
                productSalesMap.set(productName, {
                  sales: quantity,
                  revenue: revenue,
                });
              }
            });
          }
        });
      }

      statsData.totalSales = totalSales;
      statsData.monthlyRevenue = totalRevenue;

      const topProductsData = Array.from(productSalesMap.entries())
        .map(([productName, data]) => ({
          productName,
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

      const lowStockCount = products?.filter((product) => {
        const totalStock =
          product.variations?.reduce(
            (sum: number, variation: any) => sum + (variation.stock || 0),
            0
          ) || 0;
        return totalStock < 10;
      }).length;

      setDashboardStats((prev) => ({
        ...prev,
        totalProducts: products.length,
        totalCustomers: customers.length,
        lowStockProducts: lowStockCount || 0,
      }));
    } finally {
      setLoading(false);
    }
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

  const handleTimeRangeChange = (range: "week" | "month" | "year") => {
    setTimeRange(range);
  };

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
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 } 
    }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : isTablet ? "h4" : "h4"} 
          gutterBottom 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
        >
          Welcome back, {getDisplayName()}! 👋
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Here's what's happening with your business today.
        </Typography>

        {/* Subscription Status */}
        {subscription && (
          <Box sx={{ 
            mt: 1, 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            flexWrap: 'wrap' 
          }}>
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight="medium"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {subscription.plan.toUpperCase()} PLAN
            </Typography>
            {subscription.status === "trial" && (
              <Typography 
                variant="caption" 
                color="warning.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                • Trial ends in {subscription.daysRemaining} days
              </Typography>
            )}
            {usage && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
      }}>
        {/* Row 1: Charts */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3 },
        }}>
          {/* Sales Chart */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            order: { xs: 1, md: 1 }
          }}>
            <SalesChart
              data={salesData}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </Box>

          {/* Top Products */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            order: { xs: 2, md: 2 }
          }}>
            <TopProductsChart data={topProducts} />
          </Box>
        </Box>

        {/* Row 2: Quick Info Cards */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
        }}>
          {/* Quick Actions */}
          <Box sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
            minWidth: 0,
          }}>
            <QuickActions />
          </Box>

          {/* Employee Stats */}
          <Box sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
            minWidth: 0,
          }}>
            <EmployeeStats
              totalEmployees={dashboardStats.totalEmployees}
              presentEmployees={dashboardStats.presentEmployees}
            />
          </Box>

          {/* Project Progress */}
          <Box sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
            minWidth: 0,
          }}>
            <ProjectProgress activeProjects={dashboardStats.activeProjects} />
          </Box>

          {/* Upcoming Events */}
          <Box sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
            minWidth: 0,
          }}>
            <EventCalendar upcomingEvents={dashboardStats.upcomingEvents} />
          </Box>
        </Box>

        {/* Row 3: Recent Activity */}
        <Box sx={{ 
          flex: '1 1 100%',
          minWidth: 0,
        }}>
          <RecentActivity />
        </Box>
      </Box>
    </Box>
  );
}