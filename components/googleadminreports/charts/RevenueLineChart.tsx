// components/googlereports/charts/RevenueLineChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useTheme, alpha, Typography, Box } from '@mui/material';
import { MonthlyRevenue } from '../components/types';

interface RevenueLineChartProps {
  data: MonthlyRevenue[];
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ data }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '8px',
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: darkMode ? '#e8eaed' : '#202124' }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: '#34a853' }} />
            <Typography variant="caption" color="text.secondary">
              Revenue:
            </Typography>
            <Typography variant="caption" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              ₹{payload[0].value.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#34a853" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#34a853" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={darkMode ? '#3c4043' : '#dadce0'} 
        vertical={false}
      />
      <XAxis 
        dataKey="month" 
        stroke={darkMode ? '#9aa0a6' : '#5f6368'}
        tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
      />
      <YAxis 
        stroke={darkMode ? '#9aa0a6' : '#5f6368'}
        tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
        tickFormatter={formatYAxis}
      />
      <Tooltip content={<CustomTooltip />} />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#34a853" 
        fill="url(#revenueGradient)"
        strokeWidth={2}
      />
    </AreaChart>
  );
};