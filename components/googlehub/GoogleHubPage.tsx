// app/hub/page.tsx - Using GoogleHub Components
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  Typography,
  FormControl,
  Select,
  MenuItem,
  alpha,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  Warning,
  CheckCircle,
  ShowChart,
  RocketLaunch,
  PersonAdd,
  Receipt,
  Assessment,
  Download,
  AccountBalanceWallet,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import {
  GoogleHubContainer,
  GoogleHubHeader,
  GoogleHubSection,
  GoogleHubMetricCard,
  GoogleHubCard,
  GoogleHubTable,
  GoogleHubChart,
  GoogleHubAlert,
  GoogleHubSkeleton,
  googleColors,
} from '@/components/googlehub'
import { useInventoryData } from '@/hooks/useInventoryData'

export default function BusinessHubPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [refreshing, setRefreshing] = useState(false)

  const {
    products,
    metrics: inventoryMetrics,
    loading: inventoryLoading,
    fetchProducts,
    calculateTotalStock,
    getStockStatus,
    getMinStockLevel,
    getCategoryColor,
  } = useInventoryData()

  const fetchAllData = async () => {
    setRefreshing(true)
    try {
      const [statsRes, salesRes, customersRes] = await Promise.all([
        fetch('/api/dashboard/stats', { credentials: 'include' }),
        fetch(`/api/dashboard/sales?range=${selectedPeriod}`, { credentials: 'include' }),
        fetch('/api/customers?limit=5', { credentials: 'include' }),
      ])

      if (statsRes.ok) setDashboardStats(await statsRes.json())
      if (salesRes.ok) setSalesData(await salesRes.json())
      if (customersRes.ok) {
        const data = await customersRes.json()
        setCustomers(data.customers || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [selectedPeriod])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value)
  }

  if (loading) {
    return (
      <MainLayout title="Business Hub">
        <GoogleHubContainer>
          <GoogleHubHeader
            title="Business Hub"
            subtitle="Your complete business overview with real-time data"
            icon={<RocketLaunch />}
            onRefresh={fetchAllData}
            refreshing={refreshing}
          />
          <GoogleHubSkeleton type="metric" count={4} />
          <Box sx={{ mt: 4 }}>
            <GoogleHubSkeleton type="chart" />
          </Box>
        </GoogleHubContainer>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Business Hub">
      <GoogleHubContainer>
        {/* Header */}
        <GoogleHubHeader
          title="Business Hub"
          subtitle="Your complete business overview with real-time data"
          icon={<RocketLaunch />}
          onRefresh={fetchAllData}
          refreshing={refreshing}
          actions={
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
              >
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          }
          stats={[
            {
              label: 'Plan',
              value: dashboardStats?.subscription?.plan || 'Free',
              color: googleColors.blue,
            },
            {
              label: 'Products',
              value: dashboardStats?.totalProducts || 0,
              color: googleColors.green,
            },
            {
              label: 'Customers',
              value: dashboardStats?.totalCustomers || 0,
              color: googleColors.purple,
            },
          ]}
        />

        {/* Error Alert */}
        {error && (
          <GoogleHubAlert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            sx={{ mb: 3 }}
          />
        )}

        {/* Key Metrics Section */}
        <GoogleHubSection
          title="Key Metrics"
          subtitle="Real-time overview of your business performance"
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Revenue Card */}
            <GoogleHubMetricCard
              title="Total Revenue"
              value={formatCurrency(dashboardStats?.totalRevenue || 0)}
              subtitle={`Monthly: ${formatCurrency(dashboardStats?.monthlyRevenue || 0)}`}
              icon={<RevenueIcon />}
              color={googleColors.green}
              trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
            />

            {/* Sales Card */}
            <GoogleHubMetricCard
              title="Total Sales"
              value={formatNumber(dashboardStats?.totalSales || 0)}
              subtitle={`Pending: ${dashboardStats?.pendingBills || 0} orders`}
              icon={<OrdersIcon />}
              color={googleColors.blue}
            />

            {/* Customers Card */}
            <GoogleHubMetricCard
              title="Total Customers"
              value={formatNumber(dashboardStats?.totalCustomers || 0)}
              icon={<PeopleIcon />}
              color={googleColors.purple}
            />

            {/* Products Card */}
            <GoogleHubMetricCard
              title="Total Products"
              value={formatNumber(dashboardStats?.totalProducts || 0)}
              subtitle={`Low stock: ${dashboardStats?.lowStockProducts || inventoryMetrics.lowStock || 0}`}
              icon={<InventoryIcon />}
              color={googleColors.orange}
            />
          </Box>
        </GoogleHubSection>

        {/* Sales Chart & Customers Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {/* Sales Chart */}
          <Box sx={{ width: { xs: '100%', md: 'calc(60% - 12px)' } }}>
            <GoogleHubCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShowChart sx={{ color: googleColors.blue }} />
                  Sales Overview
                </Typography>
                <Button size="small" endIcon={<RocketLaunch />} href="/reports/sales">
                  View Details
                </Button>
              </Box>

              <GoogleHubChart
                data={salesData.map(item => ({
                  date: new Date(item.date).getDate().toString(),
                  value: item.revenue,
                  label: `${item.date}: ${formatCurrency(item.revenue)}`,
                }))}
                barColor={googleColors.blue}
                loading={loading}
                valueFormatter={(value) => formatCurrency(value)}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Orders
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {salesData.reduce((sum, item) => sum + item.sales, 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {formatCurrency(salesData.reduce((sum, item) => sum + item.revenue, 0))}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Items Sold
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {salesData.reduce((sum, item) => sum + (item.totalItems || 0), 0)}
                  </Typography>
                </Box>
              </Box>
            </GoogleHubCard>
          </Box>

          {/* Recent Customers */}
          <Box sx={{ width: { xs: '100%', md: 'calc(40% - 12px)' } }}>
            <GoogleHubCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ color: googleColors.purple }} />
                  Recent Customers
                </Typography>
                <Button size="small" endIcon={<RocketLaunch />} href="/customers">
                  View All
                </Button>
              </Box>

              <GoogleHubTable
                columns={[
                  { id: 'name', label: 'Name', render: (item) => (
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.city || 'No city'}
                      </Typography>
                    </Box>
                  )},
                  { id: 'orders', label: 'Orders', align: 'right', render: (item) => (
                    <Chip 
                      label={item.totalOrders || 0}
                      size="small"
                      sx={{ bgcolor: alpha(googleColors.blue, 0.1), color: googleColors.blue }}
                    />
                  )},
                  { id: 'spent', label: 'Spent', align: 'right', render: (item) => (
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(item.totalSpent || 0)}
                    </Typography>
                  )},
                ]}
                data={customers}
                loading={loading}
                emptyMessage="No customers yet"
                onRowClick={(customer) => window.location.href = `/customers/${customer._id}`}
              />
            </GoogleHubCard>
          </Box>
        </Box>

        {/* Low Stock Alert Section */}
        {dashboardStats?.lowStockProducts > 0 && (
          <Box sx={{ mb: 6 }}>
            <GoogleHubAlert
              type="warning"
              title="Low Stock Alert"
              message={`You have ${dashboardStats.lowStockProducts} products that need attention.`}
              action={
                <Button color="inherit" size="small" href="/inventory?filter=lowStock">
                  View Now
                </Button>
              }
            />
          </Box>
        )}

        {/* Quick Actions Section */}
        <GoogleHubSection
          title="Quick Actions"
          subtitle="Common tasks to manage your business"
          icon={<RocketLaunch />}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              href="/customers/new"
              sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' }, justifyContent: 'flex-start' }}
            >
              Add Customer
            </Button>
            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              href="/products/new"
              sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' }, justifyContent: 'flex-start' }}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
              href="/invoices/new"
              sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' }, justifyContent: 'flex-start' }}
            >
              Create Invoice
            </Button>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              href="/reports"
              sx={{ width: { xs: '100%', sm: 'calc(33.333% - 11px)' }, justifyContent: 'flex-start' }}
            >
              Generate Report
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              href="/export"
              sx={{ 
                width: { xs: '100%', sm: 'calc(33.333% - 11px)' }, 
                justifyContent: 'flex-start',
                bgcolor: googleColors.blue,
              }}
            >
              Export Data
            </Button>
          </Box>
        </GoogleHubSection>

        {/* Usage Summary */}
        <GoogleHubCard gradient>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountBalanceWallet sx={{ color: googleColors.blue, fontSize: 40 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>Usage Summary</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {dashboardStats?.subscription?.plan || 'Free'} Plan · {dashboardStats?.totalProducts || 0}/{dashboardStats?.subscription?.limits?.products || 1000} products
                </Typography>
              </Box>
            </Box>
            <Button variant="contained" sx={{ bgcolor: googleColors.blue }}>
              Upgrade Plan
            </Button>
          </Box>
        </GoogleHubCard>
      </GoogleHubContainer>
    </MainLayout>
  )
}