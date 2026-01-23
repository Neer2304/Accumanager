// components/analytics/CategoryChart.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PieChartIcon } from '@/assets/icons/AnalyticsIcons';

interface CategoryChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

const CategoryChart: React.FC<CategoryChartProps> = ({ data, loading = false }) => {
  if (loading || !data || data.length === 0) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PieChartIcon />
            Revenue by Category
          </Typography>
          <div style={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary">
              {loading ? 'Loading category data...' : 'No category data available'}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PieChartIcon />
          Revenue by Category
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
            //   label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;