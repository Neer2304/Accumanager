// components/googlereports/charts/StatusPieChart.tsx
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
import { StatusDistribution } from '../components/types';

interface StatusPieChartProps {
  data: StatusDistribution[];
  title?: string;
}

const COLORS = ['#34a853', '#fbbc04', '#ea4335', '#4285f4', '#8ab4f8', '#aecbfa'];

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data, title }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const formattedData = data.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count
  }));

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
            Count: {payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
      <Pie
        data={formattedData}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={70}
        paddingAngle={2}
        dataKey="value"
        label
        labelLine={{ stroke: darkMode ? '#9aa0a6' : '#5f6368', strokeWidth: 1 }}
      >
        {formattedData.map((entry, index) => (
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