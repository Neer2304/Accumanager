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
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  if (loading || !data || data.length === 0) {
    return (
      <Card sx={{ flex: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChartIcon />
            Monthly Performance
          </Typography>
          <div style={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary">
              {loading ? 'Loading chart data...' : 'No data available'}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Monthly Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
  );
};

export default RevenueChart;