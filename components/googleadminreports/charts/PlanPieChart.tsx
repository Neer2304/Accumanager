// components/googlereports/charts/PlanPieChart.tsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme, Box, Typography } from '@mui/material';
import { PlanDistribution } from '../components/types';

interface PlanPieChartProps {
  data: PlanDistribution[];
}

const COLORS = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#8ab4f8', '#aecbfa'];

export const PlanPieChart: React.FC<PlanPieChartProps> = ({ data }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '8px',
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            {payload[0].name}
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Users: {payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={2}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelLine={{ stroke: darkMode ? '#9aa0a6' : '#5f6368', strokeWidth: 1 }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend 
        wrapperStyle={{ color: darkMode ? '#e8eaed' : '#202124' }}
        formatter={(value) => <span style={{ color: darkMode ? '#e8eaed' : '#202124' }}>{value}</span>}
      />
    </PieChart>
  );
};