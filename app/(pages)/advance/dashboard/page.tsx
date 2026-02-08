"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab, alpha } from "@mui/material";
import {
  Refresh,
  Download,
  Settings,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useAdvanceThemeContext } from "@/contexts/AdvanceThemeContexts";

// Components
import DashboardHeader from "@/components/advance/dashboard/DashboardHeader";
import QuickStatsGrid from "@/components/advance/dashboard/QuickStatsGrid";
import PerformanceChart from "@/components/advance/dashboard/PerformanceChart";
import GoalsProgress from "@/components/advance/dashboard/GoalsProgress";
import ProductivityMetrics from "@/components/advance/dashboard/ProductivityMetrics";
import InsightsPanel from "@/components/advance/dashboard/InsightsPanel";
import RecentActivity from "@/components/advance/dashboard/RecentActivity";
import QuickActionsPanel from "@/components/advance/dashboard/QuickActionsPanel";
import SystemStatus from "@/components/advance/dashboard/SystemStatus";

// Google colors
const googleColors = {
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC04",
  red: "#EA4335",

  light: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    textPrimary: "#202124",
    textSecondary: "#5F6368",
    border: "#DADCE0",
    card: "#FFFFFF",
    chipBackground: "#F1F3F4",
    header: "#FFFFFF",
    sidebar: "#FFFFFF",
    hover: "#F8F9FA",
    active: "#E8F0FE",
  },

  dark: {
    background: "#202124",
    surface: "#303134",
    textPrimary: "#E8EAED",
    textSecondary: "#9AA0A6",
    border: "#3C4043",
    card: "#303134",
    chipBackground: "#3C4043",
    header: "#303134",
    sidebar: "#202124",
    hover: "#3C4043",
    active: "#5F6368",
  },
};

