"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  MonetizationOn as RevenueIcon,
  ShoppingCart as OrderIcon,
  TrendingDown as ChurnIcon,
} from '@mui/icons-material';

// Report Components
import {
  ReportHeader,
  ReportChartCard,
  ReportMetricCard,
  ReportExportActions,
  ReportStatusGrid,
  RevenueLineChart,
  UserBarChart,
  PlanPieChart,
} from '@/components/reports';

interface ReportData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  userGrowth: Array<{ month: string; users: number }>;
  planDistribution: Array<{ name: string; value: number }>;
  paymentStatus: Array<{ status: string; count: number }>;
  subscriptionStatus: Array<{ status: string; count: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  metrics: {
    totalRevenue: number;
    activeUsers: number;
    newUsers: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    churnRate: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reports?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (type: string) => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: type,
          range: timeRange,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_report_${timeRange}_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError('Failed to download report');
      }
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <ReportHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onExport={handleExportReport}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Key Metrics - Replaced Grid with Flexbox */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="Total Revenue"
            value={formatCurrency(data?.metrics.totalRevenue || 0)}
            icon={<RevenueIcon />}
            color="success"
            loading={loading}
            trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="Active Users"
            value={(data?.metrics.activeUsers || 0).toLocaleString()}
            icon={<PeopleIcon />}
            color="primary"
            loading={loading}
            trend={{ value: 8.2, direction: 'up', label: 'vs last month' }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="New Users"
            value={(data?.metrics.newUsers || 0).toLocaleString()}
            icon={<PeopleIcon />}
            color="info"
            loading={loading}
            trend={{ value: 15.3, direction: 'up', label: 'vs last month' }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="Total Orders"
            value={(data?.metrics.totalOrders || 0).toLocaleString()}
            icon={<OrderIcon />}
            color="warning"
            loading={loading}
            trend={{ value: 5.7, direction: 'up', label: 'vs last month' }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="Avg Order Value"
            value={formatCurrency(data?.metrics.averageOrderValue || 0)}
            icon={<PaymentIcon />}
            color="secondary"
            loading={loading}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(16.666% - 24px)', minWidth: '200px' }}>
          <ReportMetricCard
            title="Churn Rate"
            value={`${(data?.metrics.churnRate || 0).toFixed(1)}%`}
            icon={<ChurnIcon />}
            color="error"
            loading={loading}
            trend={{ value: 0.5, direction: 'down', label: 'vs last month' }}
          />
        </Box>
      </Box>

      {/* Charts - Replaced Grid with Flexbox */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3 
      }}>
        {/* Revenue Chart */}
        <Box sx={{ flex: '1 1 calc(66.666% - 24px)', minWidth: '300px' }}>
          <ReportChartCard
            title="Revenue Trends"
            subtitle="Monthly revenue performance"
            icon={<TrendIcon color="primary" />}
            chart={<RevenueLineChart data={data?.monthlyRevenue || []} />}
            loading={loading}
          />
        </Box>

        {/* User Growth */}
        <Box sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '300px' }}>
          <ReportChartCard
            title="User Growth"
            subtitle="New user acquisition"
            icon={<PeopleIcon color="secondary" />}
            chart={<UserBarChart data={data?.userGrowth || []} />}
            loading={loading}
          />
        </Box>

        {/* Plan Distribution */}
        <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '300px' }}>
          <ReportChartCard
            title="Plan Distribution"
            subtitle="User subscription plans"
            icon={<PaymentIcon color="warning" />}
            chart={<PlanPieChart data={data?.planDistribution || []} />}
            loading={loading}
          />
        </Box>

        {/* Payment Status */}
        <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <ReportStatusGrid
                title="Payment Status Overview"
                items={(data?.paymentStatus || []).map((item, index) => ({
                  label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                  value: item.count,
                  color: COLORS[index % COLORS.length],
                }))}
                columns={2}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Subscription Status */}
        <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <ReportStatusGrid
                title="Subscription Status"
                items={(data?.subscriptionStatus || []).map((item, index) => ({
                  label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                  value: item.count,
                  color: COLORS[index % COLORS.length],
                }))}
                columns={2}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Top Products */}
        <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <ReportStatusGrid
                title="Top Products"
                items={(data?.topProducts?.slice(0, 4) || []).map((item, index) => ({
                  label: item.name,
                  value: item.sales,
                  color: COLORS[index % COLORS.length],
                }))}
                columns={2}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Export Actions - Replaced Grid with Box */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <ReportExportActions
              onExport={handleExportReport}
              fullWidth
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}