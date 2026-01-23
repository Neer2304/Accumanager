// components/analytics/RevenueChart.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartIcon } from '@/assets/icons/AnalyticsIcons';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    sales: number;
    profit: number;
    invoices: number;
  }>;
  loading?: boolean;
  isMobile?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  loading = false,
  isMobile = false 
}) => {
  const chartHeight = isMobile ? 250 : 300;

  if (loading || !data || data.length === 0) {
    return (
      <Card sx={{ 
        flex: 2,
        height: isMobile ? 'auto' : '100%'
      }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography 
            variant={isMobile ? "body2" : "subtitle1"} 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            <ChartIcon />
            Monthly Performance
          </Typography>
          <div style={{ 
            height: chartHeight, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography 
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {loading ? 'Loading chart data...' : 'No data available'}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      flex: 2,
      height: isMobile ? 'auto' : '100%'
    }}>
      <CardContent sx={{ p: isMobile ? 1 : 2 }}>
        <Typography 
          variant={isMobile ? "body2" : "subtitle1"} 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          <ChartIcon />
          Monthly Performance
        </Typography>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={data} margin={isMobile ? { top: 5, right: 5, left: 0, bottom: 5 } : { top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={5}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => isMobile ? `₹${(value/1000)}k` : `₹${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue' || name === 'profit') {
                  return [`₹${Number(value).toLocaleString()}`, name];
                }
                return [value, name];
              }}
              contentStyle={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? 5 : 10
              }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                paddingTop: isMobile ? 5 : 10
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              strokeWidth={isMobile ? 1.5 : 2}
              name="Revenue"
              dot={{ r: isMobile ? 3 : 4 }}
              activeDot={{ r: isMobile ? 4 : 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#82ca9d" 
              strokeWidth={isMobile ? 1.5 : 2}
              name="Sales"
              dot={{ r: isMobile ? 3 : 4 }}
              activeDot={{ r: isMobile ? 4 : 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;