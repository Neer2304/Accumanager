// app/(pages)/analytics/page.tsx - SIMPLIFIED VERSION
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Alert,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  ShoppingCart,
  People,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline,
  AttachMoney as RevenueIcon,
  Inventory as LowStockIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  LineChart, 
  Line, 
  PieChart as RechartsPie, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for data
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    lowStockProducts: 0,
    pendingBills: 0,
  });
  
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from APIs like RecentActivity component does
      const [billingRes, customersRes, productsRes] = await Promise.all([
        fetch('/api/billing/recent?limit=50', { credentials: 'include' }),
        fetch('/api/customers?limit=50&sort=-createdAt', { credentials: 'include' }),
        fetch('/api/products?limit=100', { credentials: 'include' })
      ]);

      // Process billing data
      let invoices: any[] = [];
      if (billingRes.ok) {
        const data = await billingRes.json();
        invoices = data.orders || data.data || data;
        if (Array.isArray(invoices)) {
          setRecentInvoices(invoices.slice(0, 10));
          calculateStatsFromInvoices(invoices);
          calculateMonthlyData(invoices);
        }
      }

      // Process customers data
      let customers: any[] = [];
      if (customersRes.ok) {
        const data = await customersRes.json();
        customers = data.customers || data.data || data;
        if (Array.isArray(customers)) {
          setRecentCustomers(customers.slice(0, 5));
          setStats(prev => ({ ...prev, totalCustomers: customers.length }));
        }
      }

      // Process products data
      let products: any[] = [];
      if (productsRes.ok) {
        const data = await productsRes.json();
        products = data.products || data.data || data;
        if (Array.isArray(products)) {
          calculateProductStats(products);
          calculateCategoryData(products, invoices);
          calculateTopProductsData(products, invoices);
        }
      }

    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromInvoices = (invoices: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate total sales (quantity of items sold)
    let totalSales = 0;
    invoices.forEach(invoice => {
      if (invoice.items && Array.isArray(invoice.items)) {
        totalSales += invoice.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      }
    });
    
    // Calculate monthly revenue
    const monthlyRevenue = invoices
      .filter(invoice => {
        if (!invoice.invoiceDate) return false;
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate.getMonth() === currentMonth && 
               invoiceDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, invoice: any) => sum + (invoice.grandTotal || 0), 0);
    
    // Calculate pending bills
    const pendingBills = invoices.filter(invoice => 
      invoice.paymentStatus === 'pending' || 
      invoice.paymentStatus === 'unpaid' ||
      !invoice.paymentStatus
    ).length;
    
    setStats(prev => ({
      ...prev,
      totalSales,
      monthlyRevenue,
      pendingBills,
    }));
  };

  const calculateProductStats = (products: any[]) => {
    const lowStockItems = products.filter(product => {
      let totalStock = 0;
      
      // Check variations stock
      if (product.variations && Array.isArray(product.variations)) {
        totalStock += product.variations.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
      }
      
      // Check batches stock
      if (product.batches && Array.isArray(product.batches)) {
        totalStock += product.batches.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
      }
      
      // Use direct stock if no variations/batches
      if (totalStock === 0 && product.stock) {
        totalStock = product.stock;
      }
      
      return totalStock < 10;
    });
    
    setLowStockProducts(lowStockItems.slice(0, 5));
    setStats(prev => ({
      ...prev,
      totalProducts: products.length,
      lowStockProducts: lowStockItems.length,
    }));
  };

  const calculateMonthlyData = (invoices: any[]) => {
    const now = new Date();
    const monthlyDataArray = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(now.getMonth() - i);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const monthInvoices = invoices.filter(invoice => {
        if (!invoice.invoiceDate) return false;
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate.getMonth() === month.getMonth() && 
               invoiceDate.getFullYear() === month.getFullYear();
      });
      
      const monthRevenue = monthInvoices.reduce((sum: number, inv: any) => sum + (inv.grandTotal || 0), 0);
      
      const monthSales = monthInvoices.reduce((sum: number, inv: any) => {
        if (inv.items && Array.isArray(inv.items)) {
          return sum + inv.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
        }
        return sum;
      }, 0);
      
      monthlyDataArray.push({
        month: monthName,
        revenue: monthRevenue,
        sales: monthSales,
        profit: Math.round(monthRevenue * 0.3), // 30% profit margin
        invoices: monthInvoices.length
      });
    }
    
    setMonthlyData(monthlyDataArray);
  };

  const calculateCategoryData = (products: any[], invoices: any[]) => {
    const categoryMap: Record<string, number> = {};
    
    // Initialize categories
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
    });
    
    // Calculate revenue per category from invoices
    invoices.forEach(invoice => {
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach((item: any) => {
          // Find product category for this item
          const product = products.find(p => p.name === item.productName);
          const category = product?.category || 'Uncategorized';
          categoryMap[category] = (categoryMap[category] || 0) + (item.total || 0);
        });
      }
    });
    
    // Convert to array for chart
    const categoryArray = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
    
    setCategoryData(categoryArray);
  };

  const calculateTopProductsData = (products: any[], invoices: any[]) => {
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    
    // Calculate sales and revenue for each product
    invoices.forEach(invoice => {
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach((item: any) => {
          const productName = item.productName || 'Unknown Product';
          if (!productSales[productName]) {
            productSales[productName] = {
              name: productName,
              sales: 0,
              revenue: 0
            };
          }
          productSales[productName].sales += item.quantity || 0;
          productSales[productName].revenue += item.total || 0;
        });
      }
    });
    
    // Convert to array and sort by revenue
    const topProductsArray = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    setTopProducts(topProductsArray);
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  if (loading) {
    return (
      <MainLayout title="Business Analytics">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Business Analytics">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <button 
            onClick={fetchAllData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Retry Loading Data
          </button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Business Analytics">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              📊 Business Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time business performance metrics
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Key Stats Cards */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}>
          {/* Revenue Card */}
          <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RevenueIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                ₹{stats.monthlyRevenue.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                From {recentInvoices.length} invoices
              </Typography>
            </CardContent>
          </Card>
          
          {/* Sales Card */}
          <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart sx={{ color: '#9c27b0', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Sales
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {stats.totalSales}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Items sold
              </Typography>
            </CardContent>
          </Card>
          
          {/* Customers Card */}
          <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Customers
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.totalCustomers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {recentCustomers.length} new recently
              </Typography>
            </CardContent>
          </Card>
          
          {/* Products Card */}
          <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LowStockIcon sx={{ color: '#ed6c02', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Products
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.totalProducts}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.lowStockProducts} low in stock
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Charts Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Revenue & Sales Trend
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3 
          }}>
            {/* Revenue Chart */}
            <Card sx={{ flex: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'revenue' || name === 'profit') {
                          return [`₹${Number(value).toLocaleString()}`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Revenue"
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Sales"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Chart */}
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Revenue by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3 
        }}>
          {/* Top Products */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Top Products
              </Typography>
              {topProducts.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topProducts.map((product, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: index === 0 ? alpha('#1976d2', 0.05) : 'transparent'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.sales} units sold
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ₹{product.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No sales data available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📈 Recent Invoices
              </Typography>
              {recentInvoices.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentInvoices.slice(0, 5).map((invoice, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 2,
                        borderBottom: index < 4 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {invoice.invoiceNumber || `INV-${index + 1}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(invoice.invoiceDate || new Date()).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          ₹{(invoice.grandTotal || 0).toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: invoice.paymentStatus === 'paid' ? 'success.main' : 
                                  invoice.paymentStatus === 'pending' ? 'error.main' : 'warning.main',
                            fontWeight: 500
                          }}
                        >
                          {invoice.paymentStatus || 'Pending'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No invoice data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}