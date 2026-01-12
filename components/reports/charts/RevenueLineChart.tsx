import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RevenueLineChartProps {
  data: Array<{ month: string; revenue: number }>;
  height?: number;
  color?: string;
}

const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
  data,
  height = 300,
  color = '#8884d8',
}) => {
  return (
    <LineChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip 
        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
        labelFormatter={(label) => `Month: ${label}`}
      />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="revenue" 
        stroke={color} 
        strokeWidth={2}
        activeDot={{ r: 8 }} 
      />
    </LineChart>
  );
};

export default RevenueLineChart;