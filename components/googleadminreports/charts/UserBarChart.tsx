// components/googlereports/charts/UserBarChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme, Box, Typography } from '@mui/material';
import { UserGrowth } from '../components/types';

interface UserBarChartProps {
  data: UserGrowth[];
}

export const UserBarChart: React.FC<UserBarChartProps> = ({ data }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

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
            <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: '#4285f4' }} />
            <Typography variant="caption" color="text.secondary">
              New Users:
            </Typography>
            <Typography variant="caption" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {payload[0].value.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="users" fill="#4285f4" radius={[4, 4, 0, 0]} barSize={30}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill="#4285f4" />
        ))}
      </Bar>
    </BarChart>
  );
};