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
  isMobile?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

const CategoryChart: React.FC<CategoryChartProps> = ({ 
  data, 
  loading = false,
  isMobile = false 
}) => {
  const chartHeight = isMobile ? 250 : 300;
  const outerRadius = isMobile ? 60 : 80;

  if (loading || !data || data.length === 0) {
    return (
      <Card sx={{ 
        flex: 1,
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
            <PieChartIcon />
            Revenue by Category
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
              {loading ? 'Loading category data...' : 'No category data available'}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      flex: 1,
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
          <PieChartIcon />
          Revenue by Category
        </Typography>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) => 
              //   percent > 0.05 && !isMobile 
              //     ? `${name}: ${(percent * 100).toFixed(0)}%` 
              //     : ''
              // }
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
              contentStyle={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? 5 : 10
              }}
            />
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;