export default function AdvanceDashboardPage() {
  const { currentScheme, mode } = useAdvanceThemeContext();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("monthly");

  const currentColors =
    mode === "dark" ? googleColors.dark : googleColors.light;

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // In app/(pages)/advance/dashboard/page.tsx
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/advance/dashboard?timeRange=${timeRange}`,
      );
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        // Provide fallback data if API fails
        setDashboardData(getFallbackDashboardData());
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Provide fallback data on error
      setDashboardData(getFallbackDashboardData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data function
  const getFallbackDashboardData = () => {
    return {
      businessMetrics: {
        totalRevenue: 1250000,
        activeUsers: 5420,
        conversionRate: 3.2,
        avgOrderValue: 125,
      },
      engagementMetrics: {
        productivityScore: 78,
        avgSessionLength: 12.5,
        streakDays: 15,
        mostUsedFeature: "Analytics Dashboard",
        timeDistribution: {
          analytics: 3.5,
          reports: 2.0,
          settings: 1.5,
          other: 1.0,
        },
      },
      recentActivity: [
        {
          type: "success",
          title: "System Updated",
          description: "Dashboard refreshed successfully",
          time: "Just now",
        },
        {
          type: "info",
          title: "New User Registered",
          description: "John Doe joined the platform",
          time: "5 min ago",
        },
        {
          type: "sale",
          title: "New Sale",
          description: "Order #1234 completed",
          time: "1 hour ago",
        },
      ],
      monthlyTrends: [
        { month: "Jan", revenue: 100000, users: 1200 },
        { month: "Feb", revenue: 150000, users: 1500 },
        { month: "Mar", revenue: 200000, users: 1800 },
        { month: "Apr", revenue: 250000, users: 2100 },
        { month: "May", revenue: 300000, users: 2400 },
        { month: "Jun", revenue: 350000, users: 2700 },
      ],
      goals: {
        currentDailyProgress: 4.2,
        dailyScreenTimeGoal: 8,
        revenueGoal: {
          current: 250000,
          target: 500000,
          progress: 50,
        },
        customerGoal: {
          current: 150,
          target: 300,
          progress: 50,
        },
      },
      insights: [
        {
          type: "success",
          title: "Revenue Growth",
          message: "Your revenue has increased by 25% this month",
          suggestion: "Consider scaling successful campaigns",
        },
        {
          type: "warning",
          title: "User Engagement",
          message: "Active users decreased by 5% this week",
          suggestion: "Launch re-engagement campaign",
        },
        {
          type: "info",
          title: "New Feature",
          message: "Advanced analytics feature is now available",
          suggestion: "Explore new reporting capabilities",
        },
      ],
      summary: {
        quickStats: [
          {
            title: "Total Revenue",
            value: "₹1.25M",
            change: 25,
            icon: "📈",
          },
          {
            title: "Active Users",
            value: "5.4K",
            change: 12,
            icon: "👥",
          },
          {
            title: "Conversion Rate",
            value: "3.2%",
            change: 8,
            icon: "🎯",
          },
          {
            title: "Avg Order Value",
            value: "₹125",
            change: 15,
            icon: "💰",
          },
        ],
      },
    };
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: currentColors.background,
          transition: "background-color 0.3s ease",
        }}
      >
        <Box textAlign="center">
          <DashboardIcon
            sx={{ fontSize: 48, color: googleColors.blue, mb: 2 }}
          />
          <Typography variant="h6" color={currentColors.textSecondary}>
            Loading Advanced Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: currentColors.background,
          minHeight: "100vh",
          color: currentColors.textPrimary,
          transition: "background-color 0.3s ease",
        }}
      >
        <Typography variant="h6" color={currentColors.textSecondary}>
          No dashboard data available
        </Typography>
        <Button
          onClick={fetchDashboardData}
          sx={{
            mt: 2,
            backgroundColor: googleColors.blue,
            color: "white",
            "&:hover": {
              backgroundColor: "#3367D6",
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const {
    businessMetrics,
    engagementMetrics,
    recentActivity,
    monthlyTrends,
    goals,
    insights,
    summary,
  } = dashboardData;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: currentColors.background,
        minHeight: "100vh",
        color: currentColors.textPrimary,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <DashboardHeader
        title="🚀 Advance Dashboard"
        subtitle="Real-time insights & performance analytics"
        currentColors={currentColors}
        googleColors={googleColors}
        mode={mode}
        // alpha={alpha}
        onRefresh={handleRefresh}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Quick Stats Grid */}
      <QuickStatsGrid
        stats={summary?.quickStats || []}
        currentColors={currentColors}
        googleColors={googleColors}
        // alpha={alpha}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        {/* Left Column - Charts & Metrics */}
        <Box
          sx={{
            flex: { lg: "2 1 0%" },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Performance Overview Chart */}
          <PerformanceChart
            monthlyTrends={monthlyTrends}
            currentColors={currentColors}
            googleColors={googleColors}
            mode={mode}
            alpha={alpha}
          />

          {/* Goals & Progress */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            {/* Daily Goals Card */}
            <GoalsProgress
              goals={goals}
              currentColors={currentColors}
              googleColors={googleColors}
              mode={mode}
              alpha={alpha}
            />

            {/* Productivity Metrics Card */}
            <ProductivityMetrics
              engagementMetrics={engagementMetrics}
              currentColors={currentColors}
              googleColors={googleColors}
              mode={mode}
            />
          </Box>

          {/* Insights & Recommendations */}
          {insights?.length > 0 && (
            <InsightsPanel
              insights={insights}
              currentColors={currentColors}
              googleColors={googleColors}
              mode={mode}
              alpha={alpha}
            />
          )}
        </Box>

        {/* Right Column - Activity & Details */}
        <Box
          sx={{
            flex: { lg: "1 1 0%" },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minWidth: { lg: "300px" },
          }}
        >
          {/* Recent Activity */}
          <RecentActivity
            activities={recentActivity}
            currentColors={currentColors}
            googleColors={googleColors}
            mode={mode}
            // alpha={alpha}
          />

          {/* Quick Actions */}
          <QuickActionsPanel
            currentColors={currentColors}
            googleColors={googleColors}
            mode={mode}
            // alpha={alpha}
          />

          {/* System Status */}
          <SystemStatus
            currentColors={currentColors}
            googleColors={googleColors}
            mode={mode}
            alpha={alpha}
          />
        </Box>
      </Box>
    </Box>
  );
}
