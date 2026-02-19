// components/googleanalytics/hooks/useAnalyticsPage.ts
import { useState } from 'react';
import { useTheme } from '@mui/material';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface AnalyticsData {
  stats: {
    monthlyRevenue: number;
    totalSales: number;
    totalCustomers: number;
    totalProducts?: number;
    lowStockProducts?: number;
  };
  recentInvoices: Array<{
    invoiceNumber: string;
    invoiceDate: Date;
    grandTotal: number;
    paymentStatus: string;
    customer: {
      name: string;
    };
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    sales: number;
    profit: number;
    invoices: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export const useAnalyticsPage = (timeRange: string = 'monthly') => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const { 
    data, 
    isLoading, 
    error, 
    isOnline, 
    refetch, 
    downloadReport 
  } = useAnalytics(timeRange);

  const isDataValid = (data: any): data is AnalyticsData => {
    return data && 
           data.stats && 
           data.recentInvoices !== undefined && 
           data.topProducts !== undefined;
  };

  const calculateStats = () => {
    if (!isDataValid(data)) return null;

    const totalMessages = data.recentInvoices.length || 0;
    const unreadMessages = data.recentInvoices.filter(inv => inv.paymentStatus === 'pending').length || 0;
    const starredMessages = data.topProducts.length || 0;
    const meetingInvites = data.categoryData?.length || 0;
    const pendingMeetings = data.monthlyData?.filter(m => m.revenue > 0).length || 0;
    const attachments = data.stats.totalProducts || 0;

    return {
      totalMessages,
      unreadMessages,
      starredMessages,
      meetingInvites,
      pendingMeetings,
      attachments
    };
  };

  const handleDownloadReport = async () => {
    const success = await downloadReport();
    if (success) {
      console.log('Report downloaded successfully');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const stats = calculateStats();
  const isValidData = isDataValid(data);

  return {
    darkMode,
    data,
    isLoading,
    error,
    isOnline,
    stats,
    isValidData,
    refetch,
    handleDownloadReport,
    handleBack
  };
};