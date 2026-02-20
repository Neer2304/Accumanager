// components/googlereports/hooks/useReports.ts
import { useState, useEffect, useCallback } from 'react';
import { ReportData } from '../components/types';

const COLORS = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#8ab4f8', '#aecbfa'];

export const useReports = (initialTimeRange: string = 'monthly') => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(initialTimeRange);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/reports?range=${timeRange}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExportReport = useCallback(async (type: string) => {
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
        credentials: 'include',
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
  }, [timeRange]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const getStatusColor = useCallback((index: number) => {
    return COLORS[index % COLORS.length];
  }, []);

  const handleTimeRangeChange = useCallback((newTimeRange: string) => {
    setTimeRange(newTimeRange);
  }, []);

  return {
    data,
    loading,
    error,
    timeRange,
    setError,
    fetchReportData,
    handleExportReport,
    handleTimeRangeChange,
    formatCurrency,
    getStatusColor,
  };
};