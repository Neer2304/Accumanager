// app/(pages)/advance/subscription-analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Divider,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  alpha,
  useMediaQuery,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import {
  TrendingUp,
  People,
  Warning as WarningIcon,
  CheckCircle,
  Refresh,
  Download,
  BarChart,
  Timeline,
  Insights,
  Home,
  ShowChart,
  AttachMoney,
  ShoppingCart,
  AccountBalance,
  TrendingDown,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  Payment,
  CalendarToday,
  Category,
  Construction,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import Link from 'next/link'

// Import components
import SubscriptionStatus from '@/components/advance/analytics/SubscriptionStatus'
import MetricCard from '@/components/advance/analytics/MetricCard'
import RevenueTrend from '@/components/advance/analytics/RevenueTrend'
import HealthAnalysis from '@/components/advance/analytics/HealthAnalysis'
import PaymentMethodTable from '@/components/advance/analytics/PaymentMethodTable'
import RevenueForecast from '@/components/advance/analytics/RevenueForecast'
import CustomerSegments from '@/components/advance/analytics/CustomerSegments'
import RetentionMetrics from '@/components/advance/analytics/RetentionMetrics'
import CustomerAcquisition from '@/components/advance/analytics/CustomerAcquisition'
import SubscriptionMetrics from '@/components/advance/analytics/SubscriptionMetrics'
import RevenueMetrics from '@/components/advance/analytics/RevenueMetrics'
import AnalyticsSummary from '@/components/advance/analytics/AnalyticsSummary'

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

// Type definitions (same as before)
interface RevenueByMethod {
  method: string;
  amount: number;
  percentage: number;
}

interface MonthlyTrendItem {
  month: string;
  revenue: number;
  customers: number;
  orders: number;
  subscriptionActive: boolean;
  avgOrderValue: number;
}

interface ForecastItem {
  month: string;
  year: number;
  revenue: number;
  customers: number;
  growth: number;
  subscriptionValue: number;
}

interface SubscriptionData {
  currentSubscription: {
    plan: string
    status: string
    currentPeriodEnd: string
    autoRenew: boolean
    features?: string[]
    trialEndsAt?: string
  }
  subscriptionMetrics: {
    mrr: number
    arr: number
    totalPaid: number
    monthlyAmount: number
    daysRemaining: number
    trialDaysRemaining: number
    isTrial: boolean
    totalOrders: number
  }
  customerMetrics: {
    totalCustomers: number
    activeCustomers: number
    newCustomers: number
    totalOrders: number
    totalSpent: number
    avgCustomerValue: number
    customerSegments: Record<string, number>
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyRevenue: number
    avgOrderValue: number
    revenueGrowth: number
    revenueByMethod: RevenueByMethod[]
    totalOrders: number
  }
  retentionMetrics: {
    retentionRate: string
    churnRisk: string
    churnProbability: number
    customerLifetime: number
    repeatPurchaseRate: string
    avgDaysBetweenOrders: number
    totalPurchases: number
  }
  healthMetrics: {
    status: string
    score: number
    issues: string[]
    recommendations: string[]
  }
  monthlyTrend: MonthlyTrendItem[]
  forecast: ForecastItem[]
  period: {
    startDate: string
    endDate: string
  }
}

// Mock data (same as before)
const mockRevenueData = [
  { month: 'Jan', revenue: 120000, customers: 450, orders: 120 },
  { month: 'Feb', revenue: 150000, customers: 520, orders: 135 },
  { month: 'Mar', revenue: 180000, customers: 580, orders: 155 },
  { month: 'Apr', revenue: 220000, customers: 650, orders: 180 },
  { month: 'May', revenue: 250000, customers: 720, orders: 210 },
  { month: 'Jun', revenue: 280000, customers: 800, orders: 240 },
];

const mockCustomerSegments = [
  { segment: 'Premium', count: 150, value: 75000 },
  { segment: 'Regular', count: 450, value: 45000 },
  { segment: 'New', count: 200, value: 20000 },
];

const mockRevenueByMethod = [
  { method: 'Credit Card', amount: 150000, percentage: 45 },
  { method: 'UPI', amount: 120000, percentage: 36 },
  { method: 'Net Banking', amount: 40000, percentage: 12 },
  { method: 'Wallet', amount: 20000, percentage: 6 },
  { method: 'Cash', amount: 5000, percentage: 1 },
];

export default function SubscriptionAnalyticsPage() {
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('monthly');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue;
  const buttonColor = mode === 'dark' ? googleColors.red : googleColors.blue;

  useEffect(() => {
    fetchAllData();
    
    let intervalId: NodeJS.Timeout;
    if (autoRefresh) {
      intervalId = setInterval(fetchAllData, 5 * 60 * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeRange, autoRefresh]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch subscription data
      const subscriptionResponse = await fetch(`/api/advance/analytics/subscription?timeRange=${timeRange}`, {
        credentials: 'include',
      });

      if (!subscriptionResponse.ok) {
        if (subscriptionResponse.status === 401) {
          throw new Error('Please log in again');
        } else if (subscriptionResponse.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Error ${subscriptionResponse.status}: ${subscriptionResponse.statusText}`);
        }
      }

      const subscriptionJson = await subscriptionResponse.json();
      
      if (subscriptionJson.success) {
        setSubscriptionData(subscriptionJson.data);
      } else {
        // Use mock data if API fails
        setSubscriptionData({
          currentSubscription: {
            plan: 'premium',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            autoRenew: true,
            features: ['Advanced Analytics', 'Priority Support', 'Custom Reports']
          },
          subscriptionMetrics: {
            mrr: 25000,
            arr: 300000,
            totalPaid: 150000,
            monthlyAmount: 25000,
            daysRemaining: 30,
            trialDaysRemaining: 0,
            isTrial: false,
            totalOrders: 450
          },
          customerMetrics: {
            totalCustomers: 800,
            activeCustomers: 720,
            newCustomers: 120,
            totalOrders: 450,
            totalSpent: 280000,
            avgCustomerValue: 350,
            customerSegments: { premium: 150, regular: 450, new: 200 }
          },
          revenueMetrics: {
            totalRevenue: 280000,
            monthlyRevenue: 280000,
            avgOrderValue: 622,
            revenueGrowth: 12.5,
            revenueByMethod: mockRevenueByMethod,
            totalOrders: 450
          },
          retentionMetrics: {
            retentionRate: '85%',
            churnRisk: 'low',
            churnProbability: 15,
            customerLifetime: 18,
            repeatPurchaseRate: '72%',
            avgDaysBetweenOrders: 45,
            totalPurchases: 1200
          },
          healthMetrics: {
            status: 'healthy',
            score: 85,
            issues: [],
            recommendations: [
              'Consider upselling to premium customers',
              'Improve customer engagement with personalized offers',
              'Expand payment method options'
            ]
          },
          monthlyTrend: mockRevenueData.map(item => ({
            ...item,
            subscriptionActive: true,
            avgOrderValue: item.revenue / item.orders
          })),
          forecast: [
            { month: 'Jul', year: 2024, revenue: 320000, customers: 900, growth: 14.3, subscriptionValue: 300000 },
            { month: 'Aug', year: 2024, revenue: 360000, customers: 980, growth: 12.5, subscriptionValue: 320000 },
            { month: 'Sep', year: 2024, revenue: 400000, customers: 1050, growth: 11.1, subscriptionValue: 350000 }
          ],
          period: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          }
        });
      }

      // Fetch sales data
      const salesResponse = await fetch(`/api/dashboard/sales?range=${timeRange}`, {
        credentials: 'include',
      });

      if (salesResponse.ok) {
        const salesJson = await salesResponse.json();
        setSalesData(salesJson);
      }

      // Fetch revenue data
      const revenueResponse = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });

      if (revenueResponse.ok) {
        const revenueJson = await revenueResponse.json();
        setRevenueData(revenueJson);
      }

    } catch (error: any) {
      console.error('❌ Error fetching data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  // Calculate actual revenue values with fallback
  const calculateActualRevenue = () => {
    // Try API data first
    if (revenueMetrics?.totalRevenue > 0) return revenueMetrics.totalRevenue;
    
    // Try salesData
    if (salesData && salesData.length > 0) {
      return salesData.reduce((sum, item) => sum + (item.revenue || item.amount || 0), 0);
    }
    
    // Try revenueData
    if (revenueData && revenueData.length > 0) {
      return revenueData.reduce((sum, item) => sum + (item.revenue || item.amount || 0), 0);
    }
    
    // Use subscription metrics as fallback
    return subscriptionMetrics?.totalPaid || 280000;
  };

  const calculateActualMonthlyRevenue = () => {
    if (revenueMetrics?.monthlyRevenue > 0) return revenueMetrics.monthlyRevenue;
    if (subscriptionMetrics?.mrr > 0) return subscriptionMetrics.mrr;
    return subscriptionMetrics?.monthlyAmount || 280000;
  };

  const calculateActualCustomers = () => {
    if (customerMetrics?.totalCustomers > 0) return customerMetrics.totalCustomers;
    // if (revenueData?.totalCustomers) return revenueData.totalCustomers;
    return 800;
  };

  const calculateActualSales = () => {
    if (revenueMetrics?.totalOrders > 0) return revenueMetrics.totalOrders;
    if (subscriptionMetrics?.totalOrders > 0) return subscriptionMetrics.totalOrders;
    if (salesData && salesData.length > 0) return salesData.length;
    return 450;
  };

  // Show loading state
  if (loading && !subscriptionData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        backgroundColor: currentColors.background,
      }}>
        <Box textAlign="center">
          <CircularProgress sx={{ color: primaryColor }} />
          <Typography variant="body2" color={currentColors.textSecondary} sx={{ mt: 2 }}>
            Loading subscription analytics...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error && !subscriptionData) {
    return (
      <Box sx={{ 
        p: 3,
        backgroundColor: currentColors.background,
        minHeight: '100vh',
      }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchAllData}
          startIcon={<Refresh />}
          disabled={true}
          sx={{
            background: buttonColor,
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: buttonColor,
              opacity: 0.8,
            },
            '&.Mui-disabled': {
              background: buttonColor,
              color: 'white',
              opacity: 0.5,
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const data = subscriptionData!;
  const {
    currentSubscription,
    subscriptionMetrics,
    customerMetrics,
    revenueMetrics,
    retentionMetrics,
    healthMetrics,
    monthlyTrend,
    forecast,
    period
  } = data;

  const totalRevenue = calculateActualRevenue();
  const monthlyRevenue = calculateActualMonthlyRevenue();
  const totalCustomers = calculateActualCustomers();
  const totalSales = calculateActualSales();
  const avgOrderValue = revenueMetrics?.avgOrderValue || Math.round(totalRevenue / Math.max(totalSales, 1));

  return (
    <Box sx={{ 
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease',
      p: isMobile ? 1 : 2,
    }}>
      {/* Under Development Banner */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.15)} 0%, ${alpha(googleColors.yellow, 0.05)} 100%)`,
          border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
          borderRadius: '16px',
          backgroundColor: currentColors.card,
          transition: 'all 0.3s ease',
          boxShadow: mode === 'dark' 
            ? '0 2px 4px rgba(0,0,0,0.4)' 
            : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.2)} 0%, ${alpha(googleColors.yellow, 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
              }}
            >
              <Construction sx={{ fontSize: 28, color: googleColors.yellow }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600} color={googleColors.yellow} gutterBottom>
                🚧 Under Development
              </Typography>
              <Typography variant="body1" color={currentColors.textSecondary}>
                This page and all its features are currently under development. 
                Some features may not be available yet. We're working hard to bring you an amazing experience!
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Breadcrumbs sx={{ 
          mb: 1, 
          color: currentColors.textSecondary,
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          <Box
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: currentColors.textSecondary,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              "&:hover": { color: primaryColor },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: isMobile ? 16 : 20 }} />
            Dashboard
          </Box>
          <Typography color={currentColors.textPrimary} fontSize={isMobile ? '0.75rem' : '0.875rem'}>
            Subscription Analytics
          </Typography>
        </Breadcrumbs>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
            <Box
              sx={{
                width: isMobile ? 48 : 60,
                height: isMobile ? 48 : 60,
                borderRadius: isMobile ? 2 : 3,
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
              }}
            >
              <BarChart sx={{ 
                fontSize: isMobile ? 24 : 32, 
                color: 'white' 
              }} />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                📊 Subscription Analytics
              </Typography>
              <Typography
                variant="body1"
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.875rem' : '1rem'}
              >
                Advanced insights into your subscription performance
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size={isMobile ? "small" : "medium"}
              disabled
              sx={{
                background: currentColors.chipBackground,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                minWidth: isMobile ? 100 : 120,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border,
                },
                opacity: 0.7,
              }}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={true}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: buttonColor,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: buttonColor,
                  backgroundColor: alpha(buttonColor, 0.04),
                }
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
            
            {!isMobile && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                disabled={true}
                sx={{
                  border: `1px solid ${currentColors.border}`,
                  color: buttonColor,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    borderColor: buttonColor,
                    backgroundColor: alpha(buttonColor, 0.04),
                  }
                }}
              >
                Export
              </Button>
            )}
          </Box>
        </Box>

        {/* Auto-refresh toggle */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                size="small"
                disabled
                sx={{
                  color: primaryColor,
                  '&.Mui-checked': {
                    color: primaryColor,
                  }
                }}
              />
            }
            label="Auto-refresh every 5 minutes"
            sx={{
              color: currentColors.textPrimary,
              fontSize: isMobile ? '0.875rem' : '1rem',
            }}
          />
        </Box>
      </Box>

      {/* Current Subscription Status */}
      <SubscriptionStatus 
        currentSubscription={currentSubscription}
        subscriptionMetrics={subscriptionMetrics}
        currentColors={currentColors}
        isMobile={isMobile}
        googleColors={googleColors}
        alpha={alpha}
      />

      {/* Revenue & Customer Metrics Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        mb: 3,
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        {/* Total Revenue Card */}
        <MetricCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<AttachMoney />}
          color={googleColors.green}
          subtitle={`${revenueMetrics?.revenueGrowth > 0 ? '+' : ''}${Math.round(revenueMetrics?.revenueGrowth || 12.5)}% from last period`}
          trend={revenueMetrics?.revenueGrowth > 0 ? 'up' : 'down'}
          currentColors={currentColors}
          isMobile={isMobile}
          alpha={alpha}
        />
        
        {/* Monthly Revenue Card */}
        <MetricCard
          title="Monthly Revenue"
          value={`₹${monthlyRevenue.toLocaleString()}`}
          icon={<AccountBalance />}
          color={primaryColor}
          subtitle={subscriptionMetrics?.mrr ? `MRR: ₹${subscriptionMetrics.mrr.toLocaleString()}` : 'Current month'}
          currentColors={currentColors}
          isMobile={isMobile}
          alpha={alpha}
        />
        
        {/* Total Customers Card */}
        <MetricCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={<People />}
          color={googleColors.green}
          subtitle={`${customerMetrics?.activeCustomers || 720} active • ${customerMetrics?.newCustomers || 0} new this month`}
          currentColors={currentColors}
          isMobile={isMobile}
          alpha={alpha}
        />
        
        {/* Total Sales Card */}
        <MetricCard
          title="Total Sales"
          value={totalSales.toString()}
          icon={<ShoppingCart />}
          color={googleColors.yellow}
          subtitle={`Avg Order: ₹${avgOrderValue.toLocaleString()}`}
          currentColors={currentColors}
          isMobile={isMobile}
          alpha={alpha}
        />
      </Box>

      {/* Advanced Metrics Section */}
      <Card sx={{ 
        mb: 3, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            mb={3} 
            color={currentColors.textPrimary}
            fontSize={isMobile ? '1rem' : '1.125rem'}
          >
            📈 Advanced Metrics
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {/* Customer Lifetime Value */}
            <Box sx={{ 
              flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 24px)',
              minWidth: isMobile ? '100%' : '200px'
            }}>
              <Paper sx={{ 
                p: 2, 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography 
                  variant="body2" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  gutterBottom
                >
                  Customer Lifetime Value
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color={currentColors.textPrimary}
                >
                  ₹{(customerMetrics?.avgCustomerValue || 350).toLocaleString()}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                >
                  Per customer
                </Typography>
              </Paper>
            </Box>
            
            {/* Retention Rate */}
            <Box sx={{ 
              flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 24px)',
              minWidth: isMobile ? '100%' : '200px'
            }}>
              <Paper sx={{ 
                p: 2, 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography 
                  variant="body2" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  gutterBottom
                >
                  Retention Rate
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color={currentColors.textPrimary}
                >
                  {retentionMetrics?.retentionRate || '85%'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                >
                  Customer retention
                </Typography>
              </Paper>
            </Box>
            
            {/* Churn Risk */}
            <Box sx={{ 
              flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 24px)',
              minWidth: isMobile ? '100%' : '200px'
            }}>
              <Paper sx={{ 
                p: 2, 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography 
                  variant="body2" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  gutterBottom
                >
                  Churn Risk
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      background: currentColors.chipBackground,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${retentionMetrics?.churnProbability || 15}%`,
                        background: retentionMetrics?.churnRisk === 'high' 
                          ? googleColors.red 
                          : retentionMetrics?.churnRisk === 'medium' 
                          ? googleColors.yellow 
                          : googleColors.green,
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold" 
                    color={retentionMetrics?.churnRisk === 'high' 
                      ? googleColors.red 
                      : retentionMetrics?.churnRisk === 'medium' 
                      ? googleColors.yellow 
                      : googleColors.green}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    {retentionMetrics?.churnProbability || 15}%
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  color={retentionMetrics?.churnRisk === 'high' 
                    ? googleColors.red 
                    : retentionMetrics?.churnRisk === 'medium' 
                    ? googleColors.yellow 
                    : googleColors.green}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  fontWeight="medium"
                >
                  {(retentionMetrics?.churnRisk || 'low').charAt(0).toUpperCase() + (retentionMetrics?.churnRisk || 'low').slice(1)} Risk
                </Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)} 
        sx={{ 
          mb: 3, 
          borderBottom: `1px solid ${currentColors.border}`,
          '& .MuiTab-root': {
            color: currentColors.textSecondary,
            textTransform: 'none',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? 48 : 56,
            '&.Mui-selected': {
              color: primaryColor,
            }
          }
        }}
      >
        <Tab icon={<BarChart />} label="Overview" sx={{ minWidth: isMobile ? 80 : 100 }} />
        <Tab icon={<Timeline />} label="Revenue Analytics" sx={{ minWidth: isMobile ? 100 : 120 }} />
        <Tab icon={<People />} label="Customer Insights" sx={{ minWidth: isMobile ? 100 : 120 }} />
        <Tab icon={<Insights />} label="Advanced Metrics" sx={{ minWidth: isMobile ? 100 : 120 }} />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Main Content Area */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' }, 
            gap: 3 
          }}>
            {/* Revenue Trend Card */}
            <Card sx={{ 
              flex: 2, 
              background: currentColors.card, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  mb={3} 
                  color={currentColors.textPrimary}
                  fontSize={isMobile ? '1rem' : '1.125rem'}
                >
                  Revenue Trend
                </Typography>
                
                <RevenueTrend 
                  monthlyTrend={monthlyTrend}
                  totalRevenue={totalRevenue}
                  currentColors={currentColors}
                  primaryColor={primaryColor}
                  isMobile={isMobile}
                />
              </CardContent>
            </Card>

            {/* Health & Risk Analysis Card */}
            <HealthAnalysis 
              healthMetrics={healthMetrics}
              currentColors={currentColors}
              googleColors={googleColors}
              primaryColor={primaryColor}
              isMobile={isMobile}
              alpha={alpha}
            />
          </Box>
        </Box>
      )}

      {/* Revenue Analytics Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3,
            mb: 3 
          }}>
            {/* Revenue by Payment Method */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <PaymentMethodTable 
                revenueByMethod={revenueMetrics?.revenueByMethod || mockRevenueByMethod}
                currentColors={currentColors}
                primaryColor={primaryColor}
              />
            </Box>

            {/* Revenue Forecast */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <RevenueForecast 
                forecast={forecast.length > 0 ? forecast : [
                  { month: 'Jul', year: 2024, revenue: 320000, customers: 900, growth: 14.3, subscriptionValue: 300000 },
                  { month: 'Aug', year: 2024, revenue: 360000, customers: 980, growth: 12.5, subscriptionValue: 320000 },
                  { month: 'Sep', year: 2024, revenue: 400000, customers: 1050, growth: 11.1, subscriptionValue: 350000 }
                ]}
                currentColors={currentColors}
                googleColors={googleColors}
              />
            </Box>
          </Box>

          {/* Monthly Revenue Trend */}
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              background: currentColors.card, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
                  Monthly Revenue Trend
                </Typography>
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: currentColors.surface,
                  borderRadius: 2,
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timeline sx={{ 
                      fontSize: 48, 
                      color: primaryColor, 
                      mb: 2 
                    }} />
                    <Typography variant="body1" color={currentColors.textSecondary}>
                      Revenue trend chart would appear here
                    </Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Last 6 months total: ₹{totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Customer Insights Tab */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3,
            mb: 3 
          }}>
            {/* Customer Segments */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <CustomerSegments 
                customerSegments={mockCustomerSegments}
                currentColors={currentColors}
              />
            </Box>

            {/* Retention Metrics */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <RetentionMetrics 
                retentionMetrics={retentionMetrics}
                currentColors={currentColors}
                googleColors={googleColors}
                alpha={alpha}
              />
            </Box>
          </Box>

          {/* New vs Returning Customers */}
          <Box sx={{ mb: 3 }}>
            <CustomerAcquisition 
              customerMetrics={customerMetrics}
              currentColors={currentColors}
              googleColors={googleColors}
              primaryColor={primaryColor}
              isMobile={isMobile}
            />
          </Box>
        </Box>
      )}

      {/* Advanced Metrics Tab */}
      {activeTab === 3 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3,
            mb: 3 
          }}>
            {/* Subscription Metrics */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <SubscriptionMetrics 
                subscriptionMetrics={subscriptionMetrics}
                currentColors={currentColors}
              />
            </Box>

            {/* Revenue Metrics */}
            <Box sx={{ 
              flex: 1,
              minWidth: { xs: '100%', md: '50%' }
            }}>
              <RevenueMetrics 
                revenueMetrics={revenueMetrics}
                currentColors={currentColors}
                googleColors={googleColors}
              />
            </Box>
          </Box>

          {/* Analytics Summary */}
          <Box sx={{ mb: 3 }}>
            <AnalyticsSummary 
              revenueMetrics={revenueMetrics}
              customerMetrics={customerMetrics}
              retentionMetrics={retentionMetrics}
              currentColors={currentColors}
              primaryColor={primaryColor}
              googleColors={googleColors}
              alpha={alpha}
            />
          </Box>
        </Box>
      )}

      {/* Period Information */}
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="caption" 
          color={currentColors.textSecondary}
          fontSize={isMobile ? '0.75rem' : '0.875rem'}
        >
          Data period: {new Date(period?.startDate).toLocaleDateString()} - {new Date(period?.endDate).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
}